x1=54;x2=75
rc=gsfallow('on')
'reinit'
'ini -l'
'set parea 1.2 9.6 1.3 7.75'
'sdfopen /data/W.eddie/GoAmazon_VVM/INIC.interp2Wgrid.nc'
'set x 'x1' 'x2
'set y 64'
'set z 1 10'

x0=64.5
dx=0.5
xkm1=(x1-x0)*dx
xkm2=(x2-x0)*dx

'thv=th*(1+0.608*qv)'
'thve=amean(th*(1+0.608*qv),x='x1-10',x='x2+10',y='x1-10',y='x2+10')'
'buo=9.80616*(thv-thve)/thve'

'c'
'set xaxis 'xkm1' 'xkm2
'set ylint 0.2'
'set grads off'
'color -levs -0.1 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1 -kind (168,168,255)-(0)->white->orange->red'
'd buo'
'xcbar3 -c Buoyancy [m s`a-2`n]'
'draw xlab X [km]'
'draw ylab Height [km]'
'draw title Buoyancy at t=0 & Flow at t=1 min.'
'off'

'set cthick 6'
'set arrscl 0.5 2'
'color 0 3 -kind dark_jet'
'u0=const(maskout(u.1,lev>0),0,-u)'
'd u0;w;mag(u0,w)'

'set gxout contour'
'color -levs -0.6 -0.3 -0.1 0.1 0.3 0.6 0.9 1.2 1.5 1.8 -kind black-(2)->gray->black -gxout contour'
'set clab forced'
'set cthick 6'
'd w'

'q gr2xy '64.5-4' 6.95'
x1=subwrd(result,3)
y1=subwrd(result,6)
'q gr2xy '64.5+4' 6.95'
x2=subwrd(result,3)
y2=subwrd(result,6)
'set line 3 1 12'
'draw line 'x1' 'y1' 'x2' 'y2
'draw line 'x1' 'y1+0.3' 'x1' 'y1-0.3
'draw line 'x2' 'y2+0.3' 'x2' 'y2-0.3

'set string 1 tc 6 0'
'legend tl 1 `2w 1'

'gxprint /data/W.eddie/GoAmazon_VVM_Figs/warmbubble_init.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/warmbubble_init.svg white'
