import nativeBridge from './nativeBridge'
import {http,deviceInfoObj} from './http'
import store from "@/store";
console.log('init-common');
//请求错误    页面调用this.$com.$throw(e)
//this.$router.replace('/404')   跳404页面
const errorHandler = (error) => {
  console.error(error + '抛出异常');
}
export function $throw(error) {
  errorHandler(error)
}

//去登录
export function toLogin() {
  nativeBridge.handler('goLoginActivity', true)
}

export function isLogin() {
  let { if_first_time } = store.state

  if (if_first_time === -1) {
    toLogin();
    return false;
  }
  return true;
}
export function queryString(obj) {
  let str = '';
  for (let key in obj) {
    str += key;
    str += '=';
    str += obj[key]
    str += '&'
  }
  return str.slice(0, -1)
}
function obj(url, n) { //url后面有几个？
  var urlAry = url.split('?')[n].split('&');
  var urlObj = {};
  urlAry.map(item => {
    item = item.split('=');
    urlObj[item[0]] = item[1]
  })
  return urlObj
}
export function urlParse(url) { //取url后面的参数对象  
  if (url.indexOf('?') == -1) { //url中没有参数
    return {}
  }
  var urlObj1 = obj(url, 1)
  if (url.split('?').length < 3) {
    return urlObj1;
  }
  //url后面有两个？
  var urlObj2 = obj(url, 2)
  return Object.assign(urlObj1, urlObj2)
}


//红包雨倒计时-最大单位是小时---字符串
export function daojishi(time) {
  let timeDif = time;
  var addZero = function (value) {
    return value < 10 ? "0" + value : value;
  }
  var timer = function () {
    if (timeDif <= 0) {
      return;
    }
    var hour = Math.floor(timeDif / (60 * 60));
    var minute = Math.floor((timeDif - hour * 60 * 60) / (60));
    var second = Math.floor((timeDif - hour * 60 * 60 - minute * 60));
    var str = addZero(hour) + ":" + addZero(minute) + ":" + addZero(second);
    return str;
  }
  return timer();
}

//红包雨倒计时-最大单位是小时---返回的是obj
export function daojishi_obj(time) {
  let timeDif = time;
  var addZero = function (value) {
    return value < 10 ? "0" + value : value;
  }
  var timer = function () {
    if (timeDif <= 0) {
      return;
    }
    var hour = Math.floor(timeDif / (60 * 60));
    var minute = Math.floor((timeDif - hour * 60 * 60) / (60));
    var second = Math.floor((timeDif - hour * 60 * 60 - minute * 60));
    var obj = {
      hour: addZero(hour),
      minute: addZero(minute),
      second: addZero(second)
    }
    return obj;
  }
  return timer();
}

// 去唤醒或下载app
export function toApp() {
  var vm = new Vue();
  //去应用宝、下载或唤醒
  if (vm.isiOS) {//nativeBridge.device >= 4
    window.location = 'https://apps.apple.com/cn/app/%E7%96%AF%E7%8B%82%E5%81%B7%E5%81%B7%E4%B9%90plus/id1526238149'
  } else {
    setTimeout(() => {
      window.location = 'https://sj.qq.com/myapp/detail.htm?apkName=com.lucky.farmgame'
    }, 800)
    window.location = 'farmgame://com.lucky.farmgame' //已安装、会唤醒app；没安装不调用
  }
}



export function timeFormat(time) {
  let oldDate = new Date(time)
  let newDate = new Date()
  var dayNum = "";
  var getTime = (newDate.getTime() - oldDate.getTime()) / 1000;

  if (getTime < 60 * 5) {
    dayNum = "刚刚";
  } else if (getTime >= 60 * 5 && getTime < 60 * 60) {
    dayNum = parseInt(getTime / 60) + "分钟前";
  } else if (getTime >= 3600 && getTime < 3600 * 24) {
    dayNum = parseInt(getTime / 3600) + "小时前";
  } else if (getTime >= 3600 * 24 && getTime < 3600 * 24 * 30) {
    dayNum = parseInt(getTime / 3600 / 24) + "天前";
  } else if (getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12) {
    dayNum = parseInt(getTime / 3600 / 24 / 30) + "个月前";
  } else if (time >= 3600 * 24 * 30 * 12) {
    dayNum = parseInt(getTime / 3600 / 24 / 30 / 12) + "年前";
  }
  let year = oldDate.getFullYear();
  let month = oldDate.getMonth() + 1;
  let day = oldDate.getDate();
  let hour = oldDate.getHours();
  let minute = oldDate.getMinutes();
  let second = oldDate.getSeconds();
  return dayNum
  //        return dayNum+" "+year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
}


//获取token
export function getToken() {
  return new Promise((resolve, reject) => {
    let token
    if (nativeBridge._isEnv) {
      token = nativeBridge.handler('getToken')
    } else {
      token = urlParse(location.href).token || '1b0db9d1483349a882cb655933cc11ca'
    }
    // resolve('cb9f038eb6634d6ea73c083aaebea001')
    resolve(token)

  })
}

