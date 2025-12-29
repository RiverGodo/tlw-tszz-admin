#!/bin/bash
echo "拉取代码!"
git pull
echo "开始编译项目!"
npm run build-test
echo "开始上传静态资源到OSS!"
distPath="./dist"
ossPath="oss://tlw-web-static-file/tlw_tszz_admin_test/"
ossutile64 cp $distPath $ossPath -r -u
echo "上传结束！"
echo "重新启动项目！"
pwd=`pwd`;
title='tlw_tszz_admin_test';
count=`ps -ef | grep ${pwd} | wc -l`;
if [  $count -lt 2 ]; then
  pm2 start server.js --name $title -- test
else
  pm2 restart $title
fi

