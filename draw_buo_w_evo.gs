cases='line58_14 line58_16'
infile='inic_lin58.txt'
rc=gsfallow('on')
'reinit'
'ini -l'
i=1
while(i<=2)
'mul 2 1 -n 'i
'on'
case=subwrd(cases,i)
path='/data/W.eddie/VVM/DATA/GoAmazon_'case'_t06/'
'open 'path'gs_ctl_files/thermodynamic.ctl'
'open 'path'gs_ctl_files/W.ctl'
'open 'path'gs_ctl_files/dwdz.ctl'
'set x 64'
'set y 64'
'set z 2 12'
z0=qdims('levmin')/1000
z1=qdims('levmax')/1000
t1=1; t2=21
'set t 't1' 't2

rc=read(infile)
pres=''
k=1
while(k<=14)
    rc=read(infile)
    line=sublin(rc,2)
    pres=pres' 'subwrd(line,2)
    k=k+1
endwhile
'P='zlike('th',pres)
'thv1=amean(th.1*(1+0.608*qv.1-qc.1-qi.1-qr.1),x=64,x=65,y=64,y=65)'
'thv1env=amean(th.1*(1+0.608*qv.1-qc.1-qi.1-qr.1),x=45,x=84,y=45,y=84)'
'buo1=(thv1-thv1env)/thv1env*9.80616'
'cld=amean(qc.1+qi.1,x=64,x=65,y=64,y=65)'
'wdwdz=amean(wdwdz.3,x=64,x=65,y=64,y=65)'

'set grads off'
'set tlsupp month'
'set yaxis 'z0' 'z1
'set ylint 1'
'set xaxis '%t1-1%' '%t2-1
clevs='-0.005 -0.004 -0.003 -0.002 -0.001 -0.0005 0.0005 0.001 0.002 0.003 0.004 0.005'
*clevs='-0.05 -0.04 -0.03 -0.02 -0.01 -0.005 0.005 0.01 0.02 0.03 0.04 0.05'
'color -levs 'clevs' -kind blue-(5)->white->orange->red'
'd buo1'
*'ta=th-th(t=1)'
*'color -0.5 0.5'
*'d ta'
if(i=2);'cbar3';endif
'off'
'set gxout contour'
'set clevs -2 -1.6 -1.2 -0.8 -0.4 0 0.4 0.8 1.2 1.6 2'
'set ccolor 1'
'd w.2'
'set clevs -5 -4 -3 -2 -1 1 2 3 4 5'
'set ccolor 0'
'd wdwdz*1e3'
'set clevs 0.01 0.1 0.3 0.6 1'
'set ccolor 3'
'd cld*1e3'
'close 3'
'close 2'
'close 1'
i=i+1
endwhile
