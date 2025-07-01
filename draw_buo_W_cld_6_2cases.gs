*grads -a 1.6
case_VVM='ctrl_16'
tsels_VVM='2 9 15'
case_ACE='control13579'
tsels_ACE='3 9 64'
infile='inic_ctrl.txt'
path_VVM='/data/W.eddie/VVM/DATA/GoAmazon_'case_VVM'_t06/'
path_ACE='/data/W.eddie/GoAmazon_ACE/ACE-runs/'case_ACE'/'
rc=gsfallow('on')
'reinit'
'set xsize 1000 625'
'q gxinfo'
say result
line=sublin(result,2)
xpage=subwrd(line,4)-1e-7
ypage=subwrd(line,6)-1e-7
ypageM=ypage/2

'set mproj off'
'set display white'
'c'
'set font 1'
'set xlopts 1 2 0.2'
'set ylopts 1 2 0.2'

********** VVM ************
ypage1=ypage/2+0.2
dypage=ypage-ypage1
'open 'path_VVM'gs_ctl_files/thermodynamic.ctl'
'open 'path_VVM'gs_ctl_files/W.ctl'

'set x 56.5 72.5'
'set y 64'
'set z 2 13'
z0=qdims('levmin')/1000
z1=qdims('levmax')/1000
'set t 1 last'

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
'Tc1=th.1*pow(P/100000,287.04/1004.64)-273.15'
'cld1=qc.1+qi.1'
'thv1=th.1*(1+0.608*qv.1-cld1)'
'thv1env=amean(th.1*(1+0.608*qv.1-cld1),x=1,x=128,y=1,y=128)'
'buo1=(thv1-thv1env)/thv1env*9.80616'

nt=3
it=1
while(it<=nt)
    t=subwrd(tsels_VVM,it)
    xpage1=(it-1)*xpage/3
    xpage2=it*xpage/3
    if(it>1)
        xpage1=xpage1-0.2*(it-1)
        xpage2=xpage2-0.2*(it-1)
    endif
    say 'dx='dx
    'set vpage 'xpage1' 'xpage2' 'ypage1' 'ypage
    say 'set vpage 'xpage1' 'xpage2' 'ypage1' 'ypage
    xp1=0.8; xp2=7.5; yp1=0.7; yp2=ypage-0.5
    'set parea 'xp1' 'xp2' 'yp1' 'yp2
    say 'set parea 'xp1' 'xp2' 'yp1' 'yp2
    'on'
    'set grads off'
    'set t 't
    'set xaxis -4 4'
    'set yaxis 'z0' 'z1' 1'
    clevs='-0.05 -0.04 -0.03 -0.02 -0.01 -0.005 0.005 0.01 0.02 0.03 0.04 0.05'
    'color -levs 'clevs' -kind blue-(5)->white->orange->red'
    'd buo1'
    if(it=1);'draw ylab Height [km]';endif
    ttt=math_format('%03g',t-1)
    'draw title VVM 0.99           `0'ttt' min.'
    'off'
    'set ccolor 4'
    'set clab masked'
*    'color -levs 0.01 0.1 0.3 0.6 1 -kind lightgreen->green -gxout contour'
    'set gxout contour'
    'set clevs 0.01 0.1 0.3 0.6 1'
    'set ccolor 3'
    'set cthick 6'
    'd cld1*1e3'
    'set ccolor 1'
    'set clab masked'
    'set cthick 4'
    'set clevs -1 -0.8 -0.6 -0.4 -0.2 0.2 0.4 0.6 0.8 1'
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
    'xcbar3 1.8 'xpage-1.8' 'ypageM+0.05' 'ypageM+0.2' -fw 0.08 -fh 0.1 -ft 3 -levcol 'levcol' -unit B [m s`a-2`n]'
'close 2'
'close 1'
************ ACE **********
ypage2=ypageM-0.4
'open 'path_ACE'GoAmazon_idp314_kknw25cin_6aces-dynamic_means.16.ctl'
'open 'path_ACE'GoAmazon_idp314_kknw25cin_6aces-dynamic_means.16_zm.ctl'


nt=3
it=1
while(it<=nt)
    t=subwrd(tsels_ACE,it)
    xpage1=(it-1)*xpage/3
    xpage2=it*xpage/3
    if(it>1)
        xpage1=xpage1-0.2*(it-1)
        xpage2=xpage2-0.2*(it-1)
    endif
    say 'dx='dx
    'set vpage 'xpage1' 'xpage2' 0 'dypage
    say 'set vpage 'xpage1' 'xpage2' 0 'dypage
    xp1=0.8; xp2=7.5; yp1=0.7; yp2=ypage-0.5
    'set parea 'xp1' 'xp2' 'yp1' 'yp2
    say 'set parea 'xp1' 'xp2' 'yp1' 'yp2
    'on'
    'set grads off'
    'set t 't
    rc=make_sym('B','symB')
    rc=make_sym('qc*1e3','symqc')
    'set dfile 2'
    'set x 1'
    'set ylint 1'
    'rho=rho.2'
    'set x -3 5'
    'W=mf.2/rho'
    rc=make_sym('W','symW')
    'set dfile 1'
    'set lev 0.131528 6.06431'
    'set xaxis -4 4'
    'color -levs 'clevs' -kind blue-(5)->white->orange->red'
    'd symB'
    'draw xlab [km]'
    if(it=1);'draw ylab Height [km]';endif
    ttt=math_format('%03g',t-1)
    'draw title ACE 0.99           `0'ttt' min.'
    'off'
    'set ccolor 4'
    'set clab masked'
*    'color -levs 0.01 0.1 0.3 0.6 1 -kind lightgreen->green -gxout contour'
    'set gxout contour'
    'set clevs 0.01 0.1 0.3 0.6 1'
    'set ccolor 3'
    'set cthick 6'
    'd symqc'
    'set ccolor 1'
    'set clab masked'
    'set cthick 4'
    'set clevs -1 -0.8 -0.6 -0.4 -0.2 0.2 0.4 0.6 0.8 1'
    'd symW'
    it=it+1
endwhile
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/buo_W_cld_6.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/buo_W_cld_6.svg white'

function make_sym(var,new)
    'set x -3 5'
    'set z 1 62'
    ''new'=const('var',0,-u)'
    k=1
    while(k<=62)
        i=-3
        while(i<1)
            'set z 'k
            'set x 'i
            'lon0=lon'
            'lev0=lev'
            'set x '2-i
            'd 'var
            temp=subwrd(result,4)
            'set x -3 5'
            'set z 1 62'
            ''new'=const(maskout('new',(lon!=lon0)|(lev!=lev0)),'temp',-u)'
            i=i+1
        endwhile
    k=k+1
    endwhile

    return
