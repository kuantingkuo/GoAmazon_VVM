exp_tag='ctrl'
pattern='GoAmazon_'exp_tag'_??_t06'
exps='0.06_0.12 0.16_0.32 0.29_0.51 0.36_0.77 0.51_1.03 0.66_1.31 0.83_1.64 0.99_1.97 1.17_2.35 1.35_2.77 1.55_3.22 1.76_3.70'
path='/data/W.eddie/VVM/DATA/'
cases=sys('ls -d 'path%pattern'|awk -F/ ''{print $NF}''')
rc=gsfallow('on')
num=count_num(cases)
radi=4
x.1=64.5-radi
x.4=64.5+radi
y.1=x.1
y.4=x.4
'reinit'
'set mproj off'
'ini -l'
i=1
while(i<=num)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'thermodynamic.ctl'
    if(i=1)
    'xygrid'
    'flag=const(th,1)'
    'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
    'flag=if(R>'radi',-1,flag)'
    endif
    'set x 1'
    'set y 1'
    'set z 1 20'
    'set time 00Z 02Z'
    z0=qdims('levmin')/1000
    z1=qdims('levmax')/1000
    'tvc=amean(maskout(th*(1+0.608*qv-qc-qi),flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'tve=amean(maskout(th*(1+0.608*qv-qc-qi),-flag),x='x.1-2*radi',x='x.4+2*radi',y='y.1-2*radi',y='y.4+2*radi')'
    'buo=9.80616*(tvc-tve)/tve'
    'cldc=amean(maskout(qc+qi,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'c'
    'on'
    'set grads off'
    'set xlabs 00:00|00:30|01:00|01:30|02:00'
    'set yaxis 'z0' 'z1
    'color -levs -0.015 -0.014 -0.013 -0.012 -0.011 -0.01 -0.009 -0.008 -0.007 -0.006 -0.005 -0.004 -0.003 -0.002 -0.001 0.001 0.002 0.003 0.004 0.005 0.006 0.007 0.008 0.009 0.01 0.011 0.012 0.013 0.014 0.015 -kind blue-(14)->white->orange->red'
    'd buo'
    'cbar3 [m s`a-2`n]'
    exp=subwrd(exps,i)
    'draw title Buoyancy & Cloud  `0'exp
    'draw xlab Time'
    'draw ylab Height [km]'
    'off'
    'set gxout contour'
    'set cthick 2'
    'set clab masked'
    'set clevs 1e-5 1e-4 1e-3 1e-2'
    'd cldc' 
    'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Buo_evo_core_'exp_tag'_'exp'.png white'
    'close 1'
    i=i+1
endwhile
