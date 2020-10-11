import axios from 'axios'
import { urlParse,getToken } from './common';
import nativeBridge from './nativeBridge'
import loadScript from './loadScript'

const IS_ENV = nativeBridge._isEnv
if (process.env.NODE_ENV === 'development' && IS_ENV) {
    loadScript('https://cdn.bootcss.com/eruda/1.4.3/eruda.min.js', () => {
        eruda.init()
    })
}
let mainUrlObj = urlParse(location.href); //取当前url参数，设置公共header的值
let baseURL
function getBaseUrl() {
    let host = location.host
    if (host.startsWith('task')) {
      baseURL = '//serverapiplus-mj.wanzhuanmohe.cn/' //生产环境
    } else if (host.startsWith('devtask')) {
      baseURL = '//devserverapiplus-mj.wanzhuanmohe.cn/'
    } else if (host.startsWith('test')) {
      baseURL = '//testserverapiplus-mj.wanzhuanmohe.cn/' //测试环境
    } else {
      // baseURL = '//serverapiplus-mj.wanzhuanmohe.cn/' //生产环境
      baseURL = '//testserverapiplus-mj.wanzhuanmohe.cn/' //测试环境
      // baseURL = 'http://221.122.127.143:16770'//开发环境
      // baseURL = 'http://172.16.35.119:16880/'
      window.DEV = true
    }
}
getBaseUrl()

export let deviceInfoObj = {}
if (IS_ENV) {
  deviceInfoObj = JSON.parse(nativeBridge.handler('getDeviceInfo', false))
}
export let http = axios.create({
    baseURL,
    timeout: 80000,
    withCredentials: true, //跨域设置  携带cookie不受限值
    headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
        'designVersion': mainUrlObj.designVersion || deviceInfoObj.appVersionName || '', //版本名称
        'version': mainUrlObj.version || deviceInfoObj.appVersion || '', //版本号
        'appPlatform': nativeBridge.device >= 4 ? 2 : 1, //平台  1-安卓   2-ios
        "appChannel": deviceInfoObj.appChannel || '', //渠道
        "appCheatId": deviceInfoObj.shumeiId || '',
        "UMDeviceToken": deviceInfoObj.UMDeviceToken || '',
    }
});

//拦截器
http.interceptors.request.use(async config => {
    config.headers["PhoneTime"] = new Date().getTime() //用于请求参数加密验证  用最新的时间戳
    let token=await getToken()
    config.params=config.params||{}
    config.params.token=token
    return config;
}, err => {
    return Promise.reject(err);
})
export default http;