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

'color 1 8 1 -kind black-(0)->dark_jet'
'set z 'k0' 11'
z0=qdims('levmin')/1000
z1=qdims('levmax')/1000
'T0=th*pow(P/100000,2/7)'
'Tc0=T0-273.15'
'Q0=qv'
tstr=''
it=1
while(it<=tnum)
    t=subwrd(tsels,it)
    tt=math_format('%02g',t)
    tstr=tstr'_'t
    'mul 'tnum' 1 'it' 1 -yint 0.6 -yoffset -0.04'
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
        'tpq2rh Tc P Q'
        'set yaxis 'z0' 'z1
        'set vrange 65 105'
        'set xlint 10'
        'set ylint 1'
        if (it>1)
            'set ylabs |||'
        endif
        'set cmark 0'
        'set ccolor 'col
        'set cthick '7-i
        'd rh'
        'q gxinfo'
        if(i=1)
            'draw xlab [%]'
            'draw title 't-1' min.'
        if(it=1)
            'draw ylab Height [km]'
        endif
        endif
        'off'
        i=i+1
    endwhile

    it=it+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Fig8_RH.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Fig8_RH.svg white'
