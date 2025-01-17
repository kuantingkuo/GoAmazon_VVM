exps='const linear CTRL'
infiles='inic_const.txt inic_lin58.txt inic.txt'
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
    'Tc=T-273.15'
    'tpq2rh Tc P Q'

    v1=55; v2=109
    'set grads off'
    'set lev 0 4'
    'set vrange 'v1' 'v2
    'set xlint 10'
    'set ylint 1'
    'set cmark 0'
    'set cthick 9'
    'set ccolor 'col
    'd rh'
    if(n=1)
        'draw xlab [%]'
        'draw ylab Height [km]'
        'draw title Relative Humidity'
        'off'
    endif
    n=n+1
endwhile
revexp=subwrd(exps,num)
i=num-1
while(i>=1)
    revexp=revexp' 'subwrd(exps,i)
    i=i-1
endwhile
'set font 5'
'legend tr 3 'revexp' 1 60 50'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/RH_inic_low.png white'
