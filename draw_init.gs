exp=''
infile=exp'inic.txt'
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
'set z 1 26'
'set t 1'
'T='zlike('th',T)
'Q='zlike('th',Q)
'P='zlike('th',pres)
'the=T*pow(100000/P,2/7)+2.5e6*Q/1004.67'
'Tc=T-273.15'
't2qs Tc P'
'thes=T*pow(100000/P,2/7)+2.5e6*qs/1004.67'

v1=330; v2=360
'ini'
'set grads off'
'set lev 0 16000'
'set vrange 'v1' 'v2
'set xlint 5'
'set cmark 0'
'set cthick 7'
'set ccolor 1'
'd the'
'draw xlab [K]'
'off'
'set cmark 0'
'set cthick 7'
'set ccolor 1'
'set cstyle 2'
'd thes'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/the_'exp'inic.png white'
