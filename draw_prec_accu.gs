cases='GoAmazon_20141122T0530_WL2_01  GoAmazon_20141122T0530_WL2_08  GoAmazon_20141122T0530_WL2_15  GoAmazon_20141122T0530_WL2_22 GoAmazon_20141122T0530_WL6_01  GoAmazon_20141122T0530_WL6_08  GoAmazon_20141122T0530_WL6_15  GoAmazon_20141122T0530_WL6_22'
exps='L2_0.1 L2_0.8 L2_1.5 L2_2.2 L6_0.1 L6_0.8 L6_1.5 L6_2.2'
rc=gsfallow('on')
num=count_num(cases)
v1=0
v2=42
'color 1 7 1 -kind grainbow'
colors='16 17 18 19 20 21 22 23'
colors='9 11 10 2 14 4 3 6'
styles='2 2 2 2 1 1 1 1'
'reinit'
'ini -l'
i=1
while(i<=num)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'surface.ctl'
    'set x 1'
    'set y 1'
    'set time 00Z 03:00Z'
*    'ps=const(sprec,0)'
*    'count=const(sprec,0)'
*    y=99
*    while(y<124)
*        'set y 'y
*        'ps=ps+sumg(sprec*60,x='223-y',x='32+y')'
*        'count=count+sumg(const(sprec,1),x='223-y',x='32+y')'
*        y=y+1
*    endwhile    
*    'ps=ps+asumg(sprec*60,x=99,x=156,y=124,y=131)'
*    'count=count+asumg(const(sprec,1),x=99,x=156,y=124,y=131)'
*    y=132
*    while(y<=156)
*        'set y 'y
*        'ps=ps+sumg(sprec*60,x='y-32',x='287-y')'
*        'count=count+sumg(const(sprec,1),x='y-32',x='287-y')'
*        y=y+1
*    endwhile
*    'pa=ps/count'
    'pa=amean(sprec*60,x=124,x=131,y=124,y=131)'
    'pc=sumg(pa,t=1,t+0)'
    'set grads off'
*    'set xlabs 00:00|00:30|01:00|01:30|02:00'
    'set xlabs 00:00|00:30|01:00|01:30|02:00|02:30|03:00'
*    'set ylint 1'
    color=subwrd(colors,i)
    'set ccolor 'color
    style=subwrd(styles,i)
    'set cstyle 'style
    'set cmark 0'
    'set cthick 6'
    'set vrange 0 'v2
    'd pc'
    'off'
    if i=1 
        'draw ylab [mm]'
        'draw title Accumulated Precipitation'
        'off'
    endif
    'close 1'
    i=i+1
endwhile
marks='0 0 0 0 0 0 0 0'
'legend tl 'num' 'exps' 'colors' 'marks' 'styles
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_accu_center.png white'
*'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_accu.png white'
