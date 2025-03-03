exp_tag='ctrl'
pattern='GoAmazon_'exp_tag'_??_t06'
Wsiz=8
path='/data/W.eddie/VVM/DATA/'
cases=sys('ls -d 'path%pattern'|awk -F/ ''{print $NF}''')
say cases
exps='08 10 12 14 16 18 20 22 24'
exps='0.36(0.77) 0.51(1.03) 0.66(1.31) 0.83(1.64) 0.99(1.97) 1.17(2.35) 1.35(2.77) 1.55(3.22) 1.76(3.70)'
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
num=num/2
exp1=''
exp2=''
color1=''
color2=''
i=1
while(i<=num)
    exp1=exp1%subwrd(exps,i)' '
    exp2=exp2%subwrd(exps,i+num)' '
    color1=color1%subwrd(colors,i)' '
    color2=color2%subwrd(colors,i+num)' '
    i=i+1
endwhile
'legend tc 'num' 'exp1' 'color1
'legend tr 'num' 'exp2' 'color2
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_'exp_tag'_core.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_'exp_tag'_core.svg white'
