cases='GoAmazon_20141122T0530_WL2_01  GoAmazon_20141122T0530_WL2_08  GoAmazon_20141122T0530_WL2_15  GoAmazon_20141122T0530_WL2_22 GoAmazon_20141122T0530_WL6_01  GoAmazon_20141122T0530_WL6_08  GoAmazon_20141122T0530_WL6_15  GoAmazon_20141122T0530_WL6_22'
exps='L2_0.1 L2_0.8 L2_1.5 L2_2.2 L6_0.1 L6_0.8 L6_1.5 L6_2.2'
times='00:30 01:00 01:30 02:00'
rc=gsfallow('on')
num=count_num(cases)
nt=count_num(times)
q1v1=-45
q1v2=45
q2v1=-85
q2v2=85
'color 1 7 1 -kind grainbow'
colors='16 17 18 19 20 21 22 23'
colors='9 11 10 2 14 4 3 6'
styles='2 2 2 2 1 1 1 1'
t=1
while(t<=nt)
time=subwrd(times,t)
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
    'q1=const(th,0)'
    'count=const(th,0)'
    y=99
    while(y<124)
        'set y 'y
        'q1=q1+sumg((th-th(t-30))*48,x='223-y',x='32+y')'
        'count=count+sumg(const(th,1),x='223-y',x='32+y')'
        y=y+1
    endwhile    
    'q1=q1+asumg((th-th(t-30))*48,x=99,x=156,y=124,y=131)'
    'count=count+asumg(const(th,1),x=99,x=156,y=124,y=131)'
    y=132
    while(y<=156)
        'set y 'y
        'q1=q1+sumg((th-th(t-30))*48,x='y-32',x='287-y')'
        'count=count+sumg(const(th,1),x='y-32',x='287-y')'
        y=y+1
    endwhile
    'q1=q1/count'
    'set vrange 'q1v1' 'q1v2
    if i=1 
        'set ccolor 1'
        'set cmark 0'
        'set cthick 2'
        'd const(q1,0)'
        'draw xlab [K/Day]'
        'draw title Q1  `0'time
        'off'
    endif
    color=subwrd(colors,i)
    'set ccolor 'color
    style=subwrd(styles,i)
    'set cstyle 'style
    'set cmark 0'
    'set cthick 6'
    'd q1'
    'close 1'
    i=i+1
endwhile
marks='0 0 0 0 0 0 0 0'
'legend tl 'num' 'exps' 'colors' 'marks' 'styles
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
    'q2=const(th,0)'
    'count=const(th,0)'
    y=99
    while(y<124)
        'set y 'y
        'q2=q2+sumg((qv-qv(t-30))*48*2.501e6/1004.64,x='223-y',x='32+y')'
        'count=count+sumg(const(th,1),x='223-y',x='32+y')'
        y=y+1
    endwhile    
    'q2=q2+asumg((qv-qv(t-30))*48*2.501e6/1004.64,x=99,x=156,y=124,y=131)'
    'count=count+asumg(const(th,1),x=99,x=156,y=124,y=131)'
    y=132
    while(y<=156)
        'set y 'y
        'q2=q2+sumg((qv-qv(t-30))*48*2.501e6/1004.64,x='y-32',x='287-y')'
        'count=count+sumg(const(th,1),x='y-32',x='287-y')'
        y=y+1
    endwhile
    'q2=q2/count'
    'set vrange 'q2v1' 'q2v2
    if i=1 
        'set ccolor 1'
        'set cmark 0'
        'set cthick 2'
        'd const(q2,0)'
        'draw xlab [K/Day]'
        'draw title Q2  `0'time
        'off'
    endif
    color=subwrd(colors,i)
    'set ccolor 'color
    style=subwrd(styles,i)
    'set cstyle 'style
    'set cmark 0'
    'set cthick 6'
    'd q2'
    'close 1'
    i=i+1
endwhile
marks='0 0 0 0 0 0 0 0'
'legend tl 'num' 'exps' 'colors' 'marks' 'styles
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Q2_'tttt'.png white'
t=t+1
endwhile
