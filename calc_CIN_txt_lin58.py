import xarray as xr
import numpy as np
import numba
import pandas as pd
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

def solve_Qfromthetae(Q, theta_e, pres, temp):
    lhs = theta_e_calc(pres, temp, Q)
    return lhs - theta_e

def Q_from_theta_e(theta_e, pres, temp):
    solution = root_scalar(solve_Qfromthetae, args=(theta_e, pres, temp), bracket=[0., 0.1], method='brentq')
    if solution.converged:
        Q = solution.root
    else:
        print("No solution found within the specified range.")
        Q = np.nan
    return Q

if __name__ == '__main__':
    # Load the data
    casename = 'lin58'
    txtfile = f'inic_{casename}.txt'
    PS = 100325.734375
    colspecs = [(0, 15), (16, 31), (32, 47), (48, 73), (74, 203)]
    df = pd.read_fwf(txtfile, colspecs=colspecs, skiprows=1, header=None,
                     names=['Height', 'P', 'T', 'Q', 'dummy'])
    pres = df['P'].values
    T = df['T'].values
    Q = df['Q'].values
    dp = pres[:-1] - pres[1:]
    theta = T * (100000. / pres) ** (287.04 / 1004.64)
    theta_e = theta_e_calc(pres, T, Q)
    theta_es = np.zeros(theta_e.shape)
    es = np.empty(T.shape)
    for k in range(len(theta_es)):
        es[k] = es_calc(T[k])
        qs = 0.622 * es[k] / (pres[k] - (1 - 0.622) * es[k])
        theta_es[k] = theta_e_calc(pres[k], T[k], qs)
    e = pres*Q/(0.622+0.378*Q)
    q_new = Q.copy()
    print([f"{x:.18e}" for x in q_new])
    Tv = T * (1 + 0.608 * q_new)
    CIN = np.zeros(pres.shape)
    for k in range(len(pres)):
        if (theta_e[k]<theta_es[k+1:]).all():
            CIN[k] = np.nan
            continue
        print(f'k={k}')
        P_lcl, T_lcl = calc_lcl(theta[k], q_new[k])
        for kk in range(k+1, len(pres)):
            T_parcel = np.where(pres[kk] < P_lcl,
                                T_parcel_moist(theta_e[k], pres[kk], q_new[k]),
                                theta[k] * np.power(pres[kk] / 100000., 287.04 / 1004.64))
            es_parcel = es_calc(T_parcel)
            qs_parcel = 0.622 * es_parcel / (pres[kk] - (1 - 0.622) * es_parcel)
            Q_parcel = np.where(pres[kk] < P_lcl, qs_parcel, q_new[kk])
            Tv_parcel = T_parcel * (1 + 0.608 * Q_parcel)
            CIN_temp = 287.04 * (Tv_parcel - Tv[kk]) / pres[kk] * dp[kk]
            if CIN_temp > 0:
                break
            CIN[k] += CIN_temp
    w = np.sqrt(2. * -CIN)
    CIN = xr.DataArray(
        CIN,
        name='CIN',
        dims=['pressure'],
        coords={'pressure': pres},
        attrs={'units': 'J/kg'}
    )
    CIN.to_netcdf('Init_CIN_lin58.nc')
    W = xr.DataArray(
        w,
        name='W',
        dims=['pressure'],
        coords={'pressure': pres},
        attrs={'units': 'm/s',
               'long_name': 'vertical velocity corresponding to CIN'}
    )
    W.to_netcdf('W2CIN_lin58.nc')
