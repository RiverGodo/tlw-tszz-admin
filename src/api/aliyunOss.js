'use strict';

import api from './config';
import axios from 'axios';

export const ossSFileHost = {
    oss:"http://tlw-web-static-file.oss-cn-beijing.aliyuncs.com/",
    cdn:"https://sfile.tl100.com/"
};
export const ossDFileHost = {
    oss:"http://tl-download-file.oss-cn-beijing.aliyuncs.com/",
    cdn:"https://dfile.tl100.com/"
};
export const ossMvHost = {
    oss:"http://tl-mv.oss-cn-beijing.aliyuncs.com/",
    cdn:"https://mv.tl100.com/"
};
//获取oss签名
export function getOssSign(config) {
    return api.post('ali_oss/get_sign', {
        content_type: config.content_type,
        date: config.date,
        bucket: config.bucket,
        dir: config.dir,
        filename: config.filename,
        type: config.type
    });
}

export function uploadToAliyun(url,formData,processFun){
    return axios({
        method: 'POST',
        url: url,
        data: formData,
        onUploadProgress: processFun
      });
}

