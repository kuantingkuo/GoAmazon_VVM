exps='RH-reduced CTRL'
infiles='inic_lin58.txt inic.txt'
colors='60 1'
'set rgb 50 134 97 42'
'set rgb 60 0 125 0'
rc=gsfallow('on')
num=count_num(infiles)
'reinit'
'ini'
'open thermodynamic.ctl'
'open parcel_entrain0.001.ctl'
'set x 1'
'set y 1'
'set z 2 11.3135'
'set t 1'
'set dfile 2'
'the='thetae('T.2','pres.2','Q.2')
'c'
'set grads off'
v1=333; v2=357
'set vrange 'v1' 'v2
'set xlint 5'
'set ylint 1'
'set ccolor 2'
'd the'
'draw xlab [K]'
'draw ylab Height [km]'
'off'
'set dfile 1'
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
    'set z 2 12'
    'set t 1'
    'T='zlike('th',T)
    'Q='zlike('th',Q)
    'P='zlike('th',pres)
    'the='thetae('T','P','Q')
    'Tc=T-273.15'
    't2qs Tc P'
    'thes='thetae('T','P','qs')

    'set grads off'
*    'set lev 0 4'
    'set z 2 11.3135'
    'set vrange 'v1' 'v2
    'set xlint 5'
    'set ylint 1'
    'set cmark 0'
    'set cthick 9'
    'set ccolor 'col
    'd the'
    'set cmark 0'
    'set cthick '17-5*n
    'set ccolor 'col
    'set cstyle 2'
    'd thes'
    n=n+1
endwhile
revexp=subwrd(exps,num)
revcol=subwrd(colors,num)
i=num-1
while(i>=1)
    revexp=revexp' 'subwrd(exps,i)
    revcol=revcol' 'subwrd(colors,i)
    i=i-1
endwhile
'set font 5'
'legend r 'num' 'revexp' 'revcol
'legend tr 1 ent_plume 2 2'
'gxprint the_inic_low.png white'
'gxprint the_inic_low.svg white'

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
