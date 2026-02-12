*grads -a 1.5
case_1='line58_14'
tsels_1='13 14 15'
case_2='line58_16'
tsels_2='13 14 15'
infile='inic_lin58.txt'
path_1='/data/W.eddie/VVM/DATA/GoAmazon_'case_1'_t06/'
path_2='/data/W.eddie/VVM/DATA/GoAmazon_'case_2'_t06/'
rc=gsfallow('on')
'set rgb 99 30 180 30'
'set ccolor 99'
'reinit'
'q gxinfo'
line=sublin(result,2)
xpage=subwrd(line,4)-1e-7
ypage=subwrd(line,6)-1e-7
ypageM=ypage/2

'set mproj off'
'set display white'
'c'
'set font 1'
'set xlopts 1 2 0.3'
'set ylopts 1 2 0.3'

********** VVM ************
ypage1=ypage/2+0.2
dypage=ypage-ypage1
'open 'path_1'gs_ctl_files/thermodynamic.ctl'
'open 'path_1'gs_ctl_files/W.ctl'

'set x 56.5 72.5'
'set y 64'
'set z 2 13'
z0=qdims('levmin')/1000
z1=qdims('levmax')/1000

nt=3
it=1
tags='(a) (b) (c) (d) (e) (f)'
tagi=1
dy=5.6
ylw=0.4
xpage2=ylw
while(it<=nt)
    t=subwrd(tsels_1,it)
    tag=subwrd(tags,tagi)
    tagi=tagi+1
    dxpage=(xpage+(nt-1)*ylw)/nt
    say dxpage
    xpage1=xpage2-ylw
    xpage2=xpage1+dxpage
    'set vpage 'xpage1' 'xpage2' 'ypage1' 'ypage
    say 'set vpage 'xpage1' 'xpage2' 'ypage1' 'ypage
    'q gxinfo'
    say result
    xp1=1.2; xp2=8; yp1=0.7; yp2=yp1+dy
    'set parea 'xp1' 'xp2' 'yp1' 'yp2
    say 'set parea 'xp1' 'xp2' 'yp1' 'yp2
    'on'
    'set grads off'
    'set t 't
    'cld1=qc.1+qi.1'
    'thv1=th.1*(1+0.608*qv.1-cld1)'
    'thv1env=amean(th.1*(1+0.608*qv.1-cld1),x=1,x=128,y=1,y=128)'
    'buo1=(thv1-thv1env)/thv1env*9.80616'
    'set xaxis -4 4'
    'set yaxis 'z0' 'z1' 1'
    clevs='-0.02 -0.016 -0.012 -0.008 -0.004 -0.002 0.002 0.004 0.008 0.012 0.016 0.02'
    'color -levs 'clevs' -kind blue-(5)->white->orange->red'
    'd buo1'
*ylab
    if(it=1)
        'set string 1 bc 4 90'
        'set strsiz 0.24 0.3'
        'draw string 'xp1-0.7' '%(yp1+yp2)/2%' Height [km]'
    endif
    ttt=math_format('%03g',t-1)
*title
    'set string 1 bl 5 0'
    'set strsiz 0.28 0.35'
    'draw string 'xp1' '%yp2+0.2%' 'tag' VVM 0.83     `0'ttt' min.'
    'off'
    'set ccolor 4'
    'set clab masked'
    'set gxout contour'
    'set clevs 1e-2 1e-1 1 2 3 4'
    'set ccolor 99'
    'set cthick 4'
    'd cld1*1e3'
    'set ccolor 1'
    'set clab masked'
    'set cthick 2'
    'set clevs -4 -1 -0.25 0.25 1 4 16'
    'd w.2'
    it=it+1
endwhile
    'set vpage off'
    cnum=count_num(clevs)
    cols=range(17,16+cnum)
    levcol='16'
    i=1
    while(i<=cnum)
        levcol=levcol' '%subwrd(clevs,i)%' '%subwrd(cols,i)
        i=i+1
    endwhile
    'xcbar3 1 'xpage-1' 'ypageM+0.05' 'ypageM+0.2' -fw 0.11 -fh 0.132 -ft 3 -levcol 'levcol' -unit B [m s`a-2`n]'
'close 2'
'close 1'
************ Case 2 **********
ypage1=0
ypage2=dypage
'open 'path_2'gs_ctl_files/thermodynamic.ctl'
'open 'path_2'gs_ctl_files/W.ctl'

'set x 56.5 72.5'
'set y 64'
'set z 2 13'
z0=qdims('levmin')/1000
z1=qdims('levmax')/1000

nt=3
it=1
xpage2=ylw
while(it<=nt)
    t=subwrd(tsels_2,it)
    tag=subwrd(tags,tagi)
    tagi=tagi+1
    dxpage=(xpage+(nt-1)*ylw)/nt
    say dxpage
    xpage1=xpage2-ylw
    xpage2=xpage1+dxpage
    'set vpage 'xpage1' 'xpage2' 'ypage1' 'ypage2
    say 'set vpage 'xpage1' 'xpage2' 'ypage1' 'ypage2
    'q gxinfo'
    say result
    xp1=1.2; xp2=8; yp1=1; yp2=yp1+dy
    'set parea 'xp1' 'xp2' 'yp1' 'yp2
    say 'set parea 'xp1' 'xp2' 'yp1' 'yp2
    'on'
    'set grads off'
    'set t 't
    'cld1=qc.1+qi.1'
    'thv1=th.1*(1+0.608*qv.1-cld1)'
    'thv1env=amean(th.1*(1+0.608*qv.1-cld1),x=1,x=128,y=1,y=128)'
    'buo1=(thv1-thv1env)/thv1env*9.80616'
    'set xaxis -4 4'
    'set yaxis 'z0' 'z1' 1'
    'color -levs 'clevs' -kind blue-(5)->white->orange->red'
    'd buo1'
*xlab
    'set string 1 bc 4 0'
    'set strsiz 0.24 0.3'
    'draw string '%(xp1+xp2)/2%' 0.12 [km]'
*ylab
    if(it=1)
        'set string 1 bc 4 90'
        'set strsiz 0.24 0.3'
        'draw string 'xp1-0.7' '%(yp1+yp2)/2%' Height [km]'
    endif
    ttt=math_format('%03g',t-1)
*title
    'set string 1 bl 5 0'
    'set strsiz 0.28 0.35'
    'draw string 'xp1' '%yp2+0.2%' 'tag' VVM 0.99     `0'ttt' min.'
    'off'
    'set ccolor 4'
    'set clab masked'
    'set gxout contour'
    'set clevs 1e-2 1e-1 1 2 3 4'
    'set ccolor 99'
    'set cthick 4'
    'd cld1*1e3'
    'set ccolor 1'
    'set clab masked'
    'set cthick 2'
    'set clevs -4 -1 -0.25 0.25 1 4 16'
    'd w.2'
    it=it+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Fig9.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/Fig9.svg white'
