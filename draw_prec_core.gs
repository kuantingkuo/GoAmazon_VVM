pattern='GoAmazon_20141122T0530_WL?_??'
path='/data/W.eddie/VVM/DATA/'
cases=sys('ls -d 'path%pattern'|awk -F/ ''{print $NF}''')
say cases
exp_tag='const'
exps='L2_0.1 L2_0.8 L2_1.5 L2_2.2 L6_0.1 L6_0.8 L6_1.5 L6_2.2'
rc=gsfallow('on')
num=count_num(cases)
say num

v1=0
v2=110
colors='9 11 10 2 14 4 3 6'
styles='2 2 2 2 1 1 1 1'
'reinit'
'set mproj off'
'ini -l'
i=1
while(i<=num)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'surface.ctl'
    'set x 1'
    'set y 1'
    'dlon=lon(x=2)-lon(x=1)'
    'dlat=lat(y=2)-lat(y=1)'
    'lon0=lon(x=1)'
    'lat0=lat(y=1)'
    'set t 1'
    'set x 1'
    'set y 1'
    'set time 00Z 02Z'
    'pa=amean(sprec*3600,x=124,x=131,y=124,y=131)'
    'set grads off'
    'set xlabs 00:00|00:30|01:00|01:30|02:00'
*    'set ylint 1'
    color=subwrd(colors,i)
    'set ccolor 'color
    style=subwrd(styles,i)
    'set cstyle 'style
    'set cmark 0'
    'set cthick 7'
    'set vrange 0 'v2
    'd pa'
    if i=1 
        'draw xlab Time'
        'draw ylab [mm h`a-1`n]'
        'draw title Precipitation Rate'
        'off'
*        'temp=asumg(if(flag>0,1,0),x=1,x=256,y=1,y=256)'
*        'q defval temp 1 1'
*        temp=subwrd(result,3)
*        say temp
*        'set x 1 256'
*        'set y 1 256'
*        'set t 1'
*        'random_mask sprec 'temp
*        'set x 1'
*        'set y 1'
*        'set time 00Z 02Z'
*        'pa=amean(maskout(sprec*3600,randommask),x=1,x=256,y=1,y=256)'
*        'set ccolor 15'
*        'set cmark 0'
*        'd pa'
    endif
    'close 1'
    i=i+1
endwhile
marks='0 0 0 0 0 0 0 0'
*marks='0 0 0 0'
'legend tr 'num' 'exps' 'colors' 'marks' 'styles
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_'exp_tag'_core.png white'
