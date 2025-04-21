x1=54;x2=75
'reinit'
'set mproj off'
'ini -s'
'open /data/W.eddie/VVM/DATA/GoAmazon_line58_16_t06/gs_ctl_files/dynamic.ctl'
'set x 'x1' 'x2
'set y 'x1' 'x2
'set z 4'

x0=64.5
dx=0.5
xkm1=(x1-x0)*dx
xkm2=(x2-x0)*dx

'c'
'set grads off'
'set xaxis 'xkm1' 'xkm2
'set yaxis 'xkm1' 'xkm2
'color -levs -0.6 -0.27 -0.1 -0.06 -0.02 0.1 0.3 0.7 1.2 1.9 -kind (134,97,42)-(1)->(238,199,100)-(2)->white->salmon->(235,0,235)'
'd w'
'draw xlab X [km]'
'draw ylab Y [km]'
'draw title VVM'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Winit_map.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Winit_map.svg white'
