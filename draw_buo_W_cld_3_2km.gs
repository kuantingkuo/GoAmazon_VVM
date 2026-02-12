case='line58_16'
tsels='13 14 15'
infile='inic_lin58.txt'
path='/data/W.eddie/VVM/DATA/'
rc=gsfallow('on')
'reinit'
'set display white'
'set xlopts 1 3 0.16'
'set ylopts 1 3 0.16'
'set font 1'
'set xsize 1000 360'
'open 'path'GoAmazon_'case'_t06/gs_ctl_files/thermodynamic.ctl'
'open 'path'GoAmazon_'case'_t06/gs_ctl_files/W.ctl'
'set x 56.5 72.5'
'set y 64'
'set z 2 14'
z0=qdims('levmin')/1000
*z1=qdims('levmax')/1000
z1=2

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

clevs='-0.05 -0.04 -0.03 -0.02 -0.01 -0.005 0.005 0.01 0.02 0.03 0.04 0.05'
cnum=count_num(clevs)
ccols=range(17,16+cnum)
levcol='16'
i=1
while(i<cnum)
    levcol=levcol' '%subwrd(clevs,i)%' '%subwrd(ccols,i)
    i=i+1
endwhile
nt=count_num(tsels)
ylabsize=0.4
'q gxinfo'
temp=sublin(result,2)
xv0=subwrd(temp,4)
yv0=subwrd(temp,6)
xv1=xv0-ylabsize
dxv=xv1/nt
'c'
it=1
while(it<=nt)
t=subwrd(tsels,it)
if(it=1)
    'set vpage 0 '%dxv+ylabsize%' 0 'yv0
    'set parea '0.3+ylabsize' 'xv-0.1' 1.1 'yv-0.5
else
    'set vpage '%%' '%dxv*it+ylabsize%' 0 'yv0
    'set parea 0.3 'xv-0.1' 1.1 'yv-0.5
endif
'q gxinfo'
temp=sublin(result,2)
xv=subwrd(temp,4)
yv=subwrd(temp,6)
'on'
'set grads off'
'set t 't
'set lev 'z0*1000' 'z1*1000
'cld1=qc.1+qi.1+qr.1'
'thv1=th.1*(1+0.608*qv.1-cld1)'
'thv1env=amean(th.1*(1+0.608*qv.1-cld1),x=1,x=128,y=1,y=128)'
'buo1=(thv1-thv1env)/thv1env*9.80616'
'set xaxis -4 4'
'set yaxis 'z0' 'z1' 1'
'color -levs 'clevs' -kind blue-(5)->white->orange->red'
'd buo1'
if it=1
'draw ylab Height [km]'
endif
'draw xlab [km]'
ttt=math_format('%02g',t-1)
'draw title 'ttt' min.'
'off'
'set ccolor 4'
'set clab masked'
*'color -levs 0.01 0.1 0.3 0.6 1 -kind lightgreen->green -gxout contour'

'set gxout contour'
'set clevs 0.01 0.1 0.3 0.6 1'
'set ccolor 3'
'set cthick 8'
'd cld1*1e3'
'set ccolor 1'
'set clab masked'
'set cthick 4'
'set clevs -1 -0.8 -0.6 -0.4 -0.2 0.2 0.4 0.6 0.8 1'
'd w.2'
it=it+1
endwhile
'set vpage off'
'xcbar3 0.5 9.8 0.2 0.4 -levcol 'levcol' -unit [m s`a-2`n]'
exit
'gxprint /data/W.eddie/GoAmazon_VVM_temp/buo_W_cld_3_'case'_2km.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_temp/buo_W_cld_3_'case'_2km.svg white'
