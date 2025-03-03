pattern='/data/W.eddie/VVM/DATA/test_bubble_const_*/gs_ctl_files/dynamic.ctl'
rc=gsfallow('on')
list=sys('ls 'pattern)
num=count_num(list)
'reinit'

i=1
while(i<=num)
    file=subwrd(list,i)
    say file
    'open 'file
    'xygrid'
    'R=sqrt(pow(xgrid-64.5,2)+pow(ygrid-64.5,2))'
    'set x 61'
    'set y 64'
    'set z 1'
    'set t 1'
*    'wmn=amin(maskout(w,R<=4),x=52,x=77,y=52,y=77)'
*    'set xaxis 1 30'
    'set grads off'
    'set gxout grfill'
    'd min(maxloc(maskout(w<0,w<0),t=1,t=30),z=1,z=10)'
    say result
    'draw title 'file
*    pull xxx
    'c'
    'close 1'
    i=i+1
endwhile
