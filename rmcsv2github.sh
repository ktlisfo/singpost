#!/bin/bash


# github 동일 파일 체크할 정보
csv_file="git_check_files.csv" #./WEB/git_check_files.csv

cd './WEB'
git pull

# CSV 파일을 읽어서 각 행의 "path" 컬럼 값을 추출하여 처리
# 첫 번째 행은 헤더이므로 while 루프 시작 전에 한 번 읽어서 무시
tail -n +2 "./data/$csv_file" |while IFS=, read -r path
do
    # data.csv 파일 경로에 있는 파일 삭제
    rm -rf "$path"
    echo "Delete github old file(if exist): $path"
    # 변경 사항을 Git에 추가 및 커밋
done

# 모든 파일을 삭제한 후 data.csv 파일 삭제
rm -f "./data/$csv_file"

git add ./data/*
git commit -m "Remove files"

# Git 푸시
# git push
