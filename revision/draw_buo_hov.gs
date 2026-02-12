case_VVM='line58_18'
path_VVM='/data/W.eddie/VVM/DATA/GoAmazon_'case_VVM'_t06/'
rc=gsfallow('on')
'reinit'
'ini'

'open 'path_VVM'gs_ctl_files/thermodynamic.ctl'
'open 'path_VVM'gs_ctl_files/W.ctl'

'set x 50.5 78.5'
'set y 64'
k=2
while(k<=9)
'set z 'k
rc=qdims('levmin')
km=math_format('%4.2f',rc/1000)

'set time 00z 01z'
'c'
    'set grads off'
    'cld1=qc.1+qi.1'
    'thv1=th.1*(1+0.608*qv.1-cld1)'
    'thv1env=amean(th.1*(1+0.608*qv.1-cld1),x=1,x=128,y=1,y=128)'
    'buo1=(thv1-thv1env)/thv1env*9.80616'
    'set xaxis -7 7'
    'set tlsupp month'
    clevs='-0.05 -0.04 -0.03 -0.02 -0.01 -0.005 0.005 0.01 0.02 0.03 0.04 0.05'
    'color -levs 'clevs' -kind blue-(5)->white->orange->red'
    'd buo1'
    'cbar3'
*    'off'
*    'set ccolor 4'
*    'set clab masked'
*    'set gxout contour'
*    'set clevs 1e-2 1e-1 1 2 3 4'
*    'set ccolor 99'
*    'set cthick 4'
*    'd cld1*1e3'
*    'set ccolor 1'
*    'set clab masked'
*    'set cthick 2'
*    'set clevs -4 -1 -0.25 0.25 1 4 16'
*    'd w.2'
'gxprint buo_hov_'case_VVM'_'km'km.png white'
k=k+1
endwhile
