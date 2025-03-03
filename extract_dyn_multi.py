import xarray as xr
import numpy as np
import glob
import sys

if __name__ == '__main__':
    pattern = 'GoAmazon_line58_??_t06'
    # Find all files matching the pattern
    files = glob.glob(f'/data/W.eddie/VVM/DATA/{pattern}/archive/{pattern}.L.Dynamic-000000.nc')
    for file in files:
        # Extract the perturbed temperature (TH) from the filename
        TH = file.split('_')[2]
        print(TH)
        ds = xr.open_dataset(file).isel(lat=slice(0, 127), lon=slice(0, 127)).squeeze()
        # Reindex lat/lon to start at 1
        ds['lat'] = np.arange(1, 128)
        ds['lon'] = np.arange(1, 128)
        # Calculate the radial distance from the center of T in units of grid points
        R = np.sqrt((ds.lat-64.5)**2 + (ds.lon-64.5)**2)
        # Calculate the radial distance from the center of U in units of grid points
        Ru = np.sqrt((ds.lat-64.5)**2 + (ds.lon-64)**2).sel(lat=64,lon=slice(1,64))
        dx = 0.5 # [km]
        # Define radius [grid]
        Ri = np.arange(1.,9.1,2.)
        # Initialize arrays to store mean values
        W = np.empty((len(ds.lev), len(Ri)))
        U = np.empty((len(ds.lev), len(Ri)))
        for i in range(len(Ri)):
            if i==0:
                Rim = 0.
            else:
                Rim = Ri[i-1]
            # Calculate mean vertical velocity (W) within each radial interval
            W[:,i] = ds.w.where((R<=Ri[i])&(R>Rim)).mean(dim=['lat', 'lon'])
            # Calculate mean horizontal velocity (U) within each radial interval
            U[:,i] = ds.u.sel(lat=64,lon=slice(1,64)).where((Ru>Rim)&(Ru<=Ri[i])).mean(dim=['lon'])

        # Create a new dataset with the calculated means
        combined_ds = xr.Dataset(
            data_vars=dict(
                W=(['lev','D'], W),
                U=(['lev','D'], U)
            ),
            coords=dict(
                lev=ds.lev,
                D=(['D'], 2.*Ri*dx)
            )
        )
        # Add attributes to the new dataset
        combined_ds.D.attrs = dict(axis='X', long_name='diameter', units='km')
        # Save the new dataset to a NetCDF file
        combined_ds.to_netcdf(f'dyn_means.13579.{TH}.nc')
        combined_ds.close()

        ds.close()
