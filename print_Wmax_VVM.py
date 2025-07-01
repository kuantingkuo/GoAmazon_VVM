import xarray as xr
import numpy as np
import os

# Load the netCDF file
# Directory containing the files
directory = '/data/W.eddie/VVM/DATA/'

# Loop through the files with the specified pattern
max_W_values = []
for i in range(2, 25, 2):
    file_path = os.path.join(directory, f'GoAmazon_ctrl_{i:02d}_t06/archive/GoAmazon_ctrl_{i:02d}_t06.L.Dynamic-000000.nc')
    ds = xr.open_dataset(file_path)

    # Extract the maximum value of W[:,0]
    W = ds['w'][0,:,64,64]
    max_W = np.round(W.max().item(), 2)
    max_W_lev = W.argmax().item()
    max_W_values.append((os.path.basename(file_path), max_W, max_W_lev))

print(max_W_values)
