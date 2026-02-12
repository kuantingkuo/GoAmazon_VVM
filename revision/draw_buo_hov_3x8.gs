*grads -a 1.776
case.1='line58_14'
case.2='line58_16'
case.3='line58_18'
name.1='0.83'
name.2='0.99'
name.3='1.17'
path.1='/data/W.eddie/VVM/DATA/GoAmazon_'case.1'_t06/'
path.2='/data/W.eddie/VVM/DATA/GoAmazon_'case.2'_t06/'
path.3='/data/W.eddie/VVM/DATA/GoAmazon_'case.3'_t06/'
rc=gsfallow('on')
'reinit'
'ini'
xini=1
yini=1.2
'q gxinfo'
page=sublin(result,2)
xpage=subwrd(page,4)
ypage=subwrd(page,6)
x0=xini
y0=ypage-0.15
dx=(xpage-x0)/8-1e-2
dy=(y0-yini)/3-1e-6

i=1
while(i<=3)
'open 'path.i'gs_ctl_files/thermodynamic.ctl'
'open 'path.i'gs_ctl_files/W.ctl'


'set x 50.5 78.5'
'set y 64'
'set time 00z 01z'
x1=x0
y1=y0-dy*i
k=2
while(k<=9)
    'set parea 'x1' 'x1+dx' 'y1' 'y1+dy
    'set z 'k
    rc=qdims('levmin')
    km=math_format('%4.2f',rc/1000)
    'set grads off'
    'cld1=qc.1+qi.1'
    'thv1=th.1*(1+0.608*qv.1-cld1)'
    'thv1env=amean(th.1*(1+0.608*qv.1-cld1),x=1,x=128,y=1,y=128)'
    'buo1=(thv1-thv1env)/thv1env*9.80616'
    'set xaxis -7 7 2'
    if(i!=3)
        'set xlabs ||||||'
    else
        'set xlabs -6|||0|||6'
    endif
    if(k=2)
        'set tlsupp month'
        if(i=1)
            'set ylabs 00:00|00:15|00:30|00:45|01:00'
        else
            'set ylabs 00:00|00:15|00:30|00:45|'
        endif
    else
        'set ylabs ||||'
    endif
    clevs='-0.05 -0.04 -0.03 -0.02 -0.01 -0.005 0.005 0.01 0.02 0.03 0.04 0.05'
    'color -levs 'clevs' -kind blue-(5)->white->orange->red'
    'd buo1'
    if(i=3)
        'draw xlab [km]'
    endif
    'q gxinfo'
    xinfo=sublin(result,3)
    yinfo=sublin(result,4)
    x1=subwrd(xinfo,4)
    y2=subwrd(yinfo,6)
    xstr=x1+0.1
    ystr=y2-0.2
    'set strsiz 0.08 0.1'
    'draw string 'xstr' 'ystr' 'name.i
    'draw string 'xstr+0.42' 'ystr' z='km'km'
    k=k+1
    x1=x1+dx
endwhile

'close 2'
'close 1'
i=i+1
endwhile
'xcbar3 1 10 0.25 0.45 -unit B [m s`0`a-2`n`1]'
'gxprint buo_hov_3x8.png white'
