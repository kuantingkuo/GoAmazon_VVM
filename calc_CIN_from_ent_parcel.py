import xarray as xr
import numpy as np
import pandas as pd

if __name__ == '__main__':
    # Load the data
    casename = 'ctrl'
    txtfile = f'inic_{casename}.txt'
    PS = 100325.734375
    colspecs = [(0, 15), (16, 31), (32, 47), (48, 73), (74, 203)]
    df = pd.read_fwf(txtfile, colspecs=colspecs, skiprows=1, header=None,
                     names=['Height', 'P', 'T', 'Q', 'dummy'])
    pres = df['P'].values
    T = df['T'].values
    Q = df['Q'].values
    dp = pres[:-1] - pres[1:]
    Tv_env = T * (1 + 0.608 * Q)
    ds = xr.open_dataset('parcel_entrain0.001_lev0.nc')
    Tv_pc = (ds.T * (1 + 0.608 * ds.Q)).values
    CIN = 0.
    for k in range(len(pres)):
        print(f'k={k}')
        if Tv_pc[k] > Tv_env[k]:
            break
        print((Tv_pc[k] - Tv_env[k]) / Tv_env[k] * 9.80616)
        CIN += 287.04 * (Tv_pc[k] - Tv_env[k]) / pres[k] * dp[k]
