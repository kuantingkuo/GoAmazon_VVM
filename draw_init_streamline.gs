'reinit'
'ini -l'

'open /data/W.eddie/VVM/DATA/GoAmazon_line58_16_t06/gs_ctl_files/dynamic.ctl'
'set x 56 72'
'set y 64'
'set lev 0 4000'
'set t 1'

x0=64
dx=0.5
xkm1=(56-x0)*dx
xkm2=(72-x0)*dx

'c'
'set xaxis 'xkm1' 'xkm2
'set yaxis 0 4 1'
'set grads off'
'set gxout stream'
'd u;w'
'draw xlab [km]'
'draw ylab Height [km]'
'gxprint /data/W.eddie/GoAmazon_VVM_Figs/init_streamline.png white'
