import xarray as xr
import numpy as np
import numba
from scipy.optimize import root_scalar
import sys

@numba.njit
def es_calc_bolton(temp):
    # in hPa

    tmelt  = 273.15
    tempc = temp - tmelt
    es = 6.112 * np.exp( 17.67 * tempc / (243.5+tempc) )
    return es

@numba.njit
def es_calc(temp):

    tmelt  = 273.15

    c0=0.6105851e+03
    c1=0.4440316e+02
    c2=0.1430341e+01
    c3=0.2641412e-01
    c4=0.2995057e-03
    c5=0.2031998e-05
    c6=0.6936113e-08
    c7=0.2564861e-11
    c8=-.3704404e-13

    tempc = temp - tmelt
    if tempc < -80:
        # in Pa
        es=es_calc_bolton(temp)*100.
    else:
        # in Pa
        es=c0+tempc*(c1+tempc*(c2+tempc*(c3+tempc*(c4+tempc*(c5+tempc*(c6+tempc*(c7+tempc*c8)))))))

    return es

@numba.njit
def lhs_func(T, theta, rhs):
#    lhs = (34.494-(4924.99/(T-36.05)))/np.power(T-168.15, 1.57) - 1004.64/287.04 * np.log(T)
    P_lcl = np.power(T/theta, 1004.64/287.04) * 100000.
    lhs = es_calc(T) / P_lcl
    return lhs - rhs

def calc_lcl(theta, q):
#    rhs = 1004.64/287.04 * np.log(theta) + np.log(100000.) + np.log(q/(0.622+0.378*q))
    rhs = q/(0.622+0.378*q)
    solution = root_scalar(lhs_func, args=(theta,rhs,), bracket=[50., 400.], method='brentq')
    if solution.converged:
        T_lcl = solution.root
        P_lcl = np.power(T_lcl/theta, 1004.64/287.04) * 100000.
        return P_lcl, T_lcl
    else:
        print("No solution found within the specified range.")
        sys.exit()

@numba.njit
def theta_e_calc(press, temp, q):
# https://github.com/NOAA-GFDL/MDTF-diagnostics/blob/main/diagnostics/precip_buoy_diag/vert_cython.pyx#L295
# Bolton (1980)

    pref = 100000.
    RV=461.5
    RD=287.04
    EPS=RD/RV

    r = q / (1. - q)

    # get ev in hPa
    ev = press * r / (EPS + r)
    ev_hPa = ev / 100.

    #get TL
    TL = (2840. / ((3.5 * np.log(temp)) - (np.log(ev_hPa)) - 4.805)) + 55.

    #calc chi_e:
    chi_e = 0.2854 * (1. - (0.28 * r))

    theta_e = temp * np.power((pref / press), chi_e) * np.exp(((3.376 / TL) - 0.00254) * r * 1000. * (1. + (0.81 * r)))
    return theta_e

@numba.njit
def solve_T_moist(T, theta_e, pres, q):
    es = es_calc(T)
    q = np.minimum(q, 0.622*es / (pres - (1-0.622)*es ))
    q = np.maximum(q, 0.)
    lhs = theta_e_calc(pres, T, q)
    return lhs - theta_e

def T_parcel_moist(theta_e, pres, Q0):
    solution = root_scalar(solve_T_moist, args=(theta_e, pres, Q0), bracket=[50, 400], method='brentq')
    if solution.converged:
        T = solution.root
    else:
        print("No solution found within the specified range.")
        T = np.nan
    return T

@numba.njit
def vintp(var, pres, plevs):
    out = np.empty_like(plevs)
    out = np.interp(plevs, pres, var)
    return out

if __name__ == '__main__':
    # Load the data
    casename = '/data/W.eddie/AQUA/GoAmazon_sounding_2014-11-22T0530'
    ds = xr.open_dataset(casename+'_0.9x1.25_L30.nc', decode_times=False).isel(lat=0, lon=0).squeeze()
    pres = ds.hyam * ds.P0 + ds.hybm * ds.PS
    presi = ds.hyai * ds.P0 + ds.hybi * ds.PS
    dp = pres[1:].values - pres[:-1].values
    theta = ds.T * (100000. / pres) ** (287.04 / 1004.64)
    theta_e = theta_e_calc(pres.values, ds.T.values, ds.Q.values)
    theta_es = np.zeros(theta_e.shape)
    for k in range(len(theta_es)):
        es = es_calc(ds.T[k].values)
        qs = 0.622 * es / (pres[k].values - (1 - 0.622) * es)
        theta_es[k] = theta_e_calc(pres[k].values, ds.T[k].values, qs)
    Tv = ds.T * (1 + 0.608 * ds.Q)
    CIN = np.zeros(pres.shape)
    for k in range(1,len(pres)):
        if (theta_e[k]<theta_es[:k]).all():
            CIN[k] = np.nan
            continue
        print(f'k={k}')
        P_lcl, T_lcl = calc_lcl(theta[k].values, ds.Q[k].values)
        for kk in range(k-1,0,-1):
            T_parcel = np.where(pres[kk] < P_lcl,
                                T_parcel_moist(theta_e[k], pres[kk].values, ds.Q[k].values),
                                theta[k].values * np.power(pres[kk].values / 100000., 287.04 / 1004.64))
            es_parcel = es_calc(T_parcel)
            qs_parcel = 0.622 * es_parcel / (pres.values[kk] - (1 - 0.622) * es_parcel)
            Q_parcel = np.where(pres[kk] < P_lcl, qs_parcel, ds.Q[kk].values)
            Tv_parcel = T_parcel * (1 + 0.608 * Q_parcel)
            CIN_temp = 287.04 * (Tv_parcel - Tv[kk].values) / pres[kk].values * dp[kk]
            print(f'kk={kk}', f'CIN={CIN_temp}')
            if CIN_temp > 0:
                break
            CIN[k] += CIN_temp
    w = np.sqrt(2. * -CIN)
    wi = vintp(w, pres.values, presi.values)
    np.savetxt(f'{casename}_w_each.txt', w, fmt='%.16f')
    np.savetxt(f'{casename}_wi_each.txt', w, fmt='%.16f')
    CIN = xr.DataArray(
        CIN,
        name='CIN',
        dims=['pressure'],
        coords={'pressure': pres.values},
        attrs={'units': 'J/kg'}
    )
    CIN.to_netcdf('Init_CIN_each.nc')
    W = xr.DataArray(
        w,
        name='W',
        dims=['pressure'],
        coords={'pressure': pres.values},
        attrs={'units': 'm/s',
               'long_name': 'vertical velocity corresponding to CIN'}
    )
    W.to_netcdf('W2CIN_each.nc')
    WI = xr.DataArray(
        wi,
        name='WI',
        dims=['pressure'],
        coords={'pressure': presi.values},
        attrs={'units': 'm/s',
               'long_name': 'vertical velocity corresponding to CIN at interface'}
    )
    WI.to_netcdf('WI2CIN_each.nc')