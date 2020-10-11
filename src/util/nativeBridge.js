//h5调用农场app用
class NativeBridge {
    constructor() {
        console.log('桥接init');
        this.device = 3 //设备类型 3 安卓、4 ios
        this.getDeviceType()
        this._isEnv = this.isEnv()
        this.getIosCheckHandler()
        // this.iosCheck=true
    }
    getIosCheckHandler() {
        if (this.device !== 4) return
        let iosCheck = this.handler('iosCheck', false) //ios审核模式开关
        this.iosCheck = iosCheck == 0 ? true : false
    }

    getDeviceType() {
        let u = navigator.userAgent;
        if (/(WKWebView)/i.test(u)) {
            this.device = 4
            window.Callback = this.CallbackHandler


        } else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            this.device = 5 //ios设备除偷偷乐之外的浏览器
        }
    }
    /**
     * @param {string} nativeMethod 需要调用的客户端方法名
     * @param {boolean} async  是否异步  
     * @param {any} param 传给客户端的参数 
     */
    handler(nativeMethod, async, ...param) {//调用函数
        console.log(nativeMethod, param);
        if (!this._isEnv) return //非app环境下不执行


        let device = this.device
        if (device === 3) {//安卓
            if (param.length) {
                return window.android[nativeMethod](...param);
            } else {
                return window.android[nativeMethod]();
            }
        } else {//ios
            let identifier = new Date().getTime().toString().slice(-6) //传给ios的标识符，在ios回调时会返回这个标识符，用来防止多次调用冲突，一般不用
            if (async) {//异步调用
                try {
                    window.webkit.messageHandlers[nativeMethod].postMessage({
                        data: param.length === 1 ? param[0] : param,//传给ios仅一个参数时 不用以数组形式
                        identifier
                    });
                    return identifier
                } catch (error) {
                    console.log('ios找不到'+nativeMethod,JSON.stringify(error));
                }
            } else {
                return window.prompt(nativeMethod, ...param);
            }
        }
    }
    CallbackHandler(identifier, methodName, ...param) {
        window[methodName](...param)
    }
    isEnv() { //判断当前是不是app环境
        if (window.android || this.device === 4) {
            return true
        }
    }
}


export default new NativeBridge()

/**
 * 例：
 *  this.$nativeBridge.handler('toNativePage',true,"farmgame://user_center?Login=1")
 * 同步获取客户端数据
 *  this.$nativeBridge.handler('toNativePage',false,参数一,参数二,参数三)
 * 只要不获取数据一律使用异步
 *  this.$nativeBridge.handler('toNativePage',true,参数一,参数二,参数三)
 */
