*grads -a 0.973484848484848485
_v1=0
_v2=36
_vint=4
rc=gsfallow('on')
_cases='GoAmazon_ctrl_16_t06 GoAmazon_L60_ctrl_16_t06 GoAmazon_L70_ctrl_16_t06'
_labels='L60 L70'
'color 2 2 1 -kind dark_jet'
_colors=range(16,17)
'q gxinfo'
line=sublin(result,2)
xpage=subwrd(line,4)-0.00001
ypage=subwrd(line,6)
'reinit'
'set mproj off'
'ini'
'set xlopts 1 3 0.18'
'set ylopts 1 3 0.18'
dx=10.15/3
xp1=0.9
xp2=xp1+dx-0.15
yp1=1
yp2=ypage-0.5
'set parea 'xp1' 'xp2' 'yp1' 'yp2

'open /data/W.eddie/VVM/DATA/GoAmazon_ctrl_16_t06/gs_ctl_files/surface.ctl'
'xygrid'
'flag=const(sprec,1)'
'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
radi=3/2/0.5
'flag=if(R>'radi',-1,flag)'
'set x 1'
'set y 1'
'set time 00Z 03Z'
'pa0=amean(maskout(sprec.1*3600,flag),x='64.5-radi',x='64.5+radi',y='64.5-radi',y='64.5+radi')'
'set grads off'
'set xlabs 0||1||2||3'
'set ccolor 1'
'set cmark 0'
'set cthick 7'
'set vrange '_v1' '_v2
'set ylint '_vint
'd pa0'
'draw xlab Time [h]'
'draw ylab Precip. Rate [mm h`a-1`n]'
'draw title VVM `00.99'
'off'
'close 1'
'open /data/W.eddie/VVM/DATA/GoAmazon_L60_ctrl_16_t06/gs_ctl_files/surface.ctl'
'xygrid'
'flag=const(sprec,1)'
'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
radi=3/2/0.1
'flag=if(R>'radi',-1,flag)'
'set x 1'
'set y 1'
'set time 00Z 03Z'
'pa1=amean(maskout(sprec.1*3600,flag),x='64.5-radi',x='64.5+radi',y='64.5-radi',y='64.5+radi')'
'open /data/W.eddie/VVM/DATA/GoAmazon_L70_ctrl_16_t06/gs_ctl_files/surface.ctl'
'pa2=amean(maskout(sprec.2*3600,flag),x='64.5-radi',x='64.5+radi',y='64.5-radi',y='64.5+radi')'

case_num=1
while(case_num<=2)
    'set grads off'
    'set xlabs 0||1||2||3'
    color=subwrd(_colors,case_num)
    'set ccolor 'color
    'set cmark 0'
    'set cthick 7'
    'set vrange '_v1' '_v2
    'set ylint '_vint
    'd pa'case_num
    case_num=case_num+1
endwhile

rc=legend('tr',3,'CTRL L60 L70','1 '_colors)

'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_L60_L70.png white'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_L60_L70.svg white'
