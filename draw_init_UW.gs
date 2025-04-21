x1=54;x2=75
rc=gsfallow('on')
'reinit'
'ini -l'

'open /data/W.eddie/VVM/DATA/GoAmazon_line58_16_t06/gs_ctl_files/U.ctl'
'open /data/W.eddie/VVM/DATA/GoAmazon_line58_16_t06/gs_ctl_files/W.ctl'
'set lon 'x1' 'x2
'set y 64'
'set z 1 11'
z1=qdims('levmin')/1000
z2=qdims('levmax')/1000
'set t 1'

x0=64.5
dx=0.5
xkm1=(x1-x0)*dx
xkm2=(x2-x0)*dx

'c'
'set xaxis 'xkm1' 'xkm2
'set yaxis 'z1' 'z2
'set ylint 1'
'set grads off'
'u0=const(maskout(u.1,lev>0),0,-u)'
'color -levs -3 -2.5 -2 -1.5 -1 -0.5 -0.1 0.1 0.5 1 1.5 2 2.5 3'
'd u0'
'xcbar3'
'U [m s`a-1`n] (shaded) & W [m s`a-1`n] (contour)'
'draw xlab X [km]'
'draw ylab Height [km]'
'off'
'set dfile 2'
'color -levs -0.6 -0.3 -0.1 0.1 0.3 0.6 0.9 1.2 1.5 1.8 -kind black-(2)->gray->black -gxout contour'
'set clab forced'
'set cthick 6'
'd w.2'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/init_UW.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/init_UW.svg white'
