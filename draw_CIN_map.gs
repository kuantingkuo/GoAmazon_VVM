cases='GoAmazon_20141122T0530_WL2_01  GoAmazon_20141122T0530_WL2_08  GoAmazon_20141122T0530_WL2_15  GoAmazon_20141122T0530_WL2_22 GoAmazon_20141122T0530_WL6_01  GoAmazon_20141122T0530_WL6_08  GoAmazon_20141122T0530_WL6_15  GoAmazon_20141122T0530_WL6_22'
rc=gsfallow('on')
num=count_num(cases)
'reinit'
'set mproj off'
'ini -s'

n=1
while(n<=num)
case=subwrd(cases,n)
'sdfopen /data/W.eddie/GoAmazon_VVM_temp/'case'_CIN.nc'
'set x 99 156'
'set y 99 156'

t=1
while(t<=181)
'set t 't
ttt=math_format('%03g',t)
'date %H:%M'
time=subwrd(result,1)
'c'
'set grads off'
'color -300 -0 30 -kind jet'
'set xlint 10'
'set ylint 10'
'd CIN'
'draw title CIN  `0'time
'cbar3 [J kg`a-1`n]'
'gxprint /data/W.eddie/GoAmazon_VVM_temp/'case'_CIN_'ttt'.png white'
t=t+1
endwhile
'close 1'
n=n+1
endwhile
