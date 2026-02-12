*grads -a 0.5
exp_tag='ctrl'
name='CTRL'
sels='1 3 8'
*sels='7 8 11'
exps='0.06 0.16 0.29 0.36 0.51 0.66 0.83 0.99 1.17 1.35 1.55 1.76'
rc=gsfallow('on')
num=count_num(sels)
'reinit'
'set xsize 400 800'
'q gxinfo'
line=sublin(result,2)
xpage=subwrd(line,4)-1e-7
ypage=subwrd(line,6)
radi=2
x.1=64.5-radi
x.4=64.5+radi
y.1=x.1
y.4=x.4

path='/data/W.eddie/VVM/DATA/'
pattern='GoAmazon_'exp_tag'_??_t06'
cases=sys('ls -d 'path%pattern'|awk -F/ ''{print $NF}''')
'set mproj off'
'set display white'
'c'
'set font 1'
'set xlopts 1 4 0.17'
'set ylopts 1 4 0.17'
j=1
while(j<=num)
    i=subwrd(sels,j)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'thermodynamic.ctl'
    'open 'path'W.ctl'
    if(j=1)
    'set x 1 'x.4+2*radi
    'set y 1 'y.4+2*radi
    'xygrid'
    'flag=const(th,1)'
    'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
    'flag=if(R>'radi',-1,flag)'
    endif
    'set x 1'
    'set y 1'
    'set lev 0 16000'
    'set time 00Z 02Z'
    z0=qdims('levmin')/1000
    z1=qdims('levmax')/1000
    say 'calculate 'radi'-km circular mean of theta_v'
    'tvc=amean(maskout(th*(1+0.608*qv-qc-qi),flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    say 'calculate environmental theta_v'
    'tve=amean(th*(1+0.608*qv-qc-qi),x=1,x=128,y=1,y=128)'
    say 'calculate buoyancy'
    'buo=9.80616*(tvc-tve)/tve'
    'set dfile 2'
    say 'calculate 'radi'-km circular mean of vertical velocity'
    'wa=amean(maskout(w.2,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'set dfile 1'

    ypage1=ypage-j*ypage/3
    ypage2=ypage-(j-1)*ypage/3
    if(j>1)
        ypage1=ypage1+0.2*(j-1)
        ypage2=ypage2+0.2*(j-1)
    endif
    if(j=num)
        ypage1=0
    endif
    dy=ypage2-ypage1
    'set vpage 0 'xpage' 'ypage1' 'ypage2
say    'set vpage 0 'xpage' 'ypage1' 'ypage2
    xp1=0.8; xp2=xpage-0.3; yp1=dy-3; yp2=dy-0.1
    'set parea 'xp1' 'xp2' 'yp1' 'yp2
say    'set parea 'xp1' 'xp2' 'yp1' 'yp2
    'on'
    'set grads off'
    'set xlabs 00:00|00:30|01:00|01:30|02:00'
    'set yaxis 'z0' 'z1
    'color -levs -0.05 -0.04 -0.03 -0.02 -0.01 -0.005 0.005 0.01 0.02 0.03 0.04 0.05 -kind blue-(5)->white->orange->red'
    'd buo'
    exp=subwrd(exps,i)
    'set strsiz 0.14 0.18'
    'set string 1 tl 5'
    'draw string 'xp1+0.05' 'yp2-0.4' VVM `0'name
    'draw string 'xp1+0.05' 'yp2-0.61' `0'exp
    if(j=num)
*        'xcbar3 -unit [m s`a-2`n]'
        'draw xlab Time'
    endif
    'draw ylab Height [km]'
    'off'
    'set gxout contour'
    'set cthick 3'
    'set clab masked'
*    'color -levs -3 -2 -1 -0.3 0.3 1 2 3 4 5 6 -kind black->black -gxout contour'
    'color -levs -4 -1 -0.25 0.25 1 4 16 -kind black->black -gxout contour'
    'd wa'
    'close 2'
    'close 1'
    j=j+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Buo_w_evo_3_'exp_tag'_'radi'km.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Buo_w_evo_3_'exp_tag'_'radi'km.svg white'
