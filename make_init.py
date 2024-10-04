import xarray as xr
import numpy as np

def calc_geopotential_height(pres, dp, T, Q):
    Rd = 287.04
    g = 9.80616
    Tv = T * (1 + 0.608 * Q)
    dz = (Rd * Tv / g * dp / pres)[::-1]
    geopotential_height = dz.cumsum(dim='lev')
    return geopotential_height

init_file = '/data/W.eddie/AQUA/GoAmazon_sounding_2014-11-22T0530_0.9x1.25_L30.nc'
output_file = '/data/W.eddie/GoAmazon_VVM/GoAmazon_sounding_2014-11-22T0530_0.9x1.25_L30.txt'
ds = xr.open_dataset(init_file, decode_times=False).sel(lat=0, lon=0, method='nearest').squeeze()
PS = ds.PS
hyam = ds.hyam
hybm = ds.hybm
hyai = ds.hyai
hybi = ds.hybi
P0 = ds.P0
pres = hyam * P0 + hybm * PS
presi = (hyai * P0 + hybi * PS).values
dp = presi[1:] - presi[:-1]
T = ds.T
Q = ds.Q
Z= calc_geopotential_height(pres, dp, T, Q)
zero = np.zeros(T.shape)

headers = ['Height [m]', 'Pressure [Pa]', 'Temperature [K]', 'Specific Humidity [kg/kg]',
            'Heating Forcing [K/s]', 'Moistening Forcing [kg/kg/s]',
            'Longwave Forcing [K/s]', 'Shortwave Forcing [K/s]',
            'U [m/s]', 'V [m/s]']
max_widths = [max(15, len(header)) for header in headers]
formats = [f'{{:>{width}.{width - 7}e}}' for width in max_widths]
for i in [0, 1, 2, -1, -2]:
    formats[i] = formats[i].replace('e', 'f')
header_row = ' '.join([f'{{:^{width}}}'.format(header) for header, width in zip(headers, max_widths)])

data = {'Z':Z.values, 'pres':pres.values[::-1], 'T':T.values[::-1], 'Q':Q.values[::-1],
        'zero':zero}

rows = []
variables = ['Z', 'pres', 'T', 'Q', 'zero', 'zero', 'zero', 'zero', 'zero', 'zero']
for row in zip(*[data[var] for var in variables]):
    formatted_row = ' '.join(fmt.format(val) for fmt, val in zip(formats, row))
    rows.append(formatted_row)

output = [header_row] + rows
with open(output_file, 'w') as f:
    for line in output:
        f.write(line + '\n')
