import xarray as xr
import numpy as np
import numba
from scipy.optimize import root_scalar
import sys
import glob
import concurrent.futures

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
    es = np.where(tempc < -80,
                  es_calc_bolton(temp)*100.,
                  c0+tempc*(c1+tempc*(c2+tempc*(c3+tempc*(c4+tempc*(c5+tempc*(c6+tempc*(c7+tempc*c8))))))))
    # in Pa
    return es

@numba.njit
def lhs_func(T, theta, rhs):
    P_lcl = np.power(T/theta, 1004.64/287.04) * 100000.
    lhs = es_calc(T) / P_lcl
    return lhs - rhs

def calc_lcl(theta, q): # 2D input
    P_lcl = np.zeros(theta.shape)
    T_lcl = np.zeros(theta.shape)
    for j in range(theta.shape[0]):
        for i in range(theta.shape[1]):
            rhs = q[j,i]/(0.622+0.378*q[j,i])
            solution = root_scalar(lhs_func, args=(theta[j,i],rhs,), bracket=[50., 400.], method='brentq')
            if solution.converged:
                T_lcl[j,i] = solution.root
                P_lcl[j,i] = np.power(T_lcl[j,i]/theta[j,i], 1004.64/287.04) * 100000.
            else:
                print("No solution found within the specified range.")
                sys.exit()
    return P_lcl, T_lcl

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

def T_parcel_moist(theta_e, pres, Q0): # 2D input
    T = np.zeros(theta_e.shape)
    for j in range(theta_e.shape[0]):
        for i in range(theta_e.shape[1]):
            solution = root_scalar(solve_T_moist, args=(theta_e[j,i], pres[0,0], Q0[j,i]), bracket=[50, 400], method='brentq')
            if solution.converged:
                T[j,i] = solution.root
            else:
                print("No solution found within the specified range.")
                T[j,i] = np.nan
    return T

def main_parallel(nc):
    tm6 = nc.split('-')[-1].replace('.nc', '')
    print(tm6)
    pres = np.array([99578.922, 97949.914, 96058.398, 93921.188, 91556.391, 88983.727, 86224.195,
                     82341.102, 76572.766, 69342.492, 61148.816, 52605.672, 44704.773, 37988.883, 32280.270,
                     27427.854, 23303.223, 19797.219, 16822.508, 14299.404, 12154.724, 10331.713,  8782.123,
                      7201.245,  5459.548])
    pres = pres[:, None, None]
    ds = xr.open_dataset(nc).squeeze().isel(lev=slice(1, None))
    theta = ds.th.values
    pibar = np.power(pres / 100000., 287.04 / 1004.64)
    T = theta * pibar
    qv = ds.qv.values
    theta_e = theta_e_calc(pres, T, qv)
    es = es_calc(T)
    qs = 0.622 * es / (pres - (1 - 0.622) * es)
    theta_es = theta_e_calc(pres, T, qs)
    Tv = T * (1 + 0.608 * qv)
    P_lcl, T_lcl = calc_lcl(theta[0,:,:], qv[0,:,:])
    CIN = np.zeros(P_lcl.shape)
    LFC_flag = np.zeros(P_lcl.shape, dtype=int)
    for k in range(1,len(ds.lev)-1):
        T_parcel = np.where(pres[k] < P_lcl,
                            T_parcel_moist(theta_e[0], pres[k], qv[0]),
                            theta[0] * pibar[k])
        es_parcel = es_calc(T_parcel)
        qs_parcel = 0.622 * es_parcel / (pres[k] - (1 - 0.622) * es_parcel)
        Q_parcel = np.where(pres[k] < P_lcl, qs_parcel, qv[k])
        Tv_parcel = T_parcel * (1 + 0.608 * Q_parcel)
        CIN_temp = 287.04 * (Tv_parcel - Tv[k]) * np.log(pres[k] / pres[k+1])
        LFC_flag += np.where(CIN_temp > 0, 1, 0)
        if np.all(LFC_flag > 0):
            break
        CIN += np.where(LFC_flag==0, CIN_temp, 0.)
    basename = nc.split('/')[-1]
    outname = f'/data/W.eddie/GoAmazon_VVM_temp/{basename.replace("L.Thermodynamic", "CIN").replace(".nc", ".npy")}'
    np.save(outname, CIN)
    return

if __name__ == '__main__':
    path = '/data/W.eddie/VVM/DATA/'
    cases = ['GoAmazon_20141122T0530_WL2_01', 'GoAmazon_20141122T0530_WL2_08', 'GoAmazon_20141122T0530_WL2_15',
             'GoAmazon_20141122T0530_WL2_22', 'GoAmazon_20141122T0530_WL6_01', 'GoAmazon_20141122T0530_WL6_08',
             'GoAmazon_20141122T0530_WL6_15', 'GoAmazon_20141122T0530_WL6_22']
    with concurrent.futures.ProcessPoolExecutor(max_workers=32) as executor:
        futures = []
#    if True:
        for casename in cases:
            print(casename)
            nclist = glob.glob(f'{path}{casename}/archive/{casename}.L.Thermodynamic-*.nc')
            for nc in nclist:
                main_parallel(nc)
                futures.append(executor.submit(main_parallel, nc))
        concurrent.futures.wait(futures)