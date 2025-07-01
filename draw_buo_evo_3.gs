exp_tag='line58'
name='RH-reduced'
sels='7 8 12'
exps='0.06 0.16 0.29 0.36 0.51 0.66 0.83 0.99 1.17 1.35 1.55 1.76'
rc=gsfallow('on')
num=count_num(sels)
'reinit'
'set xsize 500 1000'
'q gxinfo'
line=sublin(result,2)
xpage=subwrd(line,4)-0.00001
ypage=subwrd(line,6)
radi=1
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
'set xlopts 1 2 0.13'
'set ylopts 1 2 0.13'
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
    'tvc=amean(maskout(th*(1+0.608*qv-qc-qi),flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'tve=amean(maskout(th*(1+0.608*qv-qc-qi),-flag),x='x.1-2*radi',x='x.4+2*radi',y='y.1-2*radi',y='y.4+2*radi')'
    'buo=9.80616*(tvc-tve)/tve'
    'cldc=amean(maskout(qc+qi,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'set dfile 2'
    'wa=amean(maskout(w.2,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'set dfile 1'

    ypage1=ypage-j*ypage/3
    ypage2=ypage-(j-1)*ypage/3
    if(j>1)
        ypage1=ypage1+0.4*(j-1)
        ypage2=ypage2+0.4*(j-1)
    endif
    if(j=num)
        ypage1=0
    endif
    dy=ypage2-ypage1
    'set vpage 0 'xpage' 'ypage1' 'ypage2
say    'set vpage 0 'xpage' 'ypage1' 'ypage2
    xp1=0.8; xp2=xpage-0.3; yp1=dy-3.4; yp2=dy-0.5
    'set parea 'xp1' 'xp2' 'yp1' 'yp2
say    'set parea 'xp1' 'xp2' 'yp1' 'yp2
    'on'
    'set grads off'
    'set xlabs 00:00|00:30|01:00|01:30|02:00'
    'set yaxis 'z0' 'z1
    'color -levs -0.05 -0.04 -0.03 -0.02 -0.01 -0.005 0.005 0.01 0.02 0.03 0.04 0.05 -kind blue-(5)->white->orange->red'
    'd buo'
    exp=subwrd(exps,i)
    if(j=1)
        'draw title Buoyancy, W, & Cloud'
    endif
    'set string 1 tl'
    'draw string 'xp1+0.05' 'yp2-0.2' VVM `0'name
    'draw string 'xp1+0.05' 'yp2-0.35' `0'exp
    if(j=num)
*        'xcbar3 -unit [m s`a-2`n]'
        'draw xlab Time'
    endif
    'draw ylab Height [km]'
    'off'
    'set gxout contour'
    'set cthick 3'
    'set clab masked'
*    'color -levs -2 -1 -0.5 -0.2 0.2 0.5 1 2 3 4 5 6 7 8 9 -kind black->black -gxout contour'
    'color -levs -6 -4 -2 -1 1 2 4 6 9 12 15 18 21 24 27 30 -kind black->black -gxout contour'
    'd wa'
    'set cthick 6'
    'set rgb 99 30 180 30'
    'set ccolor 99'
    'set clab masked'
    'set clevs 1e-5 1e-4 1e-3 1e-2'
    'd cldc'
    'close 2'
    'close 1'
    j=j+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Buo_evo_3_'exp_tag'.png white x500 y1000'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Buo_evo_3_'exp_tag'.svg white x500 y1000'
