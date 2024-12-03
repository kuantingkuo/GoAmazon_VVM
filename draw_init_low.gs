exps='dry const CTRL'
infiles='test_dry2_inic.txt inic_const.txt inic.txt'
colors='50 60 1'
'set rgb 50 134 97 42'
'set rgb 60 0 125 0'
rc=gsfallow('on')
num=count_num(infiles)
'reinit'
'ini'
'open thermodynamic.ctl'
n=1
while(n<=num)
    exp=subwrd(exps,n)
    infile=subwrd(infiles,n)
    col=subwrd(colors,n)

    rc=read(infile)
    pres=''
    T=''
    Q=''
    k=1
    while(k<=12)
        rc=read(infile)
        line=sublin(rc,2)
        pres=pres' 'subwrd(line,2)
        T=T' 'subwrd(line,3)
        Q=Q' 'subwrd(line,4)
        k=k+1
    endwhile
    'set x 1'
    'set y 1'
    'set z 1 12'
    'set t 1'
    'T='zlike('th',T)
    'Q='zlike('th',Q)
    'P='zlike('th',pres)
*    'the=T*pow(100000/P,2/7)+2.5e6*Q/1004.67'
    'the='thetae('T','P','Q')
    'Tc=T-273.15'
    't2qs Tc P'
    'thes='thetae('T','P','qs')

    v1=335; v2=365
    'set grads off'
    'set lev 0 4'
    'set vrange 'v1' 'v2
    'set xlint 5'
    'set ylint 1'
    'set cmark 0'
    'set cthick 9'
    'set ccolor 'col
    'd the'
    if(n=1)
        'draw xlab [K]'
        'draw ylab Height [km]'
        'draw title Initial Profile'
        'off'
    endif
    'set cmark 0'
    'set cthick '17-5*n
    'set ccolor 'col
    'set cstyle 2'
    'd thes'
    n=n+1
endwhile
'set font 5'
'legend r 3 CTRL dry const 1 50 60'
*'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_'exp'inic_low.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_'exp'_inic_low.png white'

function thetae(t,p,q)
    'r='q'/(1-'q')'
    'e='p'*r/(0.622+r)'
    'TL=(2840/(3.5*log('t')-log(e/100)-4.805))+55'
    'chie=0.2854*(1-0.28*r)'
    'thetae='t'*pow(100000/'p',chie)*exp((3.376/TL-0.00254)*r*1000*(1+0.81*r))'
    return 'thetae'
