import axios from 'axios';
import env from '../../build/env';
import Cookies from 'js-cookie';
import {
  Message
} from 'iview';
let ajaxUrl = '//api.tl100.com/tool/api';
let tokenName = 'tlw_tszz_token'
let redirectUrl = '//admin.tl38.xuege100.com/#/login'
if (process.env.NODE_ENV == 'test') {
  ajaxUrl = '//api.xuege100.com/tool_test/api';
  // ajaxUrl = '//192.168.6.50:7142/tool_test/api';
  redirectUrl = '//admin.tl38.xuege100.com/dev/#/login'
  tokenName = 'tlw_tszz_token_test'
}
// const ajaxUrl = 'http://api.tl100.com/tool/api'; //本地'http://localhost:3998/tool/api'线上'http://api.tl100.com/tool/api'
const CancelToken = axios.CancelToken;
const api = axios.create({
  baseURL: ajaxUrl,
  withCredentials: true,
  timeout: 5000,
});
const pending = [];
const removePending = (config) => { //取消请求操作
  for (const [index, value] of pending.entries()) {
    if (value.u === config.url + '&' + config.method + '&' + config.data) {
      value.cancel('重复请求被取消');
      pending.splice(index, 1)
    }
  }
}


api.interceptors.request.use(function (config) {
  removePending(config) //执行取消操作
  config.cancelToken = new CancelToken((c => {
    pending.push({
      u: config.url + '&' + config.method + '&' + config.data,
      cancel: c
    })
  }))
  if (!config.data) {
    config.data = {}
  }
  config.data.token = Cookies.get(tokenName);
  if (!config.params && config.method == 'get') {
    config.params = {}
    config.params.token = Cookies.get(tokenName)
  }
  //设置请求默认token
  /* if (config.data) {
      config.data.token = '' || vm.$localStorage.get('token');
  }
  else
  {
      config.data = {token:vm.$localStorage.get('token')}
  } */
  return config;
}, function (error) {
  return Promise.reject(error);
});

//返回请求拦截，处理格式和token
api.interceptors.response.use(function (response) {
  removePending(response.config) //执行取消操作
  if (response.status == 200) {
    if (response.data.res_code < -900) {
      //跳转登录
      Cookies.remove('islogin');
      Cookies.remove('userInfo');
      //localStorage.clear();
      window.location.href = redirectUrl;
    }
  }
  return response.data;
}, function (error) {
  if (/timeout/.test(error.toString())) {
    Message.warning('请求超时,重新刷新页面~')
  }
  return Promise.reject(error);
});

export default api;