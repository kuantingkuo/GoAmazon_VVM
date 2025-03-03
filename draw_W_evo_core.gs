exp_tag='line58'
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
    'open 'path'dynamic.ctl'
    if(i=1)
    'xygrid'
    'flag=const(w,1)'
    'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
    'flag=if(R>'radi',-1,flag)'
    endif
    'set x 1'
    'set y 1'
    'set z 1 20'
    'set time 00Z 02Z'
    z0=qdims('levmin')/1000
    z1=qdims('levmax')/1000
    'wa=amean(maskout(w,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'c'
    'set grads off'
    'set xlabs 00:00|00:30|01:00|01:30|02:00'
    'set yaxis 'z0' 'z1
    'color -levs -1 -0.9 -0.8 -0.7 -0.6 -0.5 -0.4 -0.3 -0.2 -0.1 -0.05 0.05 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1 -kind blue-(10)->white->orange->red'
    'd wa'
    'cbar3 [m s`a-1`n]'
    exp=subwrd(exps,i)
    'draw title W  `0'exp
    'draw xlab Time'
    'draw ylab Height [km]'
    'gxprint /data/W.eddie/GoAmazon_VVM_Figs/W_evo_core_'exp_tag'_'exp'.png white'
    'close 1'
    i=i+1
endwhile
