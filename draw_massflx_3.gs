*grads -a 2.5
_tags='ctrl control13579 ctrl_mimic'
_exp_cap='CTRL'
_sels='1 3 5 6 7 8 9 10 11 12'
_exps='0.06 0.16 0.29 0.36 0.51 0.66 0.83 0.99 1.17 1.35 1.55 1.76'
_v1=-3
_v2=10
_hgt=5
rc=gsfallow('on')
_num=count_num(_sels)
say _num
'color 2 '_num' 1 -kind dark_jet'
_colors=range(16,_num+16-1)
'set xsize 1000 400'
'q gxinfo'
line=sublin(result,2)
xpage=subwrd(line,4)-0.00001
ypage=subwrd(line,6)
'reinit'
'set mproj off'
'ini'
'set xlopts 1 3 0.18'
'set ylopts 1 3 0.18'
e=1
while(e<=3)
    dx=9.9/3
    xp1=1.1+(e-1)*dx
    xp2=xp1+dx-0.15
    yp1=1
    yp2=ypage-0.5
    'set parea 'xp1' 'xp2' 'yp1' 'yp2
    if e=1
    rc=draw_VVM()
    endif
    'on'
    if e=2
    rc=draw_ACE()
    endif
    'on'
    if e=3
    rc=draw_SAM()
    endif
    e=e+1
endwhile

y0=0.2
'set strsiz 0.15 0.18'
len=0.67-0.15
'set string 1 l'
len_tot=len*_num
lin_wid=(xpage-len_tot)/_num-0.05
colors=range(16,16+_num-1)
i=1
while(i<=_num)
    j=subwrd(_sels,i)
    exp=subwrd(_exps,j)
    x0=(i-1)*(len+lin_wid+0.05)
    'draw string 'x0' 'y0' 'exp
    color=subwrd(colors,i)
    'set line 'color' 1 7'
    'draw line 'x0+len' 'y0' 'x0+len+lin_wid' 'y0
    i=i+1
endwhile

'gxprint /data/W.eddie/GoAmazon_VVM_Figs/massflx_3_'_hgt'.png white x1000 y400'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/massflx_3_'_hgt'.svg white'

function draw_VVM()
tag=subwrd(_tags,1)
pattern='/data/W.eddie/VVM/DATA/GoAmazon_'tag'_??_t06/gs_ctl_files/W.ctl'
ctls=sys('ls 'pattern)
rho='1.158 1.147 1.126 1.104 1.080 1.055 1.030 1.001 0.956 0.890 0.810 0.723 0.637 0.558 0.487 0.428 0.378 0.334 0.297 0.263 0.232 0.202 0.175 0.145 0.111 0.075'
radi=4
x.1=64.5-radi
x.4=64.5+radi
y.1=x.1
y.4=x.4

i=1
while(i<=_num)
    j=subwrd(_sels,i)
    ctl=subwrd(ctls,j)
    'open 'ctl
    'xygrid'
    'flag=const(w,1)'
    'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
    'flag=if(R>'radi',-1,flag)'
    'set x 1'
    'set y 1'
    'set z 1 26'
    'rho='zlike('w',rho)
    'set lev '_hgt*1000
    'set time 00Z 03Z'
    'mfa=rho*amean(maskout(w,flag),x='x.1',x='x.4',y='y.1',y='y.4')'

    'set grads off'
    'set xlabs 0||1||2||3'
    color=subwrd(_colors,i)
    'set ccolor 'color
    'set cmark 0'
    'set cthick 7'
    'set vrange '_v1' '_v2
    'set ylint 2'
    'd mfa'
    if i=1 
        'draw xlab Time [h]'
        'draw ylab Mass Flux [kg m`a-2`n s`a-1`n]'
        'draw title VVM '_exp_cap
        'off'
    endif
    'off'
    'close 1'
    i=i+1
endwhile
return

function draw_ACE()
tag=subwrd(_tags,2)
pattern='/data/W.eddie/GoAmazon_ACE/ACE-runs/'tag'/GoAmazon_idp314_kknw25cin_6aces-dynamic_means.??.ctl'
ctls=sys('ls 'pattern)

i=1
while(i<=_num)
    j=subwrd(_sels,i)
    ctl=subwrd(ctls,j)
    'open 'ctl
    'set x 1'
    'set lev '_hgt
    'set time 00Z 03Z'
**** average over the inner 2 ACEs ****
    'mfa=(mf(x=1)*0.25+mf(x=2)*2+mf(x=3)*4)/6.25'
    'set grads off'
    'set xlabs 0||1||2||3'
    color=subwrd(_colors,i)
    'set ccolor 'color
    'set cmark 0'
    'set cthick 7'
    'set vrange '_v1' '_v2
    'set ylint 2'
    'set yaxis '_v1' '_v2' '2
    'set ylabs ||||||'
    'd mfa'
    if i=1 
        'draw xlab Time [h]'
        'draw title ACE '_exp_cap
        'off'
    endif
    'close 1'
    i=i+1
endwhile
return

function draw_SAM()
tag=subwrd(_tags,3)
path='/data/W.eddie/SPCAM/GoAmazon_'tag'/'
pattern=path'SAM_'
cases='-448_000 -448_090 -448_180 -448_270 005_000 005_090 005_180 005_270 448_000 448_090 448_180 448_270'
'xdfopen 'path'xdf.ctl'
'set t 1'
'set z 1 30'
'set lat 0.1'
'set lon 180'
'a=hyam'
'b=hybm'
'p0=100000'
'sp=ps'
'pres=a*p0+b*sp'

i=1
while(i<=_num)
    j=subwrd(_sels,i)
    case=subwrd(cases,j)
    ctl=pattern%case'.ctl'
    'open 'ctl
    'set dfile 2'
    'set x 1'
    'set y 1'
    'set lev '_hgt*1000
    k=qdims('zmin')
    'pk=pres(z='k')'
    'set time 00Z 03Z'
    'rho=(pk+p)/(287.04*tabs*(1+0.608*qv))'
    'set grads off'
    'set xlabs 0||1||2||3'
    color=subwrd(_colors,i)
    'set ccolor 'color
    'set cmark 0'
    'set cthick 7'
    'set vrange '_v1' '_v2
    'set ylabs ||||||'
    'd rho*w'
    if i=1 
        'draw xlab Time [h]'
        'draw title SPCAM '_exp_cap
        'off'
    endif
    'close 2'
    i=i+1
endwhile
return
