cases='GoAmazon_20141122T0530_WL2_01  GoAmazon_20141122T0530_WL2_08  GoAmazon_20141122T0530_WL2_15  GoAmazon_20141122T0530_WL2_22 GoAmazon_20141122T0530_WL6_01  GoAmazon_20141122T0530_WL6_08  GoAmazon_20141122T0530_WL6_15  GoAmazon_20141122T0530_WL6_22'
exps='L2_0.1 L2_0.8 L2_1.5 L2_2.2 L6_0.1 L6_0.8 L6_1.5 L6_2.2'
rc=gsfallow('on')
num=count_num(cases)
'reinit'
'ini -l'
i=1
while(i<=num)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'dynamic.ctl'
    'set x 1'
    'set y 1'
    'set z 1 20'
    'set time 00Z 02Z'
    'wa=amean(w,x=124,x=131,y=124,y=131)'
    'c'
    'set grads off'
    'set xlabs 00:00|00:30|01:00|01:30|02:00'
    'color -levs -7 -6 -5 -4 -3 -2 -1 -0.1 0.1 1 3 5 7 9 11 13 -kind blue-(7)->white->orange->red'
    'd wa'
    'cbar3 [m s`a-1`n]'
    exp=subwrd(exps,i)
    'draw title W  `0'exp
    'draw xlab Time'
    'gxprint /data/W.eddie/GoAmazon_VVM_Figs/W_evo_core_'exp'.png white'
    'close 1'
    i=i+1
endwhile
