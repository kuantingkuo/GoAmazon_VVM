pattern='GoAmazon_line58_??_t06'
Wsiz=8
path='/data/W.eddie/VVM/DATA/'
cases=sys('ls -d 'path%pattern'|awk -F/ ''{print $NF}''')
exp_tag='Circle_line58'
rc=gsfallow('on')
num=count_num(cases)
say num
radi=Wsiz/2
x.1=64.5-radi
x.4=64.5+radi
x.1=61
x.4=68
y.1=x.1
y.4=x.4

'reinit'
'set mproj off'
'ini -l'
i=1
while(i<=num)
    case=subwrd(cases,i)
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'dynamic.ctl'
    'xygrid'
    'flag=const(w,1)'
    'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
    'flag=if(R>'radi',-1,flag)'
    'set x 'x.1' 'x.4
    'set y 'y.1' 'y.4
    'set z 2 7'
    'set t 1'
    'winit=maskout(w,flag)'
    'set x 1'
    'set y 1'
    'set z 1'
    'wmax=max(amax(winit,x=61,x=68,y=61,y=68),z=2,z=7)'
    'wmean=max(amean(maskout(winit,winit>=0),x=61,x=68,y=61,y=68),z=2,z=7)'
    'd wmax'
    wmax=subwrd(result,4)
    'd wmean'
    wmean=subwrd(result,4)
    say case': MAX='wmax', MEAN='wmean
    'close 1'
    i=i+1
endwhile
