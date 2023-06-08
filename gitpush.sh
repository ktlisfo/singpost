#!/bin/bash

# Author: KT
# URL: https://github.com/ktlisfo/singpost.git
# Contact: ktlisfo@gmail.com

# REPLACE THIS as your github.io structure
data_folder_path='./data'

# git add, commit, push
git fetch
git add $data_folder_path/*
#git add *
git commit -m "file is uploaded(auto) : `date +'%Y-%m-%d %H:%M'`"
git push