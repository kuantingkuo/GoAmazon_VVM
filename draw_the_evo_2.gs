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
'set z 2 26'
'set t 1'
'P='zlike('th',pres)

'color 1 8 1 -kind black-(0)->dark_jet'
'set z 2 11'
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
    'mul 'tnum' 1 -n 'it''
    'on'
    'set grads off'
    'set t 't
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
        'set vrange 333 361'
        'set xlint 10'
        'set ylint 1'
        if (it>1)
            'set ylabs |||'
        endif
        'set cmark 0'
        'set ccolor 'col
        'd the'
        if(i=1)
            'draw title 't-1' min.'
            'draw xlab `3z`b`2e`n`1 [K]'
        if(it=1)
            'draw ylab Height [km]'
        endif
        endif
        'off'
        'set cstyle 2'
        'set cmark 0'
        'set ccolor 'col
        'd thes'
        'set x 63.93 64.'10-i
        'set ccolor 'col
        'set arrowhead -0.4'
        'set arrscl 0.5 1'
        'd const(w.'i+2',0);w.'i+2
        i=i+1
    endwhile
    it=it+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_evo_2_'exp%tstr'.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_evo_2_'exp%tstr'.svg white'

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
