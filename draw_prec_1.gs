path='/data/W.eddie/VVM/DATA/'
case='GoAmazon_ctrl_restart_24'
rc=gsfallow('on')
radi=4
x.1=64.5-radi
x.4=64.5+radi
y.1=x.1
y.4=x.4

v1=0
v2=27
'reinit'
'set mproj off'
'ini -l'
    path='/data/W.eddie/VVM/DATA/'case'/gs_ctl_files/'
    'open 'path'surface.ctl'
    'xygrid'
    'flag=const(sprec,1)'
    'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
    'flag=if(R>'radi',-1,flag)'
    'set x 1'
    'set y 1'
    'set time 00Z 03Z'
    'pa=amean(maskout(sprec*3600,flag),x='x.1',x='x.4',y='y.1',y='y.4')'
    'set grads off'
    'set xlabs 00:00|00:30|01:00|01:30|02:00|02:30|03:00'
    'set cmark 0'
    'set cthick 7'
    'set vrange 0 'v2
    'd pa'
        'draw xlab Time'
        'draw ylab Precipitation Rate [mm h`a-1`n]'
        'off'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/prec_1_'case'.png white'
