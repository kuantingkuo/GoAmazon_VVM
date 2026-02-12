case='ctrl_16'
tsels='2 9 15'
infile='inic_ctrl.txt'
path='/data/W.eddie/VVM/DATA/'
rc=gsfallow('on')
'reinit'
'ini -l'
'open 'path'GoAmazon_'case'_t06/gs_ctl_files/thermodynamic.ctl'
'open 'path'GoAmazon_'case'_t06/gs_ctl_files/W.ctl'
'set x 56.5 72.5'
'set y 64'
'set z 2 23'
z0=qdims('levmin')/1000
z1=qdims('levmax')/1000
'set t 1 last'

rc=read(infile)
pres=''
k=1
while(k<=23)
    rc=read(infile)
    line=sublin(rc,2)
    pres=pres' 'subwrd(line,2)
    k=k+1
endwhile
'P='zlike('th',pres)
'Tc1=th.1*pow(P/100000,287.04/1004.64)-273.15'
'cld1=qc.1+qi.1'
'thv1=th.1*(1+0.608*qv.1-cld1)'
'thv1env=amean(th.1*(1+0.608*qv.1-cld1),x=1,x=128,y=1,y=128)'
'buo1=(thv1-thv1env)/thv1env*9.80616'

t=1
while(t<=181)
*nt=count_num(tsels)
*it=1
*while(it<=nt)
*t=subwrd(tsels,it)
'c'
'on'
'set grads off'
'set t 't
'set xaxis -4 4'
'set yaxis 'z0' 'z1' 1'
*'color -levs -0.02 -0.016 -0.012 -0.008 -0.004 -0.002 0.002 0.004 0.008 0.012 0.016 0.02'
'color -levs -0.05 -0.04 -0.03 -0.02 -0.01 -0.005 0.005 0.01 0.02 0.03 0.04 0.05 -kind blue-(5)->white->orange->red'
'd buo1'
'cbar3 [m s`a-2`n]'
'draw xlab [km]'
'draw ylab Height [km]'
ttt=math_format('%03g',t-1)
'draw title Buoyancy (shaded)                         `0'ttt' min.\Cloud Water [g kg`a-1`n] (green contours) & `2w`1 [m s`a-1`n] (black contours)'
'off'
'set ccolor 4'
'set clab masked'
'color -levs 0.01 0.1 0.3 0.6 1 -kind lightgreen->green -gxout contour'
'set cthick 8'
'd cld1*1e3'
'set ccolor 1'
'set clab masked'
'set cthick 4'
'set clevs -1 -0.8 -0.6 -0.4 -0.2 0.2 0.4 0.6 0.8 1'
'd w.2'
*'gxprint /data/W.eddie/GoAmazon_VVM_temp/GoAmazon_'case'_t06_'ttt'.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_temp/GoAmazon_'case'_t06_16km_'ttt'.png white'
*'gxprint /data/W.eddie/GoAmazon_VVM_temp/GoAmazon_'case'_t06_'ttt'.svg white'
t=t+1
*it=it+1
endwhile
