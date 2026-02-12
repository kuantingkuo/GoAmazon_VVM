* grads -a 2
expname='CTRL'
exp='ctrl'
names='0.06 0.29 0.99'
cases='02 06 16'
precinits='70 38 26'
rc=gsfallow('on')
num=count_num(cases)
infile='inic.txt'
path='/data/W.eddie/VVM/DATA/'
'reinit'
'ini'
ncols=7
'color 1 'ncols-1' 1 -kind (50,150,255)-(1)->blue-(0)->(0,0,0)-(0)->red-(1)->(255,150,50)'
rc=read(infile)
pres=''
T=''
Q=''
k=1
while(k<=26)
    rc=read(infile)
    line=sublin(rc,2)
    pres=pres' 'subwrd(line,2)
    T=T' 'subwrd(line,3)
    Q=Q' 'subwrd(line,4)
    k=k+1
endwhile
'c'
i=1
while(i<=num)
    'on'
    case=subwrd(cases,i)
    'open 'path'GoAmazon_'exp'_'case'_t06/gs_ctl_files/thermodynamic.ctl'
    'open 'path'GoAmazon_'exp'_'case'_t06/gs_ctl_files/dynamic.ctl'
    'set x 64'
    'set y 64'
    'set t 1'
    'P='zlike('th',pres)

    xc=64.5
    yc=64.5
    dt=5
    d=3
    'set x 1 128'
    'set y 1 128'
    'set z 1'
    'xygrid'
    'flag=const(th,1)'
    'R=sqrt(pow(xgrid-'xc',2)+pow(ygrid-'yc',2))'
    'flag=if((R<='d'),flag,-1)'
    'open 'path'GoAmazon_'exp'_'case'_t06/gs_ctl_files/surface.ctl'
    'set x 1'
    'set y 1'
    'set t 1 last'
    'precgt1=amean(maskout(sprec.3*3600,flag),x='xc-d',x='xc+d',y='yc-d',y='yc+d')>1'
    'd maxloc(precgt1,t=1,t=180)'
    line=sublin(result,2)
    init=subwrd(line,4)
    say 'Prec. initial timestep: 'init
    'close 3'
    v1=-4.6; v2=4.6; vint=1
*    init=subwrd(precinits,i)
    t=init-15
    nt=1
    while(nt<=ncols)
        'set t 't
        say t
        'set z 2 12'
        z0=qdims('levmin')/1000
        'set lev 'z0*1000' 3200'
        z1=qdims('levmax')/1000
        'set x 'xc-d-1' 'xc+d+1
        'set y 'yc-d-1' 'yc+d+1
        'conv='convergence('u.2','v.2',500,500)
        'set x 'xc
        'set y 'yc
        'conv1=amean(maskout(conv,flag),x='xc-d',x='xc+d',y='yc-d',y='yc+d')'
        'T=amean(maskout(th*pow(P/100000,2/7),flag),x='xc-d',x='xc+d',y='yc-d',y='yc+d')'
        'Tc=T-273.15'
        'Q=amean(maskout(qv,flag),x='xc-d',x='xc+d',y='yc-d',y='yc+d')'
        'the='thetae('T','P','Q')
        'mul 'num' 1 -n 'i
        'set grads off'
        'set yaxis 'z0' 'z1
        'set ylint 1'
        if (nt=1)
            if(i>1)
                'set ylabs |||||||||||||||'
            endif
            'set vrange 'v1' 'v2
            'set xlint 'vint
            'set cmark 0'
            'set cthick 4'
            'set ccolor 15'
            'd const(conv1,0)'
        endif
        'set vrange 'v1' 'v2
        'set xlint 'vint
        'set cmark 0'
        'set cthick 8'
        'set ccolor '%15+nt
        'd conv1*1e3'
        if(nt=1)
            'draw xlab Conv. [`3*`110`a-3`n s`a-1`n]'
            'draw title VVM `0'subwrd(names,i)
            if(i=1)
                'draw ylab Height [km]'
                cols=range(16,16+ncols-1)
                strings=range(0,dt*(ncols-1),dt)
                strings=range(-15,15,dt)
                'legend bl 'ncols' 'strings' 'cols
            endif
        endif
        'off'
        t=t+dt
        nt=nt+1
    endwhile
    'close 2'
    'close 1'
    i=i+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_conv_'exp'_'case'.png white x800 y400'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_conv_'exp'_'case'.svg white'

function thetae(t,p,q)
    'Re=(1-'q')*287'
    'Cp=1005+'q'*(4219-1005)'
    'R=287+'q'*461.5-'q'*287'
    'pv='p'*'q'/(0.622+(1-0.622)*'q')'
    'Tc='t'-273.15'
    't2es Tc'
    'ps=es'
    'omegae=pow(R/Re,Re/Cp)*pow(pv/ps,-'q'*461.5/Cp)'
    'thetae='t' * pow(100000/'p',Re/Cp) * omegae * exp(('q'*2.5009e6)/(Cp*'t'))'
    return 'thetae'

function convergence(u,v,dx,dy)
    'du=cdiff('u',x)'
    'dv=cdiff('v',y)'
    'convergence=-(du/'dx'+dv/'dy')'
    return 'convergence'
