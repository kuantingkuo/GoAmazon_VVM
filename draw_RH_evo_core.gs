exp_tags='ctrl line58 const'
infiles='inic.txt inic_lin58.txt inic_const.txt'
exps='0.06(0.12) 0.16(0.32) 0.29(0.51) 0.36(0.77) 0.51(1.03) 0.66(1.31) 0.83(1.64) 0.99(1.97) 1.17(2.35) 1.35(2.77) 1.55(3.22) 1.76(3.70)'
rc=gsfallow('on')
radi=4
x.1=64.5-radi
x.4=64.5+radi
y.1=x.1
y.4=x.4
tag=1
while(tag<=3)
exp_tag=subwrd(exp_tags,tag)
pattern='GoAmazon_'exp_tag'_??_t06'
path='/data/W.eddie/VVM/DATA/'
cases=sys('ls -d 'path%pattern'|awk -F/ ''{print $NF}''')
num=count_num(cases)
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
    'set z 2 12'
    z0=qdims('levmin')/1000
    z1=qdims('levmax')/1000
    if (i=1)
    infile=subwrd(infiles,tag)
    rc=read(infile)
    pres=''
    k=1
    while(k<=12)
        rc=read(infile)
        line=sublin(rc,2)
        pres=pres' 'subwrd(line,2)
        k=k+1
    endwhile
    'P='zlike('th',pres)
    endif
    'set time 00Z 00:30Z'
    'Tc=amean(maskout(th*pow(P/100000,287.04/1004.64),flag),x='x.1',x='x.4',y='y.1',y='y.4')-273.15'
    'Q=amean(maskout(qv,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'Qa=amean(maskout(qv-qv(t-1),flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'Qa=const(Qa,0,-u)'
    'tpq2rh Tc P Q'
    'c'
    'on'
    'set grads off'
    'set xaxis 0 30'
    'set yaxis 'z0' 'z1
    'color 70 100 -kind drywet'
    'd rh'
    'cbar3 [%]'
    exp=subwrd(exps,i)
    'draw title RH & Qv changes  `0'exp
    'draw xlab Time [min.]'
    'draw ylab Height [km]'
    'off'
    'set gxout contour'
    'set clab masked'
    'set clevs -15e-5 -0.00012 -9e-05 -6e-05 -3e-05 3e-05 6e-05 9e-05 0.00012 0.00015'
    'd Qa'
    'gxprint /data/W.eddie/GoAmazon_VVM_Figs/RH_evo_core_'exp_tag'_'exp'.png white'
    'close 1'
    i=i+1
endwhile
tag=tag+1
endwhile
