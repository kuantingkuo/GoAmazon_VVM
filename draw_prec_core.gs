exp_tag='line58'
pattern='GoAmazon_'exp_tag'_??_t06'
Wsiz=8
path='/data/W.eddie/VVM/DATA/'
cases=sys('ls -d 'path%pattern'|awk -F/ ''{print $NF}''')
say cases
exps='02 04 06 08 10 12 14 16 18 20 22 24'
exps='0.06_0.12 0.16_0.32 0.29_0.51 0.36_0.77 0.51_1.03 0.66_1.31 0.83_1.64 0.99_1.97 1.17_2.35 1.35_2.77 1.55_3.22 1.76_3.70'
rc=gsfallow('on')
num=count_num(cases)
say num
radi=Wsiz/2
x.1=64.5-radi
x.4=64.5+radi
y.1=x.1
y.4=x.4

v1=0
v2=27
*colors='9 11 10 2 14 4 3 6'
*styles='2 2 2 2 1 1 1 1'
'color 2 'num' 1 -kind dark_jet'
colors=range(16,num+16-1)
styles='1 1 1 1 1 1 1 1 1 1 1 1'
'reinit'
'set mproj off'
'ini -l'
i=1
while(i<=num)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'surface.ctl'
    'xygrid'
    'flag=const(sprec,1)'
    'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
    'flag=if(R>'radi',-1,flag)'
    'set x 1'
    'set y 1'
    'set time 00Z 02Z'
    'pa=amean(maskout(sprec*3600,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
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
marks='0 0 0 0 0 0 0 0 0 0 0 0'
*marks='0 0 0 0'
'legend tr 'num' 'exps' 'colors' 'marks' 'styles
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_'exp_tag'_core.png white'
