*grads -a 2
expname='RH-reduced'
exp='line58'
casenames='0.83 0.99'
cases='14 16'
cols='4 2'
tsels='11 12 13 14 15 16'
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
    'mul 'tnum' 2 'it' 2 -yint 0.6 -yoffset -0.04'
    'set dfile 1'
    'on'
    'set grads off'
    'set t 't
    'set z 1 11'
    i=1
    while(i<=2)
        col=subwrd(cols,i)
        'cld=qc.'i'+qi.'i
        'thvc=amean(th.'i'*(1+0.608*qv.'i'-cld),x=64,x=65,y=64,y=65)'
        'thvenv=amean(th.'i'*(1+0.608*qv.'i'-cld),x=1,x=128,y=1,y=128)'
        'buo=9.80616*(thvc-thvenv)/thvenv'
        'set yaxis 'z0' 'z1
        'set vrange -5 5'
        'set xlint 2'
        'set ylint 1'
        if (it>1)
            'set ylabs |||'
        endif
        'set cmark 0'
        'set ccolor 'col
        'set cthick '7-i
        'd buo*1e2'
        if(i=1)
            'draw xlab [`3*`110`a-2`n m s`a-2`n]'
            'draw title 't-1' min.'
        if(it=1)
            'draw ylab Height [km]'
            'q gxinfo'
            gxinfo=result
            line=sublin(gxinfo,3)
            xmin=subwrd(line,4)
            xmax=subwrd(line,6)
            line=sublin(gxinfo,4)
            ymin=subwrd(line,4)
            ymax=subwrd(line,6)
            xpos=xmin+0.2*(xmax-xmin)
            ypos=ymax-0.2*(ymax-ymin)
            'set string 1'
            'set strsiz 0.16 0.2'
            'draw string 'xpos' 'ypos' B'
        endif
        endif
        'off'
        i=i+1
    endwhile

    'mul 'tnum' 2 'it' 1 -yint 0.6 -yoffset -0.16'
    'on'
    'set grads off'
    i=1
    while(i<=2)
        if(i=1)
            'on'
        endif
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
        if(i=1)
            'draw xlab [%]'
        if(it=1)
            'draw ylab Height [km]'
            'q gxinfo'
            gxinfo=result
            line=sublin(gxinfo,3)
            xmin=subwrd(line,4)
            xmax=subwrd(line,6)
            line=sublin(gxinfo,4)
            ymin=subwrd(line,4)
            ymax=subwrd(line,6)
            xpos=xmin+0.6*(xmax-xmin)
            ypos=ymax-0.2*(ymax-ymin)
            'set string 1'
            'set strsiz 0.16 0.2'
            'draw string 'xpos' 'ypos' RH'
        endif
        endif
        'off'
        i=i+1
    endwhile
    it=it+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Fig8_buo_RH_11_16.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Fig8_buo_RH_11_16.svg white'
