pattern='GoAmazon_20141122T0530_circle_WL?_??'
path='/data/W.eddie/VVM/DATA/'
cases=sys('ls -d 'path%pattern'|awk -F/ ''{print $NF}''')
exp_tag='Circle_const'
exps='L2_0.1 L2_0.8 L2_1.5 L2_2.2 L6_0.1 L6_0.8 L6_1.5 L6_2.2'
x1=99;x2=156
rc=gsfallow('on')
num=count_num(cases)
n=1
while(n<=num)

'reinit'
'set mproj off'
'ini'
case=subwrd(cases,n)
exp=subwrd(exps,n)
'open 'path%case'/gs_ctl_files/thermodynamic.ctl'
'open 'path%case'/gs_ctl_files/dynamic.ctl'
'set x 'x1' 'x2
'set y 128'
'set lev 0 6000'

t=1
while(t<=121)
'set t 't
'cld=mean(qc+qi,y=124,y=131)*1e3'
'rain=mean(qr,y=124,y=131)*1e3'
'wa=mean(w.2,y=124,y=131)'

'c'
'on'
'set grads off'
'set parea 1.45 7.95 1 7.75'
'set xaxis 'x1/2' 'x2/2
'set yaxis 0 6 1'
'color 0 2 2e-1 -kind precip'
levcol=getlevcol(0,2,2e-1)
'd rain'
'date %H:%M'
time=subwrd(result,1)
'draw title 'time
'draw xlab [km]'
'draw ylab Height [km]'
'xcbar3 -dir v -levcol 'levcol' -c Rain Water [g kg`a-1`n]'
'off'
*'color 0 1 1e-1 -kind (255,255,255,50)->(0,0,0,50)'
*levcol=getlevcol(0,1,1e-1)
'color 0 1 1e-1 -kind black->black -gxout contour'
'set clab masked'
'set cthick 3'
'd cld'
*'xcbar3 -xo 1.3 -dir v -levcol 'levcol' -c Cloud Water [g kg`a-1`n]'
'color -levs -7 -5 -3 -2 -1 -0.5 -0.1 0.1 0.5 1 2 3 5 7 -kind red->red -gxout contour'
'set clab masked'
'set cthick 3'
'd wa'
ttt=math_format('%03g',t)
'gxprint /data/W.eddie/GoAmazon_VVM_temp/W-cld_'exp_tag'_'exp'_'ttt'.png'
t=t+1
endwhile
n=n+1
endwhile

function getlevcol(l0,l1,inc)
    labs=range(l0,l1,inc)
    ncol=count_num(labs)
    cols=range(16,16+ncol)
    i=1
    levcol=''
    while(i<=ncol)
        levcol=levcol' 'subwrd(cols,i)' 'subwrd(labs,i)
        i=i+1
    endwhile
    levcol=levcol' 'subwrd(cols,i)
    return levcol
