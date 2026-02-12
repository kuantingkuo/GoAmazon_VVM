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
def theta_e_calc_bolton(press, temp, q):
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
def theta_e_calc(p, T, q_v):
    q_l = 0.
    q_i = 0.
    """
    Calculate equivalent potential temperature (theta_e) based on the provided equations
    and using the exact constants from the reference table.

    Parameters:
    -----------
    T : float
        Temperature in Kelvin
    p : float
        Pressure in Pa
    p0 : float
        Reference pressure (typically 100,000 Pa)
    q_v : float
        Specific humidity of water vapor (kg/kg)
    q_l : float, optional
        Specific humidity of liquid water (kg/kg), default is 0
    q_i : float, optional
        Specific humidity of ice (kg/kg), default is 0

    Returns:
    --------
    float
        Equivalent potential temperature (theta_e) in Kelvin
    """
    # Physical constants (values from the provided table)
    R_d = 0.2870 * 1000    # Gas constant for dry air (J/kg/K)
    R_v = 0.4615 * 1000    # Gas constant for water vapor (J/kg/K)
    c_pd = 1.005 * 1000    # Specific heat of dry air at constant pressure (J/kg/K)
    c_pv = 1.865 * 1000    # Specific heat of water vapor at constant pressure (J/kg/K)
    c_pl = 4.219 * 1000    # Specific heat of liquid water (J/kg/K)
    c_pi = 2.097 * 1000    # Specific heat of ice (J/kg/K)
    L_v = 2500.9 * 1000    # Latent heat of vaporization (J/kg)
    L_i = 333.4 * 1000     # Latent heat of fusion (J/kg)
    T_t = 273.16           # Triple point temperature (K)
    p0 = 100000. # (Pa)

    q_t = q_v + q_l + q_i
    R = R_d + q_v * R_v - q_t * R_d # 2.5
    # Calculate the specific heat of the system
#    c_p = c_pd + q_v * (c_pv - c_pd) + q_l * (c_pl - c_pd) + q_i * (c_pi - c_pd)
    c_p = c_pd + q_v * (c_pl - c_pd) # 2.23

    R_e = (1 - q_t) * R_d # 2.30 lines
    epsilon = R_d / R_v
    p_v = p * q_v / (epsilon + (1. - epsilon) * q_v)
    p_s = es_calc(T)
    omega_e = np.power(R / R_e, R_e / c_p) * np.power(p_v / p_s, -q_v * R_v / c_p) # 2.43

    # Calculate estimated vapor pressure

    # Calculate the equivalent potential temperature # 2.67
    ice_factor = np.power(T / T_t, -q_i * (c_pl - c_pi) / c_p)
    theta_e = T * np.power(p0 / p, R_e / c_p) * ice_factor * omega_e * \
                np.exp((q_v * L_v) / (c_p * T) - (q_i * L_i) / (c_p * T_t))

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
    casename = 'lin58_twk23'
    txtfile = f'inic_{casename}.txt'
    PS = 100325.734375
    colspecs = [(0, 15), (16, 31), (32, 47), (48, 73), (74, 203)]
    df = pd.read_fwf(txtfile, colspecs=colspecs, skiprows=1, header=None,
                     names=['Height', 'P', 'T', 'Q', 'dummy'])
    exit()
    pres = df['P'].values
    T = df['T'].values
    Q = df['Q'].values
    # Calculate new levels at mid-point between pres levels
    new_pres = (pres[:-1] + pres[1:]) / 2

    # Combine original and new levels
    combined_pres = np.sort(np.concatenate((pres, new_pres)))
    combined_T = np.interp(combined_pres, pres[::-1], T[::-1])
    combined_Q = np.interp(combined_pres, pres[::-1], Q[::-1])

    # Use combined_pres, combined_T, and combined_Q for further calculations
    pres = combined_pres[::-1]
    T = combined_T[::-1]
    Q = combined_Q[::-1]

    dp = pres[:-1] - pres[1:]
    theta = T * (100000. / pres) ** (287.04 / 1004.64)
    theta_e = np.empty(theta.shape)
    for k in range(len(theta_e)):
        theta_e[k] = theta_e_calc(pres[k], T[k], Q[k])
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
        CIN[::-1],
        name='CIN',
        dims=['pressure'],
        coords={'pressure': pres[::-1]},
        attrs={'units': 'J/kg'}
    )
    CIN.to_netcdf(f'Init_CIN_{casename}_interp.nc')
    W = xr.DataArray(
        w[::-1],
        name='W',
        dims=['pressure'],
        coords={'pressure': pres[::-1]},
        attrs={'units': 'm/s',
               'long_name': 'vertical velocity corresponding to CIN'}
    )
    W.to_netcdf(f'W2CIN_{casename}_interp.nc')
