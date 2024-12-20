cases='GoAmazon_20141122T0530_WL2_01  GoAmazon_20141122T0530_WL2_08  GoAmazon_20141122T0530_WL2_15  GoAmazon_20141122T0530_WL2_22 GoAmazon_20141122T0530_WL6_01  GoAmazon_20141122T0530_WL6_08  GoAmazon_20141122T0530_WL6_15  GoAmazon_20141122T0530_WL6_22'
exps='L2_0.1 L2_0.8 L2_1.5 L2_2.2 L6_0.1 L6_0.8 L6_1.5 L6_2.2'
Wsiz=8
radi=8
x.1=128-radi
x.2=128-Wsiz/2
x.3=127+Wsiz/2
x.4=127+radi
y.1=128-radi
y.2=128-Wsiz/2
y.3=127+Wsiz/2
y.4=127+radi
Wsiz=16
R=math_nint((math_sqrt(66*Wsiz*Wsiz-4*Wsiz+1)+1)/2-Wsiz)
radi=Wsiz/2+R
xo.1=128-radi
xo.2=128-Wsiz/2
xo.3=127+Wsiz/2
xo.4=127+radi
yo.1=128-radi
yo.2=128-Wsiz/2
yo.3=127+Wsiz/2
yo.4=127+radi
rc=gsfallow('on')
num=count_num(cases)
'reinit'
'ini -l'
i=1
while(i<=num)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'thermodynamic.ctl'
    if(i=1)
    'set x 1'
    'set y 1'
    'dlon=lon(x=2)-lon(x=1)'
    'dlat=lat(y=2)-lat(y=1)'
    'lon0=lon(x=1)'
    'lat0=lat(y=1)'
    'set x 'xo.1' 'xo.4
    'set y 'yo.1' 'yo.4
    'xgrid=(lon-lon0)/dlon+1'
    'ygrid=(lat-lat0)/dlat+1'
    'flag=const(th,1)'
    'flag=if((ygrid+xgrid+0.1)<('y.1+x.2'),-1,flag)'
    'flag=if((ygrid+xgrid-0.1)>('y.3+x.4'),-1,flag)'
    'flag=if((ygrid-xgrid+0.1)<('y.1-x.3'),-1,flag)'
    'flag=if((ygrid-xgrid-0.1)>('y.4-x.2'),-1,flag)'
    'flag=if(((xgrid>123.5)&(xgrid<131.5)&(ygrid>123.5)&(ygrid<131.5))|(xgrid<'x.1')|(xgrid>'x.4')|(ygrid<'y.1')|(ygrid>'y.4'),-1,flag)'
    'flag2=const(th,1)'
    'flag2=if((ygrid+xgrid+0.1)<('yo.1+xo.2'),-1,flag2)'
    'flag2=if((ygrid+xgrid-0.1)>('yo.3+xo.4'),-1,flag2)'
    'flag2=if((ygrid-xgrid+0.1)<('yo.1-xo.3'),-1,flag2)'
    'flag2=if((ygrid-xgrid-0.1)>('yo.4-xo.2'),-1,flag2)'
    endif
    'set x 1'
    'set y 1'
    'set z 1 20'
    'set time 00Z 02Z'
    'tvc=amean(maskout(th*(1+0.608*qv-qc-qi),flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'tve=amean(maskout(th*(1+0.608*qv-qc-qi),flag2),x='xo.1',x='xo.4',y='yo.1',y='yo.4')'
    'buo=9.80616*(tvc-tve)/tve'
    'cldc=amean(maskout(qc+qi,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'c'
    'on'
    'set grads off'
    'set xlabs 00:00|00:30|01:00|01:30|02:00'
    'color -levs -0.2 -0.18 -0.16 -0.14 -0.12 -0.1 -0.08 -0.06 -0.04 -0.02 0.02 0.04 0.06 0.08 0.1 0.12 0.14 0.16 0.18 0.2 -kind blue-(9)->white->orange->red'
    'd buo'
    'cbar3 [m s`a-2`n]'
    exp=subwrd(exps,i)
    'draw title Buoyancy & Cloud  `0'exp
    'draw xlab Time'
    'off'
    'set gxout contour'
    'set cthick 2'
    'set clab masked'
    'set clevs 1e-5 1e-4 1e-3 1e-2'
    'd cldc'
    'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Buo_evo_outer_'exp'.png white'
    'close 1'
    i=i+1
endwhile
