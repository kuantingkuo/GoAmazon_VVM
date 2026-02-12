case='test_circle_Wmean_WL2_22'
x1=54;x2=75
rc=gsfallow('on')
'reinit'
'ini -l'
'set parea 1.2 9.6 1.3 7.75'
'sdfopen /data/W.eddie/GoAmazon_VVM_Data/INIC.interp2Wgrid.'case'.nc'
'set x 'x1' 'x2
'set y 64'
'set z 1 10'
'set t 1 last'
tmax=qdims('tmax')
t=1
while(t<=tmax)
'set t 't

x0=64.5
dx=0.5
xkm1=(x1-x0)*dx
xkm2=(x2-x0)*dx

*'thv=th*(1+0.608*qv)'
*'thve=amean(th*(1+0.608*qv),x='x1-10',x='x2+10',y='x1-10',y='x2+10')'
*'buo=9.80616*(thv-thve)/thve'

'c'
'on'
'set xaxis 'xkm1' 'xkm2
'set ylint 0.2'
'set grads off'
'color -levs -35 -30 -25 -20 -15 -10 -5 -1 1 5 10 15 20 25 30 35 -kind darkblue->blue->white->orange->red'
'd th-th(t=1)'
'xcbar3 -c Temperature Change [K]'
'draw xlab X [km]'
'draw ylab Height [km]'
'draw title Temperature Change & Flow at t='t-1' min.'
'off'

'set cthick 6'
'set arrscl 0.5 2'
'color 0 8 -kind dark_jet'
'u0=const(maskout(u.1,lev>0),0,-u)'
'd u0;w;mag(u0,w)'
'xcbar3 1.2 9.6 0.3 0.5 -dir h -unit [m s`a-1`n]'

'set gxout contour'
'color -levs -3 -2 -1 1 2 3 4 5 6 7 8 9 10 11 12 -kind black-(2)->gray->black -gxout contour'
'set clab forced'
'set cthick 6'
'd w'

*'q gr2xy '64.5-4' 6.95'
*x1=subwrd(result,3)
*y1=subwrd(result,6)
*'q gr2xy '64.5+4' 6.95'
*x2=subwrd(result,3)
*y2=subwrd(result,6)
*'set rgb 99 255 0 255'
*'set line 99 1 12'
*'draw line 'x1' 'y1' 'x2' 'y2
*'draw line 'x1' 'y1+0.3' 'x1' 'y1-0.3
*'draw line 'x2' 'y2+0.3' 'x2' 'y2-0.3

'set string 1 tc 6 0'
'legend tl 1 `2w 1'

'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Wbubble_init_'case'_'t'.png white'
t=t+1
endwhile
