import numpy as np
import pandas as pd
from scipy.interpolate import interp1d


def calc_geopotential_height(pres, dp, T, Q):
    """Hydrostatic integration to geopotential height (top to bottom)."""
    Rd = 287.04
    g = 9.80616
    Tv = T * (1 + 0.608 * Q)
    dz = Rd * Tv / g * dp / pres
    return dz.cumsum()

# --- Configuration ---
input_file = 'inic_ctrl.txt'
output_file = 'inic_ctrl_L70.txt'

# 1. Define headers manually first so we can use them for both reading and writing
headers = [
    'Height [m]', 'Pressure [Pa]', 'Temperature [K]', 'Specific Humidity [kg/kg]',
    'Heating Forcing [K/s]', 'Moistening Forcing [kg/kg/s]',
    'Longwave Forcing [K/s]', 'Shortwave Forcing [K/s]',
    'U [m/s]', 'V [m/s]'
]

target_heights = np.array([
    49.364, 151.907, 259.534, 372.246, 490.042, 612.924, 740.890,
    873.941, 1012.076, 1155.297, 1303.602, 1456.992, 1615.466, 1779.025,
    1947.669, 2121.398, 2300.212, 2484.110, 2673.093, 2867.161, 3066.313,
    3270.551, 3479.873, 3694.280, 3913.771, 4138.348, 4368.008, 4602.754,
    4842.585, 5087.500, 5337.500, 5592.585, 5852.754, 6118.008, 6388.348,
    6663.771, 6944.280, 7229.873, 7520.551, 7816.313, 8117.161, 8423.093,
    8734.110, 9050.212, 9371.398, 9697.670, 10029.025, 10365.466, 10706.991,
    11053.602, 11405.297, 11762.076, 12123.940, 12490.890, 12862.924,
    13240.042, 13622.246, 14009.534, 14401.907, 14799.364, 15201.907,
    15609.534, 16022.246, 16440.043, 16862.924, 17290.891, 17723.941,
    18162.076, 18605.297, 19053.602
])

# --- 2. Read the Data ---
# skiprows=1: We ignore the text header in the file to avoid splitting issues.
# names=headers: We force pandas to use our list of column names.
df = pd.read_csv(input_file, sep=r'\s+', skiprows=1, names=headers)

# Get the original height array (first column)
original_height = df['Height [m]'].values
pres_mid = df['Pressure [Pa]'].values
T_profile = df['Temperature [K]'].values
Q_profile = df['Specific Humidity [kg/kg]'].values

# Build interface pressures and layer thickness in pressure coordinates
presi = np.empty(len(pres_mid) + 1)
presi[0] = pres_mid[0] + (pres_mid[0] - pres_mid[1]) / 2.0
presi[-1] = pres_mid[-1] - (pres_mid[-2] - pres_mid[-1]) / 2.0
presi[1:-1] = 0.5 * (pres_mid[:-1] + pres_mid[1:])
dp = np.abs(np.diff(presi))

# Compute hydrostatic geopotential height and map pressure to height
Z_hydro = calc_geopotential_height(pres_mid, dp, T_profile, Q_profile)

# Pressure at target heights via hydrostatic height-pressure mapping (monotonic in height)
pressure_at_target = np.interp(
    target_heights,
    Z_hydro,
    pres_mid,
    left=np.nan,
    right=np.nan
)

# Hydrostatic/log-pressure extrapolation outside known height range
below = np.isnan(pressure_at_target) & (target_heights < Z_hydro[0])
above = np.isnan(pressure_at_target) & (target_heights > Z_hydro[-1])
Rd = 287.04
g = 9.80616

if below.any():
    # Assume virtual temperature constant in the first layer
    Tv0 = T_profile[0] * (1 + 0.608 * Q_profile[0])
    dz = Z_hydro[0] - target_heights[below]
    pressure_at_target[below] = pres_mid[0] + g * dz * pres_mid[0] / (Rd * Tv0)

if above.any():
    # Extrapolate aloft with top-layer mean Tv
    Tv_top = 0.5 * (T_profile[-1] * (1 + 0.608 * Q_profile[-1]) + T_profile[-2] * (1 + 0.608 * Q_profile[-2]))
    dz = target_heights[above] - Z_hydro[-1]
    pressure_at_target[above] = pres_mid[-1] * np.exp(-g * dz / (Rd * Tv_top))

# --- 3. Interpolation ---
interp_data = {}

# Set the Height column explicitly to the target heights
interp_data['Height [m]'] = target_heights

# Precompute mask for levels below the lowest available input height
below_surface = target_heights < original_height[0]

# Loop through the OTHER columns (skipping Height which is index 0)
for col in headers[1:]:
    y_values = df[col].values

    if col == 'Pressure [Pa]':
        # Use hydrostatic height-pressure mapping
        new_values = pressure_at_target.copy()
    else:
        # Create interpolator
        # fill_value="extrapolate" handles the new heights (0m and >15km)
        f = interp1d(original_height, y_values, kind='linear', fill_value="extrapolate")
        new_values = f(target_heights)

    # Clamp anything below the lowest input level to the surface value
    if below_surface.any():
        surface_val = y_values[0] if col != 'Pressure [Pa]' else pressure_at_target[0]
        new_values[below_surface] = surface_val

    # Physics check: clamp negative values for specific variables
    if 'Humidity' in col or 'Pressure' in col:
        new_values[new_values < 0] = 0.0

    interp_data[col] = new_values

# --- 4. Formatting & Writing ---
# Calculate max widths
max_widths = [max(15, len(header)) for header in headers]

# Create format strings: default to scientific
formats = [f'{{:>{width}.{width - 7}e}}' for width in max_widths]

# Override specific columns to use float 'f' (Height, Pres, Temp, U, V)
# Indices: 0 (Height), 1 (Pres), 2 (Temp), -2 (U), -1 (V)
for i in [0, 1, 2, -1, -2]:
    formats[i] = formats[i].replace('e', 'f')

# Create header row
header_row = ' '.join([f'{{:^{width}}}'.format(header) for header, width in zip(headers, max_widths)])

# Prepare output
output_lines = [header_row]
cols_data = [interp_data[h] for h in headers]

for row_vals in zip(*cols_data):
    formatted_row = ' '.join(fmt.format(val) for fmt, val in zip(formats, row_vals))
    output_lines.append(formatted_row)

with open(output_file, 'w') as f:
    for line in output_lines:
        f.write(line + '\n')

print(f"Success! Interpolated data written to {output_file}")
