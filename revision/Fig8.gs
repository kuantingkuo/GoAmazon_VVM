*grads -a 2
expname='RH-reduced'
exp='line58'
casenames='0.83 0.99'
cases='14 16'
cols='4 2'
tsels='2 6 11 16 21 26'
infile='inic_lin58.txt'
path='/data/W.eddie/VVM/DATA/'
rc=gsfallow('on')
tnum=count_num(tsels)
k0=1
rho='1.158 1.136 1.116 1.092 1.068 1.044 1.019 0.985 0.927 0.852 0.767 0.678 0.596 0.519 0.455 0.401 0.354 0.314 0.279 0.247 0.218 0.187 0.163 0.127 0.095 0.064'
'reinit'
'ini'
'set xlopts 1 3 0.19'
'set ylopts 1 3 0.2'
rc=read(infile)
height=''
pres=''
T=''
Q=''
k=1
while(k<=26)
    rc=read(infile)
    line=sublin(rc,2)
    height=height' 'subwrd(line,1)
    pres=pres' 'subwrd(line,2)
    T=T' 'subwrd(line,3)
    Q=Q' 'subwrd(line,4)
    k=k+1
endwhile
i=1
while(i<=2)
case=subwrd(cases,i)
    'open 'path'GoAmazon_'exp'_'case'_t06/gs_ctl_files/thermodynamic.ctl'
    i=i+1
endwhile
i=1
while(i<=2)
case=subwrd(cases,i)
    'open 'path'GoAmazon_'exp'_'case'_t06/gs_ctl_files/dynamic.ctl'
    i=i+1
endwhile
'set x 64'
'set y 64'
'set z 2 11'
'set t 1'
'P='zlike('th',pres)
'rho='zlike('w.3',rho)

'color 1 8 1 -kind black-(0)->dark_jet'
'set z 'k0' 11'
z0=qdims('levmin')/1000
z1=qdims('levmax')/1000
'T0=th*pow(P/100000,2/7)'
'Tc0=T0-273.15'
'Q0=qv'
'the0='thetae('T0','P','Q0')
't2qs Tc0 P'
'Qs0=qs'
'thes0='thetae('T0','P','Qs0')
tstr=''
it=1
while(it<=tnum)
    t=subwrd(tsels,it)
    tt=math_format('%02g',t)
    tstr=tstr'_'t
    'mul 'tnum' 2 'it' 2 -yint 0.6 -yoffset -0.04'
    'set dfile 1'
    'on'
    'set grads off'
    'set t 't
    'set z 1 11'
    i=1
    while(i<=2)
        col=subwrd(cols,i)
        'T=amean(th.'i'*pow(P/100000,2/7),x=64,x=65,y=64,y=65)'
        'Tc=T-273.15'
        'Q=amean(qv.'i',x=64,x=65,y=64,y=65)'
        'the='thetae('T','P','Q')
        't2qs Tc P'
        'Q=qs'
        'thes='thetae('T','P','Q')
        'set yaxis 'z0' 'z1
        'set vrange 331 361'
        'set xlint 10'
        'set ylint 1'
        if (it>1)
            'set ylabs |||'
        endif
        'set cmark 0'
        'set ccolor 'col
        'set cthick '7-i
        'd the'
        'q gxinfo'
        if(i=1)
            'draw xlab [K]'
            'draw title 't-1' min.'
        if(it=1)
            'draw ylab Height [km]'
        endif
        endif
        'off'
        'set cstyle 2'
        'set cmark 0'
        'set ccolor 'col
        'set cthick '8-i
        'd thes'
        i=i+1
    endwhile

    'mul 'tnum' 2 'it' 1 -yint 0.6 -yoffset -0.16'
    'on'
    'set grads off'
    i=1
    'set dfile 'i+2
    while(i<=2)
        if(i=1)
            'on'
        endif
        col=subwrd(cols,i)
        'set z 'k0' 11'
        'set ccolor 'col
        'set cthick '8-i
        'set cmark 0'
        'set vrange -3 3'
        'set xlint 2'
        'd w.'i+2
        if(i=1)
            'draw xlab [m s`a-1`n]'
        if(it=1)
            'draw ylab Height [km]'
        endif
        endif
        'off'
        'set z 1 13'
        'msflx=rho*w.'i+2
        'dm=(msflx(z+1)-msflx)'
        'dz=(lev(z+1)-lev)'
        'inflow=const(dm/dz,0,-u)'
        k=k0
        while(k<=11)
            'set z 'k
            'd inflow'
            val=subwrd(result,4)
            if (val>0)
                'set z 'k' 'k+1
                lev1=qdims('levmin')
                lev2=qdims('levmax')
                'q w2xy '0.2*i+2.5' 'lev1
                x1=subwrd(result,3)
                y1=subwrd(result,6)
                'q w2xy '0.2*i+2.5' 'lev2
                x2=subwrd(result,3)
                y2=subwrd(result,6)
                'set line 'col' 1 12'
                'draw line 'x1' 'y1' 'x2' 'y2
            endif
            k=k+1
        endwhile
        i=i+1
    endwhile

    it=it+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Fig8_rev.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Fig8_rev.svg white'

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
