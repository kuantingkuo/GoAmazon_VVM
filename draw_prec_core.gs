exp_tag='ctrl'
exp_cap='CTRL'
sels='1 3 5 6 7 8 9 10 11 12'
pattern='GoAmazon_'exp_tag'_??_t06'
path='/data/W.eddie/VVM/DATA/'
cases=sys('ls -d 'path%pattern'|awk -F/ ''{print $NF}''')
rc=gsfallow('on')
num=count_num(sels)
say num
exps='0.06 0.16 0.29 0.36 0.51 0.66 0.83 0.99 1.17 1.35 1.55 1.76'
radi=4
x.1=64.5-radi
x.4=64.5+radi
y.1=x.1
y.4=x.4

v1=0
v2=27
'color 2 'num' 1 -kind dark_jet'
colors=range(16,num+16-1)
styles='1 1 1 1 1 1 1 1 1 1 1 1'
'reinit'
'set mproj off'
'ini -l'
i=1
while(i<=num)
    j=subwrd(sels,i)
    case=subwrd(cases,j)
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
        'draw ylab Precipitation Rate [mm h`a-1`n]'
        'draw title VVM 'exp_cap
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
*num=num/2
*exp1=''
*exp2=''
*color1=''
*color2=''
*i=1
*while(i<=num)
*    exp1=exp1%subwrd(exps,i)' '
*    exp2=exp2%subwrd(exps,i+num)' '
*    color1=color1%subwrd(colors,i)' '
*    color2=color2%subwrd(colors,i+num)' '
*    i=i+1
*endwhile
num1=5
num2=5
exp1=''
i=1
while(i<=num1)
    j=subwrd(sels,i)
    exp1=exp1' 'subwrd(exps,j)
    i=i+1
endwhile
exp2=''
while(i<=num1+num2)
    j=subwrd(sels,i)
    exp2=exp2' 'subwrd(exps,j)
    i=i+1
endwhile
color1=range(16,16+num1-1)
color2=range(16+num1,16+num1+num2-1)
'legend tc 'num1' 'exp1' 'color1
'legend tr 'num2' 'exp2' 'color2
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_'exp_tag'_core.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_'exp_tag'_core.svg white'
