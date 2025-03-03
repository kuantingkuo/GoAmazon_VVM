exp_tag='line58'
num1=7
num2=8
pattern='GoAmazon_'exp_tag'_??_t06'
exps='0.06_0.12 0.16_0.32 0.29_0.51 0.36_0.77 0.51_1.03 0.66_1.31 0.83_1.64 0.99_1.97 1.17_2.35 1.35_2.77 1.55_3.22 1.76_3.70'
path='/data/W.eddie/VVM/DATA/'
cases=sys('ls -d 'path%pattern'|awk -F/ ''{print $NF}''')
case1=subwrd(cases,num1)
case2=subwrd(cases,num2)
rc=gsfallow('on')
num=count_num(cases)
radi=4
x.1=64.5-radi
x.4=64.5+radi
y.1=x.1
y.4=x.4
'reinit'
'set mproj off'
'ini -l'
'open /data/W.eddie/VVM/DATA/'case1'/gs_ctl_files/thermodynamic.ctl'
'open /data/W.eddie/VVM/DATA/'case2'/gs_ctl_files/thermodynamic.ctl'
'xygrid'
'flag=const(th,1)'
'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
'flag=if(R>'radi',-1,flag)'

'set t 1 61'
'set lev 0 4000'
'set y 64'
'set x 64'
'th1=amean(maskout(th.1,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
'th2=amean(maskout(th.2,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
'cld1=amean(maskout(qc.1+qi.1,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
'cld2=amean(maskout(qc.2+qi.2,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
'tvc=amean(maskout(th.1*(1+0.608*qv.1-qc.1-qi.1),flag),x='x.1',x='x.4',y='y.1',y='y.4')'
'tve=amean(maskout(th.1*(1+0.608*qv.1-qc.1-qi.1),-flag),x='x.1-2*radi',x='x.4+2*radi',y='y.1-2*radi',y='y.4+2*radi')'
'buo1=9.80616*(tvc-tve)/tve'
'tvc=amean(maskout(th.2*(1+0.608*qv.2-qc.2-qi.2),flag),x='x.1',x='x.4',y='y.1',y='y.4')'
'tve=amean(maskout(th.2*(1+0.608*qv.2-qc.2-qi.2),-flag),x='x.1-2*radi',x='x.4+2*radi',y='y.1-2*radi',y='y.4+2*radi')'
'buo2=9.80616*(tvc-tve)/tve'
'color -3e-3 3e-3 2e-3 -gxout grfill'
'd buo2-buo1'
'cbar3'
'set gxout contour'
'd cld2-cld1'
exit
infile='inic_lin58.txt'
rc=read(infile)
pres=''
T=''
Q=''
k=1
while(k<=11)
    rc=read(infile)
    line=sublin(rc,2)
    pres=pres' 'subwrd(line,2)
    T=T' 'subwrd(line,3)
    k=k+1
endwhile
'set x 1'
'set y 1'
'set z 2 12'
'set t 1'
'T='zlike('th',T)
'P='zlike('th',pres)
'rdcp=log(th/T)/log(100000/P)'
