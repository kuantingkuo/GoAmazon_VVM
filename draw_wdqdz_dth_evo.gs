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
'open 'path'gs_ctl_files/wdqdz.ctl'
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
'ta=amean(th.1-th.1(t=1),x=64,x=65,y=64,y=65)'
'set dfile 3'
'wdqdz=amean(wdqdz.3,x=64,x=65,y=64,y=65)'

'set dfile 1'
'set grads off'
'set tlsupp month'
'set yaxis 'z0' 'z1
'set ylint 1'
'set xaxis '%t1-1%' '%t2-1
clevs='-1 -0.8 -0.6 -0.4 -0.2 0 0.2 0.4 0.6 0.8 1'
'color -levs 'clevs' -kind blue-(5)->white->red'
'd ta'
if(i=1)
    'draw title (a)              0.83'
    'draw xlab Time [minutes]'
    'draw ylab Height [km]'
endif
if(i=2)
    'draw title (b)              0.99'
    'cbar3 [K]'
endif
'off'
'set gxout contour'
'set clevs -7 -6 -5 -4 -3 -2 -1 0 1 2 3 4 5 6 7'
'set ccolor 1'
'd wdqdz*1e6'
'set clevs 0.01 0.1 0.3 0.6 1'
'set ccolor 3'
'd cld*1e3'
'close 3'
'close 2'
'close 1'
i=i+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/wdqdz_dth_evo.png white'

