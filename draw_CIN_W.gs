files1='Init_CIN_each Init_CIN_lin58 Init_CIN_const'
files1='Init_CIN_lin58'
files2='W2CIN_each W2CIN_lin58 W2CIN_const'
files2='W2CIN_lin58'
exps='CTRL linear const'
exps='linear'
path='/data/W.eddie/GoAmazon_VVM/'
rc=gsfallow('on')
num=count_num(files1)
n=1
while(n<=num)
file1=subwrd(files1,n)
file2=subwrd(files2,n)
exp=subwrd(exps,n)
'reinit'
'ini -h'
'set parea 3 8 0.8 7.5'

'open 'path%file1'.ctl'
'open 'path%file2'.ctl'

'set lev 0 4'
'cin=if(max(cin.1,z=0,z+0)>1e-3,0,cin.1)'

'set grads off'
'set vrange -127.5 127.5'
'set xlevs -120 -90 -60 -30 0'
'set ylint 1'
'set cmark 3'
'set cthick 8'
'set ccolor 1'
'd cin'
*'draw xlab CIN [J kg`a-1`n]             '
'set string 1 bc 5'
'set strsiz 0.16 0.2'
'draw string 4.25 0.15 CIN [J kg`a-1`n]'
'draw ylab Height [km]'
'draw title 'exp
'off'

'set font 0'
'set xlab on'
'set grid on'
*'set xlpos 0 t'
'set xlopts 2'
'set vrange -17 17'
'set xlevs 0 4 8 12 16'
'set cmark 2'
'set cthick 8'
'set ccolor 2'
'd w.2'
'off'

'set string 2 bc 5'
'set strsiz 0.16 0.2'
*'draw string 6.75 8 W [m s`a-1`n]'
'draw string 6.75 0.15 W [m s`a-1`n]'

'set cmark 0'
'set cthick 5'
'set ccolor 15'
'd const(w.2,0,-a)'

'legend tl 2 `1CIN `0W 1 2 3 2'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/CIN_W_'exp'.png white'
*'gxprint /data/W.eddie/GoAmazon_VVM_Figs/CIN_W_'exp'.svg white'
'close 2'
'close 1'
n=n+1
endwhile
