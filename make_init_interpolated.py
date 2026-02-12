import xarray as xr
import numpy as np

def calc_geopotential_height(pres, dp, T, Q):
    Rd = 287.04
    g = 9.80616
    Tv = T * (1 + 0.608 * Q)
    dz = (Rd * Tv / g * dp / pres)
    geopotential_height = dz.cumsum()
    return geopotential_height

# Read input file
init_file = '/data/W.eddie/AQUA/GoAmazon_sounding_2014-11-22T0530_0.9x1.25_L30.nc'
output_file = '/data/W.eddie/GoAmazon_VVM/inic_L71.txt'

ds = xr.open_dataset(init_file, decode_times=False).sel(lat=0, lon=0, method='nearest').squeeze()
PS = ds.PS
hyam = ds.hyam
hybm = ds.hybm
hyai = ds.hyai
hybi = ds.hybi
P0 = ds.P0

# Calculate original pressure levels (mid-levels) and interface levels
pres_original = (hyam * P0 + hybm * PS).values
presi_original = (hyai * P0 + hybi * PS).values
T_original = ds.T.values
Q_original = ds.Q.values

# Combine pres_original and presi_original, then sort
pres_new = np.unique(np.concatenate([pres_original, presi_original]))
pres_new = np.sort(pres_new)  # Sort in ascending order (top to bottom)

# Create new interface pressure levels as midpoints between adjacent mid-levels
presi_new = np.zeros(len(pres_new) + 1)
presi_new[0] = pres_new[0] - (pres_new[1] - pres_new[0]) / 2.0  # Extrapolate top
presi_new[-1] = pres_new[-1] + (pres_new[-1] - pres_new[-2]) / 2.0  # Extrapolate bottom

# Calculate interface pressures as midpoints between adjacent mid-levels
for i in range(1, len(pres_new)):
    presi_new[i] = (pres_new[i-1] + pres_new[i]) / 2.0

# Calculate new dp
dp_new = presi_new[1:] - presi_new[:-1]

# Interpolate T and Q to new pressure levels using numpy.interp
# np.interp requires x values to be increasing, so we'll work with that
T_new = np.interp(pres_new, pres_original, T_original)
Q_new = np.interp(pres_new, pres_original, Q_original)

# Calculate geopotential height with new pressure, dp, T, Q
# Reverse arrays for calculation (top to bottom)
pres_calc = pres_new[::-1]
dp_calc = dp_new[::-1]
T_calc = T_new[::-1]
Q_calc = Q_new[::-1]

Z_calc = calc_geopotential_height(pres_calc, dp_calc, T_calc, Q_calc)

# Reverse back for output (bottom to top, high pressure to low pressure)
Z_new = Z_calc
pres_output = pres_new[::-1]
T_output = T_new[::-1]
Q_output = Q_new[::-1]
zero_new = np.zeros(len(pres_new))

# Prepare output
headers = ['Height [m]', 'Pressure [Pa]', 'Temperature [K]', 'Specific Humidity [kg/kg]',
            'Heating Forcing [K/s]', 'Moistening Forcing [kg/kg/s]',
            'Longwave Forcing [K/s]', 'Shortwave Forcing [K/s]',
            'U [m/s]', 'V [m/s]']
max_widths = [max(15, len(header)) for header in headers]
formats = [f'{{:>{width}.{width - 7}e}}' for width in max_widths]
for i in [0, 1, 2, -1, -2]:
    formats[i] = formats[i].replace('e', 'f')
header_row = ' '.join([f'{{:^{width}}}'.format(header) for header, width in zip(headers, max_widths)])

data = {'Z': Z_new, 'pres': pres_output, 'T': T_output, 'Q': Q_output, 'zero': zero_new}

rows = []
variables = ['Z', 'pres', 'T', 'Q', 'zero', 'zero', 'zero', 'zero', 'zero', 'zero']
for row in zip(*[data[var] for var in variables]):
    formatted_row = ' '.join(fmt.format(val) for fmt, val in zip(formats, row))
    rows.append(formatted_row)

output = [header_row] + rows
with open(output_file, 'w') as f:
    for line in output:
        f.write(line + '\n')

print(f"Output written to {output_file}")
print(f"Original mid-levels: {len(pres_original)}")
print(f"Original interface levels: {len(presi_original)}")
print(f"New combined levels: {len(pres_new)}")
print(f"Pressure range: {pres_new[0]:.2f} Pa (top) to {pres_new[-1]:.2f} Pa (bottom)")
