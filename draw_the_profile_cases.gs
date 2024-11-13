cases='GoAmazon_20141122T0530_WL2_01  GoAmazon_20141122T0530_WL2_08  GoAmazon_20141122T0530_WL2_15  GoAmazon_20141122T0530_WL2_22 GoAmazon_20141122T0530_WL6_01  GoAmazon_20141122T0530_WL6_08  GoAmazon_20141122T0530_WL6_15  GoAmazon_20141122T0530_WL6_22'
exps='L2_0.1 L2_0.8 L2_1.5 L2_2.2 L6_0.1 L6_0.8 L6_1.5 L6_2.2'
tstep=121
v1=330; v2=360
path='/data/W.eddie/VVM/DATA/'
rc=gsfallow('on')
num=count_num(cases)
ttt=math_format('%03g',tstep)
'reinit'
'ini'
if num=1
    'set rgb 16 0 0 0'
else
    'color 1 'num-1' 1 -kind jet'
endif
i=1
while(i<=num)
    case=subwrd(cases,i)
    exp=subwrd(exps,i)
    'open 'path%case'/gs_ctl_files/thermodynamic.ctl'
    'set dfile 'i
    xmin=124
    xmax=131
    ymin=124
    ymax=131
    'set t 'tstep
    'date %H:%M'
    time=subwrd(result,1)
    'set lev 0 16000'
    'set x 1'
    'set y 1'
    'tha'i'=amean(th.'i',x='xmin',x='xmax',y='ymin',y='ymax')'
    'qva'i'=amean(qv.'i',x='xmin',x='xmax',y='ymin',y='ymax')'
    'the'i'=tha'i'+2.5e6*qva'i'/1004.67'
    'set grads off'
    'set vrange 'v1' 'v2
    'set cmark 0'
    'set cthick 7'
    'set ccolor 'i+15
    'd the'i
    if i=1
        'draw xlab [K]'
        'draw ylab Height [m]'
        'draw title `3z`1`be`n at 'time
        'off'
    endif
    i=i+1
endwhile
*'legend r 'num' 'exps' 16 17 18 19'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_'ttt'.png white'
i=1
while(i<=num)
    case=subwrd(cases,i)
    'set dfile 'i
    'set t 'tstep
    'set lev 0 16000'
    'set x 1 'xmax
    'set y 1 'ymax
    't'i'=th.'i
    'qvs'i'=qv.'i
    'q file'
    txt='/data/W.eddie/GoAmazon_VVM/inic.txt'
    rc=read(txt)
    k=1
    while(k<=26)
        kp=k+1
        'z=lev(z='k')'
        rc=read(txt)
        line=sublin(rc,2)
        pres.kp=subwrd(line,2)
        if k=1
            pres.1=pres.2
        endif
        't'i'=if(lev=z,th.'i'*pow('pres.k'/100000,2/7)-273.15,t'i')'
        't2qs t'i' 'pres.k' '
        'qvs'i'=if(lev=z,qs,qvs'i')'
        k=k+1
    endwhile
    rc=close(txt)
    'thes=th.'i'+2.5e6*qvs'i'/1004.67'
    'set x 1'
    'set y 1'
    'thesa'i'=amean(thes,x='xmin',x='xmax',y='ymin',y='ymax')'

    'set grads off'
    'set vrange 'v1' 'v2
    'set cmark 0'
    'set cthick 7'
    'set ccolor 'i+15
    'set cstyle 2'
    'd thesa'i
    i=i+1
endwhile
'legend r 'num' 'exps' 16 17 18 19 20 21 22 23'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_s_'ttt'.png white'
