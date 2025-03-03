path='/data/W.eddie/VVM/DATA/'
rc=gsfallow('on')
'reinit'
'ini -l'

'open 'path'GoAmazon512km_line58_16_t06/gs_ctl_files/thermodynamic.ctl'
'set x 56.5 72.5'
'set y 64'
'set z 2 14'
z0=qdims('levmin')/1000
z1=qdims('levmax')/1000
'set t 1 61'

infile='inic_lin58.txt'
rc=read(infile)
pres=''
k=1
while(k<=14)
    rc=read(infile)
    line=sublin(rc,2)
    pres=pres' 'subwrd(line,2)
    k=k+1
endwhile
'P='zlike('th',pres)
'Tc1=th.1*pow(P/100000,287.04/1004.64)-273.15'
*'tpq2rh Tc1 P qv'
*'rh1=rh'
'cld1=qc.1+qi.1'
'thv1=th.1*(1+0.608*qv.1-cld1)'
'thv1env=amean(th.1*(1+0.608*qv.1-cld1),x=1,x=128,y=1,y=128)'
'buo1=(thv1-thv1env)/thv1env*9.80616'

'open 'path'GoAmazon512km_line58_16_t06/gs_ctl_files/dynamic.ctl'

t=1
while(t<=61)
'c'
'on'
'set grads off'
'set t 't
'set xaxis -4 4'
'set yaxis 'z0' 'z1' 1'
'color -levs -0.02 -0.016 -0.012 -0.008 -0.004 -0.002 0.002 0.004 0.008 0.012 0.016 0.02'
'd buo1'
*'color 70 100 3 -kind drywet-(0)->blueviolet'
*'d rh1'
'cbar3 [m s`a-2`n]'
'draw xlab [km]'
'draw ylab Height [km]'
tt=math_format('%02g',t-1)
'draw title Buoyancy (shaded)                         `0'tt' min.\Cloud Water [g kg`a-1`n] (green contour) & W [m s`a-1`n] (black contour)'
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
'gxprint /data/W.eddie/GoAmazon_VVM_temp/GoAmazon512km_line58_16_t06_'tt'.png white'
t=t+1
endwhile
