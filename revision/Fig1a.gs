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
'ini'
'open thermodynamic.ctl'
'open parcel_entrain0.001.ctl'
'set x 1'
'set y 1'
'set z 2 21.0889'
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
'd maskout(the,lev<4)'
'draw xlab [K]'
'draw ylab Height [km]'
'off'
'set dfile 1'
'T='zlike('th',T)
'Q='zlike('th',Q)
'P='zlike('th',pres)
'the='thetae('T','P','Q')
'Tc=T-273.15'
't2qs Tc P'
'thes='thetae('T','P','qs')

'set z 2 21.0889'
'set vrange 'v1' 'v2
'set xlint 5'
'set cmark 0'
'set cthick 7'
'set ccolor 1'
'd the'
'set cmark 0'
'set cthick 7'
'set ccolor 1'
'set cstyle 2'
'd thes'
'legend r 2 `3z`2`be`n `3z`2`bes`n 1 1 0 0 1 2'
'legend tl 1 ent_plume 2 2'
'gxprint the_'exp'_inic.png white'
'gxprint the_'exp'_inic.svg white'

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
