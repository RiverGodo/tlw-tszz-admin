'use strict';
import axios from 'axios';
let url = "";
export function getOnlineTestList(){
    
    return axios({
        method: 'GET',
        url: url,
        data: formData,
        onUploadProgress: processFun
      });
}