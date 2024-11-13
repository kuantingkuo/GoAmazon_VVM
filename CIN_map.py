import numpy as np
import os
import xarray as xr
import datetime
import sys

# Define the list of cases
cases = [
    'GoAmazon_20141122T0530_WL2_01', 'GoAmazon_20141122T0530_WL2_08', 'GoAmazon_20141122T0530_WL2_15',
    'GoAmazon_20141122T0530_WL2_22', 'GoAmazon_20141122T0530_WL6_01', 'GoAmazon_20141122T0530_WL6_08',
    'GoAmazon_20141122T0530_WL6_15', 'GoAmazon_20141122T0530_WL6_22'
]

# Base directory for the npy files
base_dir = '/data/W.eddie/GoAmazon_VVM_temp/'

# Loop through each case
for case in cases:
    time_list = []
    array = np.empty((181, 256, 256))
    
    # Loop through the file numbers from 000 to 180
    for i in range(181):
        file_number = f'{i:06d}'
        file_path = os.path.join(base_dir, f'{case}.CIN-{file_number}.nc.npy')
        
        # Load the .npy file
        data = np.load(file_path)
        array[i] = data
        
        start_time = datetime.datetime(2000, 1, 1, 0, 0)
        time = start_time + datetime.timedelta(minutes=i)
        time_list.append(time)
    
    # Create an xarray DataArray
    data_array = xr.DataArray(
        data=array,
        coords=dict(
            time=(['time'], time_list),
            Y=(['Y'], np.arange(1,257, dtype=int)),
            X=(['X'], np.arange(1,257, dtype=int))
        ),
        dims=['time', 'Y', 'X'],
        name='CIN',
        attrs=dict(
            units='J/kg',
            long_name='Convective Inhibition'
        )
    )
    data_array.X.attrs['axis']='X'
    data_array.Y.attrs['axis']='Y'
    # Save the dataset as a NetCDF file
    output_file = os.path.join(base_dir, f'{case}_CIN.nc')
    data_array.to_netcdf(output_file)
