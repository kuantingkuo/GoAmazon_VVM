import xarray as xr
import numpy as np
import glob
import sys

if __name__ == '__main__':
    pattern = 'GoAmazon_line58_??_t06'
    files = glob.glob(f'/data/W.eddie/VVM/DATA/{pattern}/archive/{pattern}.L.Dynamic-000000.nc')
    for file in files:
        TH = file.split('_')[2]
        print(TH)
        ds = xr.open_dataset(file).isel(lat=slice(0, 127), lon=slice(0, 127)).squeeze()
        ds['lat'] = np.arange(1, 128)
        ds['lon'] = np.arange(1, 128)
        R = np.sqrt((ds.lat-64.5)**2 + (ds.lon-64.5)**2)
        Ru = np.sqrt((ds.lat-64.5)**2 + (ds.lon-64)**2).sel(lat=64,lon=slice(1,64))
        dx = 0.5 #[km]
        Ri = np.arange(2.,10.1,2.)
        W = np.empty((len(ds.lev), len(Ri)))
        U = np.empty((len(ds.lev), len(Ri)))
        for i in range(len(Ri)):
            if i==0:
                Rim = 0.
            else:
                Rim = Ri[i-1]
            W[:,i] = ds.w.where((R<=Ri[i])&(R>Rim)).mean(dim=['lat', 'lon'])
            U[:,i] = ds.u.sel(lat=64,lon=slice(1,64)).where((Ru>Rim)&(Ru<=Ri[i])).mean(dim=['lon'])

        combined_ds = xr.Dataset(
            data_vars=dict(
                W=(['lev','D'], W),
                U=(['lev','D'], U)
            ),
            coords=dict(
                lev=ds.lev,
                D=(['D'], Ri)
            )
        )
        combined_ds.D.attrs = dict(axis='X', long_name='diameter', units='km')
        combined_ds.to_netcdf(f'dyn_means.multi.{TH}.nc')
        combined_ds.close()

        ds.close()
