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
        ds = xr.open_dataset(file).isel(lat=slice(51, 76), lon=slice(51, 76)).squeeze()
        ds['lat'] = np.arange(52, 77)
        ds['lon'] = np.arange(52, 77)
        R = np.sqrt((ds.lat-64.5)**2 + (ds.lon-64.5)**2)
        Ru = np.sqrt((ds.lat-64.5)**2 + (ds.lon-64)**2)
        Wcore = ds.w.where((R<=4)&(ds.w>=0.)).mean(dim=['lat', 'lon'])
        Woutter = ds.w.where((R>4)&(R<=12)&(ds.w<=0.)).mean(dim=['lat', 'lon'])
        Uoutter = ds.u[:,12,:12].where((Ru[12]>4)&(Ru[12]<=12)).mean(dim=['lon'])

        combined_ds = xr.Dataset({
            'Wcore': Wcore,
            'Wouter': Woutter,
            'Uouter': Uoutter,
        })

        combined_ds.to_netcdf(f'dyn_means.{TH}.nc')
        combined_ds.close()

        ds.close()
