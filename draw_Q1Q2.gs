cases='GoAmazon_20141122T0530_WL2_01  GoAmazon_20141122T0530_WL2_08  GoAmazon_20141122T0530_WL2_15  GoAmazon_20141122T0530_WL2_22 GoAmazon_20141122T0530_WL6_01  GoAmazon_20141122T0530_WL6_08  GoAmazon_20141122T0530_WL6_15  GoAmazon_20141122T0530_WL6_22'
exps='L2_0.1 L2_0.8 L2_1.5 L2_2.2 L6_0.1 L6_0.8 L6_1.5 L6_2.2'
time='01:00'
rc=gsfallow('on')
num=count_num(cases)
v1=-15
v2=15
da=22
'color 1 7 1 -kind grainbow'
colors='16 17 18 19 20 21 22 23'
'reinit'
'ini -l'
i=1
while(i<=num)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'thermodynamic.ctl'
    'set x 1'
    'set y 1'
    'set z 1 19'
    'set grads off'
    'set time 'time'Z'
    'date %H%M'
    tttt=subwrd(result,1)
    'q1=amean((th-th(t-30))*48,x='128-da',x='128+da',y='128-da',y='128+da')'
    'set vrange 'v1' 'v2
    color=subwrd(colors,i)
    'set ccolor 'color
    'set cstyle 1'
    'set cmark 0'
    'set cthick 6'
    'd q1'
    'off'
    if i=1 
        'draw xlab [K/Day]'
        'draw title Q1  `0'time
        'off'
    endif
    'close 1'
    i=i+1
endwhile
'legend tl 'num' 'exps' 'colors
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Q1_'tttt'.png white'

'reinit'
'ini -l'
i=1
while(i<=num)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'thermodynamic.ctl'
    'set x 1'
    'set y 1'
    'set z 1 19'
    'set grads off'
    'set time 'time'Z'
    'date %H%M'
    tttt=subwrd(result,1)
    'q2=amean((qv-qv(t-30))*48*2.501e6/1004.64,x='128-da',x='128+da',y='128-da',y='128+da')'
    'set vrange 'v1' 'v2
    color=subwrd(colors,i)
    'set ccolor 'color
    'set cstyle 1'
    'set cmark 0'
    'set cthick 6'
    'd q2'
    'off'
    if i=1 
        'draw xlab [K/Day]'
        'draw title Q2  `0'time
        'off'
    endif
    'close 1'
    i=i+1
endwhile
'legend tl 'num' 'exps' 'colors
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Q2_'tttt'.png white'
