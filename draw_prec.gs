cases='GoAmazon_20141122T0530_WL2_01  GoAmazon_20141122T0530_WL2_08  GoAmazon_20141122T0530_WL2_15  GoAmazon_20141122T0530_WL2_22 GoAmazon_20141122T0530_WL6_01  GoAmazon_20141122T0530_WL6_08  GoAmazon_20141122T0530_WL6_15  GoAmazon_20141122T0530_WL6_22'
exps='L2_0.1 L2_0.8 L2_1.5 L2_2.2 L6_0.1 L6_0.8 L6_1.5 L6_2.2'
rc=gsfallow('on')
num=count_num(cases)
v1=0
v2=7
da=22
'color 1 7 1 -kind grainbow'
colors='16 17 18 19 20 21 22 23'
'reinit'
'ini -l'
i=1
while(i<=num)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'surface.ctl'
    'set x 1'
    'set y 1'
    'set time 00Z 02:30Z'
    'pa=amean(sprec*3600,x='128-da',x='128+da',y='128-da',y='128+da')'
    'set grads off'
    'set xlabs 00:00|00:30|01:00|01:30|02:00|02:30'
    'set ylint 1'
    color=subwrd(colors,i)
    'set ccolor 'color
    'set cmark 0'
    'set cthick 6'
    'set vrange 0 'v2
    'd pa'
    'off'
    if i=1 
        'draw ylab [mm/hr]'
        'draw title Precipitation Rate'
        'off'
    endif
    'close 1'
    i=i+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec.png white'
