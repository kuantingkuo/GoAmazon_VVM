import xarray as xr
import numpy as np
import numba
import pandas as pd

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

if __name__ == '__main__':
    # Load the data
    casename = 'const'
    txtfile = f'inic_{casename}.txt'
    PS = 100325.734375
    colspecs = [(0, 15), (16, 31), (32, 47), (48, 73), (74, 203)]
    df = pd.read_fwf(txtfile, colspecs=colspecs, skiprows=1, header=None,
                     names=['Height', 'P', 'T', 'Q', 'dummy'])
    pres = df['P'].values
    T = df['T'].values
    Q = df['Q'].values
    es = np.empty_like(T)
    e = np.empty_like(T)
    for k in range(len(T)):
        es[k] = es_calc(T[k])
        e[k] = Q[k]*pres[k] / (0.622+0.378*Q[k])

    RH = e/es*100.
    out = xr.DataArray(
        data=RH,
        coords=dict(Pressure=(['Pressure'], pres)),
        dims=['Pressure'],
        name='RH',
        attrs=dict(
            long_name='Relative Humidity',
            units='%'
        )
    )
    out.to_netcdf(f'RH_{casename}.nc')
