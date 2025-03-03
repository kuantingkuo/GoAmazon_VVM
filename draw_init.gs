exp='CTRL'
infile='inic.txt'
*infile=exp'inic.txt'
*infile='inic_'exp'.txt'
rc=gsfallow('on')
'reinit'
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
'open thermodynamic.ctl'
'set x 1'
'set y 1'
'set z 2 26'
'set t 1'
'T='zlike('th',T)
'Q='zlike('th',Q)
'P='zlike('th',pres)
*'the=T*pow(100000/P,2/7)+2.5e6*Q/1004.67'
'the='thetae('T','P','Q')
'Tc=T-273.15'
't2qs Tc P'
'thes='thetae('T','P','qs')

v1=335; v2=365
'ini'
'set grads off'
*'set lev 0 15'
'set z 2 21.0889'
'set vrange 'v1' 'v2
'set xlint 5'
'set cmark 0'
'set cthick 7'
'set ccolor 1'
'd the'
'draw xlab [K]'
'draw ylab Height [km]'
'draw title Initial Profile'
'off'
'set cmark 0'
'set cthick 7'
'set ccolor 1'
'set cstyle 2'
'd thes'
'legend r 2 `3z`2`be`n `3z`2`bes`n 1 1 0 0 1 2'
*'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_'exp'inic.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_'exp'_inic.png white'

function thetae(t,p,q)
    'r='q'/(1-'q')'
    'e='p'*r/(0.622+r)'
    'TL=(2840/(3.5*log('t')-log(e/100)-4.805))+55'
    'chie=0.2854*(1-0.28*r)'
    'thetae='t'*pow(100000/'p',chie)*exp((3.376/TL-0.00254)*r*1000*(1+0.81*r))'
    return 'thetae'
