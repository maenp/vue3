<template>
  <div class="pop_bg" v-if="isShow">
    <div class="pop_container elseRaward">
      <img class="bg_light3 bg_light" src='/static/img/farmGame/light3.png' alt="">
      <img class="bg_light2 bg_light" src='/static/img/farmGame/light2.png' alt="">
      <img class="bg_light1 bg_light" src='/static/img/farmGame/light.png' alt="">
      <div class="title">恭喜解锁</div>
      <!-- <img class="title" :src="`/static/img/farmGame/type${type}.png`" alt=""> -->
      <!-- <div class="reward">{{redbag}}</div> -->
      <div class="typeIcon" :style="'background-image:url(' + unlockPlatImg + ')'" />
      <!-- <img class="typeIcon" :src="unlockPlatImg" alt=""> -->
      <img class="btn" @click="clickButtonHandler" :src="'/static/img/farmGame/'+(0?'video_btn2.png':'continue_btn2.png')" alt="">
      <img class="close" @click="close" src="/static/img/farmGame/close_icon.png" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      unlockPlatImg:'',//升级解锁作物图片
      // redbag: 1000, //显示数量
      // type: 10, //1金币 2红包券 3化肥 4狗粮 5体力 6偷菜 8种子 9升级 10解锁作物
      //客户端 1: 金币, 2: 稀有种子, 3: 普通化肥, 4: 狗粮, 5: 体力  7:红包券
      // videoId: null, //视频id，大于0展示看视频
      // title: "恭喜升级",
      // des: "" //描述
      // showLv: false
    };
  },
  created() {
    window.noRedBagDialogDismiss = this.noRedBagDialogDismiss;
    window.redBagDialogDismiss = this.redBagDialogDismiss;
    window.lookVideoAd = this.lookVideoAd;
    this.throttleTime=0
    this.Observer.$once('messageBox',this.show)
  },
  methods: {
    show(rewardInfo, fn) {
      if (fn instanceof Function) this.callback = fn;
      console.log(rewardInfo);
      let { isShowVideo, title, type, redbag, source, des } = rewardInfo;


      // if(source==='plough'){//收获红包券新方法    2020-09-08
      
      //   let throttle=new Date().getTime()
      //   if(throttle-this.throttleTime<500)return
      //   this.throttleTime=throttle

      //   this.source=source
      //   this.$nativeBridge.handler("showRedBagTwentyDialog1080",true,
      //     title,
      //     redbag,
      //     123456,
      //     ''
      //   );
      //   return
      // }


      let videoId = isShowVideo ? 1 : null;
      des = des || ""; //没有定义的传空


      if (type == 2) { //红包券
        this.$com.showRedBagDialog( title,redbag,videoId,des)
      } else {
        this.$com.showNoRedBagDialog( title,type,redbag,videoId,des)

      }

      if (rewardInfo.source === "gameUserLvConfig") {//升级
        Object.assign(this, rewardInfo);
        if(rewardInfo.unlockPlatImg)this.isShow = true;//解锁
      }
    },
    noRedBagDialogDismiss(id) {//非红包点击关闭
      this.$com.bottonAudioPlay();
      if (this.source === "gameUserLvConfig"&&this.unlockPlatImg&&this.isShow)return //有解锁作物先不关闭
      this.close();
    },
    redBagDialogDismiss(id) {//红包点击关闭
      this.$com.bottonAudioPlay();
      //  if(this.source==='plough'){//收获红包券 1倍奖励  2020-09-08
      //   this.$emit('ploughShowRewardAd',null,1)
      //   return
      // }

      if (this.source === "gameUserLvConfig"&&this.unlockPlatImg&&this.isShow)return //有解锁作物先不关闭
      this.close();
    },
    lookVideoAd() {//点击播放
      // if(this.source==='plough'){//收获红包券 20倍奖励  2020-09-08
      //   this.$emit('ploughShowRewardAd',null,2)
      // }else{
        this.callback && this.callback();
      // }
    },

    
    clickButtonHandler() {//自己的解锁弹窗点击关闭
      this.$com.bottonAudioPlay();
      this.callback && this.callback();
      this.close();
    },
    close() {
      if (this.source === "gameUserLvConfig") this.callback && this.callback(); //升级弹窗关闭也要执行回调
      this.callback = null; //清除回调
      Object.assign(this, { //关闭弹窗回复默认数据
        videoId: 0,
        title: "",
        type: 1,
        isShow: false,
        redbag: 0,
        source: "",
        des: "",
        unlockPlatImg:''
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@keyframes turn {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fade {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}
.elseRaward {
  height: 6.8rem;
  width: 6.19rem;
  background: no-repeat;
  .bg_light {
    position: absolute;
    width: 100%;
    height: auto;
  }
  .bg_light1 {
    animation: turn 3s linear infinite;
  }
  .bg_light2 {
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
    top: 0.5rem;

    animation: fade 3s linear infinite;
  }
  .bg_light3 {
    animation: fade 3s linear infinite;
  }
  .typeIcon {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 1.4rem;
    z-index: 10;
    height: 3.075rem;
    width: 2.75rem;
    background: no-repeat;
    background-size: 100% 100%;
  }
  .close {
    height: 0.44rem;
    width: 0.44rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -0.5rem;
  }
  .title {
    position: absolute;
    left: 50%;
    font-size: 0.65rem;
    text-align: center;
    letter-spacing: 2px;
    color: #fee092;
    font-weight: 900;
    transform: translateX(-50%);
    height: 0.78rem;
    width: 3.76rem;
    text-shadow: 2px 2px 0 #732F15, 2px, -2px 0 #732F15, 2px -2px 0 #732F15, 2px 2px 0 #732F15, 2px 1px 0 #732F15, 2px -1px 0 #732F15, 2px -1px 0 #732F15, -2px 1px 0 #732F15, 2px 2px 0 #732F15, 2px -2px 0 #732F15, 2px -2px 0 #732F15, -2px 2px 0 #732F15, 2px 1px 0 #732F15, 2px -1px 0 #732F15, 2px -1px 0 #732F15, -2px 1px 0 #732F15, 2px 0px 0 #732F15, 2px 0px 0 #732F15, -2px 0px 0 #732F15, -2px 0px 0 #732F15, 1px 2px 0 #732F15, 1px -2px 0 #732F15, 1px -2px 0 #732F15, -1px 2px 0 #732F15, 1px 1px 0 #732F15, 1px -1px 0 #732F15, 1px -1px 0 #732F15, -1px 1px 0 #732F15, 1px 2px 0 #732F15, 1px -2px 0 #732F15, 1px -2px 0 #732F15,-1px 2px 0 #732F15, 1px 1px 0 #732F15, 1px -1px 0 #732F15, 1px -1px 0 #732F15, -1px 1px 0 #732F15, 1px 0px 0 #732F15, 1px 0px 0 #732F15, -1px 0px 0 #732F15,-1px 0px 0 #732F15, 2px 2px 0 #732F15,2px -2px 0 #732F15,2px -2px 0 #732F15,-2px 2px 0 #732F15, 2px 1px 0 #732F15,2px -1px 0 #732F15,2px -1px 0 #732F15,-2px 1px 0 #732F15, 2px 2px 0 #732F15,2px -2px 0 #732F15,2px -2px 0 #732F15,-2px 2px 0 #732F15, 2px 1px 0 #732F15,2px -1px 0 #732F15,2px -1px 0 #732F15,-2px 1px 0 #732F15, 2px 0px 0 #732F15, 2px 0px 0 #732F15,-2px 0px 0 #732F15,-2px 0px 0 #732F15, 1px 2px 0 #732F15,1px -2px 0 #732F15,1px -2px 0 #732F15,-1px 2px 0 #732F15, 1px 1px 0 #732F15,1px -1px 0 #732F15,1px -1px 0 #732F15,-1px 1px 0 #732F15, 1px 2px 0 #732F15,1px -2px 0 #732F15,1px -2px 0 #732F15,-1px 2px 0 #732F15, 1px 1px 0 #732F15,1px -1px 0 #732F15,1px -1px 0 #732F15,-1px 1px 0 #732F15, 1px 0px 0 #732F15, 1px 0px 0 #732F15,-1px 0px 0 #732F15,-1px 0px 0 #732F15, 0px 2px 0 #732F15,0px -2px 0 #732F15,0px -2px 0 #732F15, 0px 2px 0 #732F15, 0px 1px 0 #732F15,0px -1px 0 #732F15,0px -1px 0 #732F15, 0px 1px 0 #732F15, 0px 2px 0 #732F15,0px -2px 0 #732F15,0px -2px 0 #732F15, 0px 2px 0 #732F15, 0px 1px 0 #732F15,0px -1px 0 #732F15,0px -1px 0 #732F15, 0px 1px 0 #732F15, 0px 0px 0 #732F15, 0px 0px 0 #732F15, 0px 0px 0 #732F15, 0px 0px 0 #732F15,0 0 0 #732F15;
  }
  .reward {
    position: absolute;
    /* letter-spacing:1px; */
    left: 50%;
    top: 3.5rem;
    z-index: 15;
    transform: translateX(-50%);
    height: 1rem;
    line-height: 1;
    font-size: 0.9rem;
    font-weight: bold;
    color: red;
    text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
  }
  .btn {
    position: absolute;
    height: 1.2rem;
    width: 3.6rem;
    left: 50%;
    bottom: 0.4rem;
    transform: translateX(-50%);
  }
}
</style>