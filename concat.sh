#!/bin/bash

env=ffmpeg
if [[ ! $CONDA_DEFAULT_ENV = "$env" ]]; then
    eval "$(conda shell.bash hook)"
    conda activate $env
    echo $CONDA_DEFAULT_ENV
fi

#PNG
magick /data/W.eddie/GoAmazon_VVM_Figs/Buo_evo_3_ctrl_3km.png /data/W.eddie/GoAmazon_ACE_Figs/Buo_evo_3_control13579_enhanced-condensate-loss_new.png /data/W.eddie/GoAmazon_SAM_Figs/Buo_evo_3_ctrl_mimic_new.png +append /data/W.eddie/GoAmazon_VVM_Figs/Buo_evo_9_ctrl.png
#magick /data/W.eddie/GoAmazon_VVM_Figs/Buo_w_evo_3_ctrl_2km.png /data/W.eddie/GoAmazon_ACE_Figs/Buo_w_evo_3_control13579_enhanced-condensate-loss_supercoolll_new.png /data/W.eddie/GoAmazon_SAM_Figs/Buo_w_evo_3_ctrl_mimic_new.png +append /data/W.eddie/GoAmazon_VVM_Figs/Buo_w_evo_9_ctrl.png
#magick /data/W.eddie/GoAmazon_VVM_Figs/Buo_cld_evo_3_ctrl_2km.png /data/W.eddie/GoAmazon_ACE_Figs/Buo_cld_evo_3_control13579_enhanced-condensate-loss_supercoolll_new.png /data/W.eddie/GoAmazon_SAM_Figs/Buo_cld_evo_3_ctrl_mimic_new.png +append /data/W.eddie/GoAmazon_VVM_Figs/Buo_cld_evo_9_ctrl.png

#SVG
env=base
if [[ ! $CONDA_DEFAULT_ENV = "$env" ]]; then
    eval "$(conda shell.bash hook)"
    conda activate $env
    echo $CONDA_DEFAULT_ENV
fi
svg_stack.py --direction=h --margin=10 /data/W.eddie/GoAmazon_VVM_Figs/Buo_evo_3_ctrl_3km.svg /data/W.eddie/GoAmazon_ACE_Figs/Buo_evo_3_control13579_enhanced-condensate-loss_new.svg /data/W.eddie/GoAmazon_SAM_Figs/Buo_evo_3_ctrl_mimic_new.svg > /data/W.eddie/GoAmazon_VVM_Figs/Buo_evo_9_ctrl.svg
#svg_stack.py --direction=h --margin=10 /data/W.eddie/GoAmazon_VVM_Figs/Buo_w_evo_3_ctrl_2km.svg /data/W.eddie/GoAmazon_ACE_Figs/Buo_w_evo_3_control13579_enhanced-condensate-loss_supercoolll_new.svg /data/W.eddie/GoAmazon_SAM_Figs/Buo_w_evo_3_ctrl_mimic_new.svg > /data/W.eddie/GoAmazon_VVM_Figs/Buo_w_evo_9_ctrl.svg
#svg_stack.py --direction=h --margin=10 /data/W.eddie/GoAmazon_VVM_Figs/Buo_cld_evo_3_ctrl_2km.svg /data/W.eddie/GoAmazon_ACE_Figs/Buo_cld_evo_3_control13579_enhanced-condensate-loss_supercoolll_new.svg /data/W.eddie/GoAmazon_SAM_Figs/Buo_cld_evo_3_ctrl_mimic_new.svg > /data/W.eddie/GoAmazon_VVM_Figs/Buo_cld_evo_9_ctrl.svg
