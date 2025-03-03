'reinit'
'set mproj off'
'ini -s'
'open /data/W.eddie/VVM/DATA/GoAmazon_line58_16_t06/gs_ctl_files/dynamic.ctl'
'set x 56 73'
'set y 56 73'
'set z 4'

x0=64.5
dx=0.5
xkm1=(56-x0)*dx
xkm2=(73-x0)*dx

'c'
'set grads off'
'set xaxis 'xkm1' 'xkm2
'set yaxis 'xkm1' 'xkm2
'color -0.6 1.9 0.25 -kind blue-(2)->white->red'
'd w'
'draw xlab [km]'
'draw ylab [km]'
'draw title VVM'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Winit_map.png white'
