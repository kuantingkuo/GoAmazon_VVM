import xarray as xr
import numpy as np
import sys

case = 'test_circle_Wmean_WL2_22'
path = f'/data/W.eddie/VVM/DATA/{case}/archive/'
dync = xr.open_mfdataset(f'{path}{case}.L.Dynamic-*.nc')
thnc = xr.open_mfdataset(f'{path}{case}.L.Thermodynamic-*.nc')

W = dync.w
U = dync.u
V = dync.v
th = thnc.th
qv = thnc.qv

lev_th = thnc.lev.values
lev_w = (lev_th[2:] + lev_th[1:-1]) / 2.
lev_w = np.concatenate(([0.], lev_w, [22.141932]))

W = W.assign_coords(lev=("lev", lev_w))
W.lev.attrs = dync.lev.attrs

lev_new = xr.DataArray(np.sort(np.unique(np.concatenate((lev_th, lev_w)))), dims="lev", attrs=dync.lev.attrs)

# Update coordinate values without renaming
W = W.assign_coords(lon=("lon", np.linspace(1, 256, 256, dtype=np.float64)))
W = W.assign_coords(lat=("lat", np.linspace(1, 256, 256, dtype=np.float64)))
U = U.assign_coords(lon=("lon", np.linspace(1.5, 256.5, 256, dtype=np.float64)))
U = U.assign_coords(lat=("lat", np.linspace(1, 256, 256, dtype=np.float64)))
V = V.assign_coords(lon=("lon", np.linspace(1, 256, 256, dtype=np.float64)))
V = V.assign_coords(lat=("lat", np.linspace(1.5, 256.5, 256, dtype=np.float64)))
th = th.assign_coords(lon=("lon", np.linspace(1, 256, 256, dtype=np.float64)))
th = th.assign_coords(lat=("lat", np.linspace(1, 256, 256, dtype=np.float64)))
qv = qv.assign_coords(lon=("lon", np.linspace(1, 256, 256, dtype=np.float64)))
qv = qv.assign_coords(lat=("lat", np.linspace(1, 256, 256, dtype=np.float64)))

ds = xr.Dataset(coords={"lon": W.lon, "lat": W.lat, "lev": lev_new, "time": W.time})
U = U.pad(lon=(1, 0), mode='wrap')
V = V.pad(lat=(1, 0), mode='wrap')
U = U.assign_coords(lon=("lon", np.linspace(0.5, 256.5, 257, dtype=np.float64)))
V = V.assign_coords(lat=("lat", np.linspace(0.5, 256.5, 257, dtype=np.float64)))

# Interpolate variables to W grid
ds['u'] = U.interp(lon=W.lon, lev=lev_new, method="linear")
ds['v'] = V.interp(lat=W.lat, lev=lev_new, method="linear")
ds['th'] = th.interp(lev=lev_new, method="linear")
ds['qv'] = qv.interp(lev=lev_new, method="linear")
ds['w'] = W.interp(lev=lev_new, method="linear")
ds.lon.attrs = {"long_name": "longitude", "units": "degrees_east"}
ds.lat.attrs = {"long_name": "latitude", "units": "degrees_north"}

# Calculate maximum KE
maxKE = ((ds['u']**2+ds['v']**2+ds['w']**2)/2.)[:12].max(dim=['lon','lat']).values
print('level:',ds.lev[:12].values)
print('maxKE:',maxKE)

outfile = f'/data/W.eddie/GoAmazon_VVM_Data/INIC.interp2Wgrid.{case}.nc'
print(f'Output: {outfile}')
ds.to_netcdf(outfile)
