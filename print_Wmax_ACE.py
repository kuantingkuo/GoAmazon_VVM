import xarray as xr
import numpy as np
import os

# Load the netCDF file
# Directory containing the files
directory = '/data/W.eddie/GoAmazon_VVM/'

# Loop through the files with the specified pattern
max_W_values = []
for i in range(2, 25, 2):
    file_path = os.path.join(directory, f'dyn_means.13579.{i:02d}.nc')
    ds = xr.open_dataset(file_path)

    # Extract the maximum value of W[:,0]
    max_W = np.round(ds['W'][:, 0].max().item(), 2)
    max_W_lev = ds['W'][:, 0].argmax().item()
    max_W_values.append((os.path.basename(file_path), max_W, max_W_lev))

    print(max_W_values)
