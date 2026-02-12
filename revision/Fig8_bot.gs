*grads -a 2
case.1='line58_14'
case.2='line58_16'
name.1='0.83'
name.2='0.99'
path.1='/data/W.eddie/VVM/DATA/GoAmazon_'case.1'_t06/'
path.2='/data/W.eddie/VVM/DATA/GoAmazon_'case.2'_t06/'
rc=gsfallow('on')
'reinit'
'ini'

i=1
while(i<=2)
'open 'path.i'gs_ctl_files/thermodynamic.ctl'
'open 'path.i'gs_ctl_files/W.ctl'
'mul 2 1 -n 'i' -xini 0.8 -xwid 4.8 -xint 0.2 -yoffset 0.33'

'set x 50.5 78.5'
'set y 64'
'set lev 500'
'set time 00z 01z'
rc=qdims('levmin')
km=math_format('',rc/1000)

dy=5.6
ylw=0.4
xpage2=ylw
'set grads off'
'cld1=qc.1+qi.1'
'thv1=th.1*(1+0.608*qv.1-cld1)'
'thv1env=amean(th.1*(1+0.608*qv.1-cld1),x=1,x=128,y=1,y=128)'
'buo1=(thv1-thv1env)/thv1env*9.80616'
'set xaxis -7 7 2'
if(i=1)
'set tlsupp month'
'set ylabs 00:00|00:15|00:30|00:45|01:00'
else
'set ylabs ||||'
endif
clevs='-0.05 -0.04 -0.03 -0.02 -0.01 -0.005 0.005 0.01 0.02 0.03 0.04 0.05'
'color -levs 'clevs' -kind blue-(5)->white->orange->red'
'd buo1'
'draw xlab [km]'
'q gxinfo'
xinfo=sublin(result,3)
yinfo=sublin(result,4)
x1=subwrd(xinfo,4)
y2=subwrd(yinfo,6)
xstr=x1+0.22
ystr=y2-0.4
*'set string 1 tl 1'
'set strsiz 0.17 0.2'
'draw string 'xstr' 'ystr' 'name.i
'draw string 'xstr' 'ystr-0.3' z=500m'

'close 2'
'close 1'
i=i+1
endwhile
'xcbar3 1 10 0.25 0.45 -unit B [m s`0`a-2`n`1]'
'gxprint Fig8_bot.png white'
'gxprint Fig8_bot.svg white'
