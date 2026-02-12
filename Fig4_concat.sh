#!/bin/bash

vvm_path=/data/W.eddie/GoAmazon_VVM_Figs/
ace_path=/data/W.eddie/GoAmazon_ACE_Figs/
sam_path=/data/W.eddie/GoAmazon_SAM_Figs/

#PNG
env=ffmpeg
if [[ ! $CONDA_DEFAULT_ENV = "$env" ]]; then
    eval "$(conda shell.bash hook)"
    conda activate $env
    echo $CONDA_DEFAULT_ENV
fi

magick ${vvm_path}Fig4ab_3km.png -crop 400x500+0+0 Fig4temp1.png
magick ${vvm_path}Fig4cd_3km.png -crop 400x520+0+248 Fig4temp2.png
magick Fig4temp1.png Fig4temp2.png -append Fig4_VVM.png
magick ${ace_path}Fig4ef_control13579_enhanced-condensate-loss_supercoolll.png -crop 400x500+0+0 Fig4temp1.png
magick ${ace_path}Fig4gh_control13579_enhanced-condensate-loss_supercoolll.png -crop 400x520+0+248 Fig4temp2.png
magick Fig4temp1.png Fig4temp2.png -append Fig4_ACE.png
magick ${sam_path}Fig4ij_ctrl_mimic.png -crop 474x500+26+0 Fig4temp1.png
magick ${sam_path}Fig4kl_ctrl_mimic.png -crop 474x520+26+248 Fig4temp2.png
magick Fig4temp1.png Fig4temp2.png -append Fig4_SAM.png
magick Fig4_VVM.png Fig4_ACE.png Fig4_SAM.png +append ${vvm_path}Fig4.png

#SVG
env=base
if [[ ! $CONDA_DEFAULT_ENV = "$env" ]]; then
    eval "$(conda shell.bash hook)"
    conda activate $env
    echo $CONDA_DEFAULT_ENV
fi

svg_stack.py --direction=v --margin=2 ${vvm_path}Fig4ab_3km.svg ${vvm_path}Fig4cd_3km.svg > ${vvm_path}Fig4_VVM.svg
svg_stack.py --direction=v --margin=2 ${ace_path}Fig4ef_control13579_enhanced-condensate-loss_supercoolll.svg ${ace_path}Fig4gh_control13579_enhanced-condensate-loss_supercoolll.svg > ${ace_path}Fig4_ACE.svg
svg_stack.py --direction=v --margin=2 ${sam_path}Fig4ij_ctrl_mimic.svg ${sam_path}Fig4kl_ctrl_mimic.svg > ${sam_path}Fig4_SAM.svg
svg_stack.py --direction=h --margin=2 ${vvm_path}Fig4_VVM.svg ${ace_path}Fig4_ACE.svg ${sam_path}Fig4_SAM.svg > ${vvm_path}Fig4.svg
