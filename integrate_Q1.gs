ZZ='0.000 210.754 382.234 579.844 803.323 1052.109 1325.465 1722.839 2341.571 3174.822 4211.728 5421.875 6685.203 7912.125 9106.401 10261.851 11374.275 12442.087 13462.620 14439.209 15379.833 16297.440 17199.605 18345.840 19984.424 22141.932 24299.439'
RHO='1.158 1.136 1.116 1.092 1.068 1.043 1.017 0.985 0.927 0.852 0.767 0.678 0.596 0.519 0.455 0.401 0.354 0.314 0.279 0.247 0.218 0.187 0.163 0.127 0.095 0.064'
pibar='0.999  0.999  0.994  0.989  0.982  0.975  0.967  0.959  0.946  0.927  0.901  0.869  0.832  0.795  0.758  0.724  0.691  0.660  0.630  0.601  0.574  0.548  0.523  0.499  0.472  0.436 0.390'
rc=gsfallow('on')
tstep=31
'reinit'
'set mproj off'
'ini -s'
'open thermodynamic.ctl'
'set x 1'
'set y 1'
'set z 1 26'
'set t 1'
'zz='zlike('th',ZZ)
'rho='zlike('th',RHO)
'pibar='zlike('th',pibar)
'dz=zz-zz(z-1)'

'set x 114 141'
'set y 114 141'
'set z 1'
'set t 'tstep
'Q1sum=sumg(rho*(th-th(t=1))*pibar*dz,z=1,z=26)'

'open surface.ctl'
'p=sprec.2*3600'

'set grads off'
'color 0 7000 700 -kind white->jet'
'd maskout(Q1sum,Q1sum)'
'cbar3'
'set gxout contour'
'set clab masked'
'd p'

'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Q1sum_'tstep'.png'
