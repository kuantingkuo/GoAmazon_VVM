expname='CTRL'
exp='ctrl'
casename='1.76'
case='24'
infile='inic.txt'
path='/data/W.eddie/VVM/DATA/'
rc=gsfallow('on')
'reinit'
'ini'
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
'open 'path'GoAmazon_'exp'_'case'_t06/gs_ctl_files/thermodynamic.ctl'
'open 'path'GoAmazon_'exp'_'case'_t06/gs_ctl_files/dynamic.ctl'
'set x 64'
'set y 64'
'set t 1'
'P='zlike('th',pres)

'color 1 8 1 -kind black-(0)->dark_jet'
*dd='5 15 25 35'
xc=64.5
yc=64.5
*dd='0.5 2.5 4.5 6.5 8.5'
dd='0.5 2.5 4.5'
inum=count_num(dd)
dt=5
t=1
while(t<=dt*8+1)
    'set t 't
    i=1
    while(i<=inum)
        d=subwrd(dd,i)
        'set x 1 128'
        'set y 1 128'
        'set z 1'
        'xygrid'
        'flag=const(th,1)'
        'R=sqrt(pow(xgrid-'xc',2)+pow(ygrid-'yc',2))'
        'set x 'xc-d-1' 'xc+d+1
        'set y 'yc-d-1' 'yc+d+1
        'flag=if((R>='d-1')&(R<='d+1'),flag,-1)'
        'set grads off'
        'set z 2 12'
        z0=qdims('levmin')/1000
        z1=qdims('levmax')/1000
        'conv='convergence('u.2','v.2',500,500)
        'set x 'xc
        'set y 'yc
        'conv1=amean(maskout(conv,flag),x='xc-d',x='xc+d',y='yc-d',y='yc+d')'
        'T=amean(maskout(th*pow(P/100000,2/7),flag),x='xc-d',x='xc+d',y='yc-d',y='yc+d')'
        'Tc=T-273.15'
        'Q=amean(maskout(qv,flag),x='xc-d',x='xc+d',y='yc-d',y='yc+d')'
        'the='thetae('T','P','Q')
        'mul 'inum' 1 -n 'i
*        'mul 4 1 -n 'i' -xoffset 0.6 -xint 0.1'
        'set grads off'
        'set yaxis 'z0' 'z1
        'set vrange 333 361'
        'set xlint 10'
        'set ylint 1'
        if (t=1)&(i>1)
            'set ylabs |||||||||||||||'
        endif
        'set cmark 0'
        'set ccolor '%15+(t-1)/dt+1
*        'd the'
        'set vrange -18 23'
        'set xlint 10'
*        'set cstyle 2'
        'set cthick 5'
        'set cmark 0'
        'set ccolor '%15+(t-1)/dt+1
        'd conv1*1e3'
        if(t=1)
*            'draw xlab `3z`b`2e`n`1 [K]'
            'draw xlab Conv. [`3*`110`a-3`n s`a-1`n]'
            if(i=1);'draw ylab Height [km]';endif
            'draw title d='%subwrd(dd,i)%' km'
        endif
        i=i+1
    endwhile
    'off'
    t=t+dt
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_conv_'exp'_'case'.png white'
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