//获取用户信息
/*  this.res = await this.$com.isTourist(this, this.token)
this.$toast(this.res.data.obj.brand) */
export function isTourist(token) {
  return new Promise((resolve, reject) => {
    http('/home/data/v1/get/user/token', {
      params: {
        token: token
      }
    }).then(function (res) {
      if (res.data.resultCode == 0) {
        resolve(res) //返回有效值
      } else {
        toLogin() //去登录页
      }
    }).catch(function (err) {
      console.log(err);
    });
  })
}




export function offset(curEle) {
  var l = curEle.offsetLeft; //当前元素的左偏移
  var t = curEle.offsetTop; //当前元素的上偏移
  var p = curEle.offfsetParent; //当前元素的父级参照物
  while (p) {
    l += p.offsetLeft + p.clientWidth; //元素父级参照物的左偏移+边框
    t += p.offsetTop + p.clientHeight; //元素父级参照物的上偏移+边框
    p = p.offsetParent; //元素父级的父级继续查找，直到找到body，body.offsetParent=null,条件不成立，结束循环
  }
  return {
    left: l,
    top: t
  }
}

export const loadImage = (imgs, callback) => { //图片的预加载  入参String[], 返回imgElement[]
  return new Promise((resolve, reject) => {
    let img = new Image(); //新建一个图片标签
    let arr = []
    let i = 0
    img.addEventListener("load", loadHandler);
    img.src = imgs[i]

    function loadHandler() {
      arr.push(this.cloneNode(false));
      callback && callback((i+1)/imgs.length)
      i++
      if (i > imgs.length - 1) {
        img.removeEventListener("load", loadHandler)
        resolve(arr)
      } else {
        this.src = imgs[i]
      }
    }
  })
}

let bottonAudio = null
export const bottonAudioPlay = () => {//按钮音效
  let isBgAudio=localStorage.getItem('BgAudio')
  if(isBgAudio==='false')return

  if (!bottonAudio) bottonAudio = document.getElementById("butAudio")
  bottonAudio.play()
}

let nowAudioPlayId = null
export const changeBgAudio = (id, play) => { //音乐关闭/打开
  let isBgAudio=localStorage.getItem('BgAudio')
  if(isBgAudio==='false')return
  
  
  if (play === 1){//打开   播放离开时关闭的页面
    let nowAudioPlay = document.getElementById(nowAudioPlayId)
    nowAudioPlay&&nowAudioPlay.play()
    return
  }

  
  let ploughAudio = document.getElementById(id)
  if (!ploughAudio) return
  if (!ploughAudio.paused) {//关闭
    ploughAudio.pause()
    nowAudioPlayId = id
  }
}

//取数组里随机的一项
export const get_one_from_arr = (list) => {
  if (list.length === 0) {
    return ''
  } else if (list.length === 1) {
    return list[0]
  } else {
    return list[Math.floor(Math.random() * (list.length))]
  }
}
export const getUrlParams=(url)=>{
  let obj = {}
  let Params=url.split("?")[1]||url
  Params.split("&").forEach(t => {
      let arr = t.split('=')
      obj[arr[0]] = arr[1]
  })
  return obj
}

//页面使用 this.$com.getVersionNameNumber()>1030
export const getVersionNameNumber=()=>{
  console.log(deviceInfoObj,'------');
  let appVersionName=deviceInfoObj.appVersionName||'9.9.9.9'
  let dotArr=appVersionName
  let count = dotArr.split('.').length - 1;
  
  if(count<3){//处理版本名称1.0.4   1.0.4.0
    appVersionName= appVersionName+'.0'
  }
  let number=Number(appVersionName.split('.').reduce((pre,next)=> pre+next))
  return number
}
const versionNameHandler=(()=>{
  let versionName
  return ()=>{
    if(!versionName){
      versionName=getVersionNameNumber()
    }
    return versionName
  }
})()
/**
 * 获取版本号 只调一次客户端
 * 例 this.$com.versionName()
 */
export const versionName=()=>versionNameHandler()



//页面使用 this.$com.showNoRedBagDialog this.$com.showRedBagDialog
/**
 * 
 * @param {*} title 标题
 * @param {*} type 1: 金币, 2: 稀有种子, 3: 普通化肥, 4: 狗粮, 5: 体力
 * @param {*} redbag  奖励数量
 * @param {*} flag    是否展示视频
 * @param {*} videoId  视频id，不传id，不看视频
 * @param {*} des  描述：“晋级”
 */
export const showNoRedBagDialog=(title,type,redbag,videoId,des)=>{
  if(versionName()<1050){
    nativeBridge.handler(
      "showNoRedBagDialog1030",true,title,type,redbag,videoId,des
    );
  }else{
    nativeBridge.handler(
      "showNoRedBagDialog1050",true,title,type,redbag,videoId?true:false,videoId,des
    );
  }
}
export const showRedBagDialog=(title,redbag,videoId,des)=>{
  if(versionName()<1050){
    nativeBridge.handler(
      "showRedBagDialog1030",true,title,redbag,videoId,des
    );
  }else{
    nativeBridge.handler(
      "showRedBagDialog1050",true,title,redbag,videoId?true:false,videoId,des
    );
  }
}
export const toTaobaoHandler=(url)=>{
  nativeBridge.handler("jumpToTaoBao",true,decodeURIComponent(url));
}
