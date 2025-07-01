expname='CTRL'
exp='ctrl'
casename='1.76'
case='24'
infile='inic.txt'
*infile=exp'inic.txt'
*infile='inic_'exp'.txt'
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
'set x 64'
'set y 64'
'set z 2 26'
'set t 1'
'P='zlike('th',pres)

'color 1 8 1 -kind black-(0)->dark_jet'
'set lev 0 15000'
z0=qdims('levmin')/1000
z1=qdims('levmax')/1000
*dd='5 15 25 35'
dd='0.5 2.5 4.5 6.5 8.5'
t=1
while(t<=121)
    'set t 't
    i=1
    while(i<=5)
        'set x '%subwrd(dd,i)+64.5
*        'mul 4 1 -n 'i' -xoffset 0.6 -xint 0.1'
        'mul 5 1 -n 'i
        'set grads off'
        'T=th*pow(P/100000,2/7)'
        'Tc=T-273.15'
        'Q=qv'
        'the='thetae('T','P','Q')
        't2qs Tc P'
        'Q=qs'
        'thes='thetae('T','P','Q')
        'set yaxis 'z0' 'z1
        'set vrange 333 361'
        'set xlint 10'
        'set ylint 1'
        if (t=1)&(i>1)
            'set ylabs |||||||||||||||'
        endif
        'set cmark 0'
        'set ccolor '%15+(t+14)/15
        'd the'
        'set cstyle 2'
        'set cmark 0'
        'set ccolor '%15+(t+14)/15
        'd thes'
        if(t=1)
            'draw xlab `3z`b`2e`n`1 [K]'
            if(i=1);'draw ylab Height [km]';endif
            'draw title d='%subwrd(dd,i)%' km'
        endif
        i=i+1
    endwhile
    'off'
    t=t+15
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/thes_multi_'exp'_'case'.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/thes_multi_'exp'_'case'.svg white'

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
