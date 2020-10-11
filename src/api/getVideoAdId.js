import nativeBridge from './../util/nativeBridge'
//激励视频广告id
const IS_ENV=nativeBridge._isEnv
let getVideoAdId=(adId)=>nativeBridge.handler('getAdIdValue',false,adId)

const ADID={
    // 激励视频
    ADD_FERTILIZER_ADID:'web_game_getFeiliao_videoAd',//获取肥料
    SET_LEASEBLOCK_ADID:'web_game_landRent_videoAd',//扩建土地
    PLANT_HARVEST_ADID:'web_game_coupon_videoAd',//获取红包券、体力或其他奖励
    TURN_TOWER_ADID:'web_game_turn_videoAd',//获取体力值
    PLANT_RAWARD_RED_ADID:'web_game_coupon_red_videoAd',//获取红包券
    PLONTBOX_GET_GOLD_ADID:'web_game_get_gold_videoAd',//看视频获取金币

    //插屏广告
    OPEN_TURN_ADID:'web_game_openTurn_InterstitialAd',//看视频获取金币
}




let timer
export const showRewardAd=(adId,adPlayComplete,adFail,adClose)=>{
    // if(adPlayComplete===adFail){//成功和失败回调相同时  不用的等待客户端回调  直接调用成功回调(收获红包券时)
    //     window.adPlayComplete=null 
    //     window.adFail=null
    //     window.adClose=adClose
    //     timer=setTimeout(_=>{
    //         clearTimeout(timer)
    //         timer=null
    //         adPlayComplete()
    //         // adClose&&adClose()
    //     },1000)
    // }else{
        let adPlay
        //视频播放成功
        window.adPlayComplete = ()=>{
            console.log('视频回调成功');
            adPlay=true
            adPlayComplete()
        } 
        window.adFail = adFail?adFail:()=>{VM.$toast.bottom('激励视频播放失败，请稍后重试')} //视频加载失败
        //视频播放完被关闭
        window.adClose = ()=>{
            console.log('视频回调关闭');
            adClose(adPlay)
        }
    // }

    if(!IS_ENV){//非客户端环境下
        if(!confirm('看视频'))return
        window.adPlayComplete()
        VM.$toast('请在客户端环境运行');
        return
    }
    // if(!confirm('看视频')||adPlayComplete===adFail)return
    adPlayComplete()
    // nativeBridge.handler('showRewardAd',true,getVideoAdId(ADID[adId]), 0, "") //播放激励视频
}
//插屏广告
export const showInterstitial1080=(adId,adPlayComplete,adFail,adClose)=>{
        window.adPlayComplete = adPlayComplete //视频播放成功
        window.adFail = adFail//视频加载失败
        window.adClose = adClose//视频播放完被关闭
    if(!IS_ENV){//非客户端环境下
        if(!confirm('插屏广告'))return
        window.adPlayComplete()
        VM.$toast('请在客户端环境运行');
        return
    }
    nativeBridge.handler('showInterstitial1080',true,getVideoAdId(ADID[adId])) 
}