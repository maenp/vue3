<template>
  <div class="ploughBg" v-if='flag'>
    <div class="userInfo">
      <img :src="headUrl||'http://cbdmcn.oss-cn-beijing.aliyuncs.com/user/user_default_head.png'" alt="">
      <div class="name"><span>{{nickName||'某某某'}}</span>的田园</div>
    </div>
    <div class="notice" v-show='showNotice'>本次掠夺你可以收走<span>1株</span>已成熟作物</div>
    <div class="ploughBox">
      <ul class="container">
        <li :class="[{ LeaseBlock: t.blockStatus===0&&t.ifLeaseBlock }, 'plough']" v-for="t in ploughList" :key="t.blockId">
          <p class="harvest variant" v-show="t.plantStatus==2&&isHarvest" @click='plant(t)' />
          <!-- 种子图片 -->
          <img class="plant variant" :src="getPlantImg(t)" v-show="t.plantStatus!==null&&getPlantImg(t)" alt="" @click="changeHarvestHandler(true)" />
        </li>
      </ul>
    </div>

    <img class="close" @click='exit()' src="~@/static/img/farmGame/back.png" alt="">
    <div class="isHarvest" @click="changeHarvestHandler()">
      <img v-if='isHarvest' src="/static/img/activity/game/toucai0.png" alt="">
      <img v-else src="/static/img/activity/game/toucai.png" alt="">
    </div>
    <img class='pointer' @click="changeHarvestHandler()" src='/static/img/farmGame/hand.png' alt="">
    <img src="/static/img/farmGame/hand_light.png" alt="" class="hand_light1">
    <Toucai ref='Toucai' @close='close'></Toucai>
    <RedBag ref='RedBag' @close_video='close_video' @reward='reward'></RedBag>
    <!-- 狗叫声 -->
    <audio preload="auto" ref="bark" :src="require('@/static/music/farmGame/bark.mp3')" type="audio/mpeg"></audio>
    <!-- 偷菜背景音乐 -->
    <audio loop id="else_plough_audio" ref="else_plough_audio" :src="require('@/static/music/farmGame/else_ploufh_bg.mp3')" type="audio/mpeg"></audio>
    <MessageBox ref="MessageBox" />
  </div>
</template>
<script>
import Qs from "qs";
// import $ from "jquery";
import Toucai from "./Toucai.vue"; //偷菜
import RedBag from "./RedBag.vue"; //红包
import { MessageBox } from "./../../../components/farmGame";
import {getElsePLoughPlantApi,ElseHarvestRewardApi} from './../../../api'
import { showRewardAd } from "./../../../api/getVideoAdId";
export default {
  data() {
    return {
      showNotice: true,
      headUrl: "",
      nickName: "",
      flag: false, //默认不展示
      ploughList: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      isHarvest: false, //偷菜手是否开启
      
    };
  },
  computed: {
    tokenX: {
      get() {
        return this.$store.state.farmGame.token;
      }
    }
  },
  components: {
    Toucai,
    RedBag,
    MessageBox
  },
  methods: {
    initBgAudioHandler() {
      //初始化背景音乐
      let isBgAudio = localStorage.getItem("BgAudio");
      if (isBgAudio !== "false") {
        this.$refs.else_plough_audio.play();
      }
    },
    changeHarvestHandler(status) {
      if (!this.isHarvest) {
        this.$button_click("steal_harvest");
      }
      if (this.isHarvestAll || this.isHarvest) {
        this.isHarvest = status || !this.isHarvest;
      } else {
        this.$refs.Toucai.show("","主人的地空空如也，快喊他回来去种植吧", null, null);
        // this.$toast("无菜可偷~");
      }
    },
    PlantHarvestHandler() {
      return new Promise(reslove => {
        let rewardInfo = this.gameUserLvConfig;
        if (rewardInfo.source === "gameUserLvConfig") {//升级
          this.$refs.MessageBox.show(rewardInfo, () => {

            reslove();
          });
          this.$store.dispatch("farmGame/getPloughInfo");
        }
      });
    },
    show(source,id) { //打开
      // window.redBagDialogDismiss = this.redBagDialogDismiss;
      this.isSuccess=-1//偷过退出偷菜页面时传给客户端 userId，没偷传-1
      if (this.isHarvest) {
        this.isHarvestAll = null;
        this.isHarvest = false;       
      }
      if(typeof source==='string')this.source=source 
      this.flag = !this.flag;
      
      if (!this.flag){//flag为假 是离开偷菜页面 不继续操作
        if(this.source==='friend') {//从客户端进来的离开要通知客户端

          this.timer=setTimeout(_=>{
            clearTimeout(this.timer)
            window.resume()//未知bug 返回后视频回调消失  这里加刷新解决
            if(this.$com.versionName()>=1061){
              this.$nativeBridge.handler('onStealBack',true,this.isSuccess)//偷过的传userId，没偷传-1
            }else{
              this.$nativeBridge.handler('onStealBack',true)//isSuccess  偷过的传userId，没偷传-1
            }
           
          },400)
        }
        return; 
      } 
      this.init(id);
      this.$nextTick(_ => {
        this.initBgAudioHandler();
        //奖励类型：1 金币 2 红包券   调试弹窗用
        // this.$refs.Toucai.show("", 123, null, null, 1);
      });
    },
    exit(){
      this.$emit("animationHandler");
    },
    close(to) {//偷菜弹窗提示去收割植物时会传 'home'
      this.$com.bottonAudioPlay();
      this.$store.commit("farmGame/myInfoChangeUpdate"); //更新个人信息
      this.$button_click("steal_back");
      if (this.gameUserLvConfig) {
        //偷菜后如果升级，关闭当前页面前展示升级弹窗一次
        this.PlantHarvestHandler().then(_ => {
          //等待升级弹窗关闭 再关闭当前偷菜页面
          this.gameUserLvConfig = null; //清除升级数据
          this.$emit("animationHandler",to);
        });
      } else {
        //偷菜后 用户没有升级  关闭偷菜页面
        this.$emit("animationHandler",to);
      }
    },
    close_video() {
      //没有看视频
      this.$refs.Toucai.show(
        this.nickName,
        "的田园时大发善心，放弃了唾手可得的红包",
        null,
        null
      );
    },

    init(userid) {
      // 偷菜种植信息初始化
      this.$http("/game/plant/steal/init", {
        params: {
          token: this.tokenX,
          userid //大转盘不传 好友偷菜为userid 随机偷菜为 -1
        }
      })
        .then(res => {
          if (res.data.resultCode == 0) {
            let obj = res.data.obj;
            this.ploughList = obj.list;
            this.headUrl = obj.headUrl;
            this.nickName = obj.nickName;
            this.stealSource=obj.stealSource;
            this.showNotice = true;
            this.isHarvestAll = obj.list.some(t => t.plantStatus === 2);
          } else {
            if (res.data.resultCode == 3015 || res.data.resultCode == 1000) {
              //无菜可偷 清掉上次用户的偷菜信息
              this.ploughList = [{}, {}, {}, {}, {}, {}, {}, {}, {}];
              this.headUrl = "";
              this.nickName = "";
              this.showNotice = false;
            }
            this.$toast(res.data.msg, { duration: 3500 });
            console.log(res.data);
          }
        })
        .catch(err => {
          this.$toast(err, { duration: 3500 });
          console.log(err);
        });
    },
    plant(obj) {//收获
    // this.$refs.Toucai.show("", '偷菜机会不足', null, null, 1);
    // return
     this.isSuccess=-1
      this.$com.bottonAudioPlay();
      let {blockId,userid}=obj
      this.obj=obj
      getElsePLoughPlantApi(blockId,userid,this.stealSource)
        .then(res => {
          if (res.data.resultCode == 0) {
             window.redBagDialogDismiss = this.exit;
            this.isSuccess=userid//消耗偷菜次数、通知客户端刷新当前用户
            let obj = res.data.obj;
            var { rewardVal, type } = obj;
            this.rewardVal = rewardVal;
            this.type = type;
            if (type == 1) {
              //奖励类型：1 金币 2 红包券
              this.$refs.Toucai.show(this.nickName, rewardVal, 1, 1);
              obj.gameUserLvConfig && this.getGameLvConfigHandler(obj.gameUserLvConfig);
              this.$store.commit("farmGame/myInfoChangeUpdate"); //更新个人信息
              this.$button_click("steal_gain", type, "金币", rewardVal);
            } else if (type == 2) {
              // this.$refs.RedBag.show();//v1.0.6去掉了
              //  this.$refs.Toucai.show(this.nickName,rewardVal, 2, 1);//1.0.8不要了
               this.rewardFn(type)//调用发放奖励接口
               this.$store.commit("farmGame/myInfoChangeUpdate"); //更新个人信息
               this.$button_click("steal_gain", 7, "红包券", rewardVal);
                this.$com.showRedBagDialog( '偷菜奖励',rewardVal,null,'')
            }
          } else if (res.data.resultCode == 3025) {
            this.$refs.Toucai.show("","求求你了，再偷就没有家底了！", null, null
            );
          } else if (res.data.resultCode == 3024) {//偷菜机会不足
            this.$refs.Toucai.show("", res.data.msg, null, null, 1);
          } else {
            let isBgAudio = localStorage.getItem("BgAudio");
            if (res.data.resultCode == 3014 && isBgAudio !== "false")
            this.isSuccess=userid//消耗偷菜次数、通知客户端刷新当前用户
              this.$refs.bark.play(); //有狗粮播放音效
            this.$refs.Toucai.show(this.nickName, res.data.msg, null, null);
          }
          if(res.data.resultCode == 3011){//被人抢先一步
             this.isSuccess=userid//消耗偷菜次数、通知客户端刷新当前用户
          }
        })
        .catch(err => {
          console.log(err);
          this.$refs.Toucai.show(this.nickName, err, null, null);
        });
    },
    getGameLvConfigHandler(gameUserLvConfig) {
      //升级弹窗的显示数据
      this.gameUserLvConfig = {
        source: "gameUserLvConfig",
        ...gameUserLvConfig,
        isShowVideo: 0,
        title: "升级奖励",
        des: `成功晋级LV.${this.$store.state.farmGame.myInfo.userGrade + 1}`
      };
    },
    reward(type) {
      //红包券    type:1普通领取   2：20倍弹窗
      if (type == 1) {
        this.rewardFn(type);
      } else {
        showRewardAd("PLANT_RAWARD_RED_ADID", this.rewardFn, null); //播放激励视频
      }
    },
    rewardFn(type) {
      type = type || 2;
      let {blockId,userid}=this.obj
      ElseHarvestRewardApi(blockId,this.rewardVal,type,userid)
        .then(res => {
          if (res.data.resultCode == 0) {
            let obj = res.data.obj;
            // this.$nativeBridge.handler(
            //   "showRedBagDialog1030",
            //   true,
            //   "红包券奖励",
            //   obj.rewardVal,
            //   "",
            //   ""
            // );
            // this.$refs.Toucai.show(this.nickName, obj.rewardVal, 2, 1);
            obj.gameUserLvConfig &&
              this.getGameLvConfigHandler(obj.gameUserLvConfig);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getPlantImg(t) {
      switch (t.plantStatus) {
        case 0:
          return t.seedlingImg;
        case 1:
          return t.growthImg;
        case 2:
          return t.matureImg;
        default:
          return t.seedlingImg;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.userInfo {
  position: fixed;
  max-width: 6rem;
  height: 1.06rem;
  background: url("~@/static/img/activity/game/toucai_left.png")
    no-repeat;
  background-size: 100% 100%;
  top: 0.76rem;
  left: 0;
  display: flex;
  align-items: center;
  padding-right: 0.2rem;

  img {
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    margin-right: 0.12rem;
    margin-left: 0.2rem;
  }
  .name {
    max-width: 3.6rem;
    text-align: center;
    color: #552620;
    span {
      display: inline-block;
      max-width: 2.5rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
  }
}

.notice {
  position: fixed;
  width: 4.2rem;
  height: 0.4rem;
  border-radius: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 2.3rem;
  left: 50%;
  transform: translate(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  font-size: 0.24rem;
}

.ploughBg {
  height: 100vh;
  width: 7.5rem;
  background: url("/static/img/farmGame/plantBg.png") no-repeat;
  background-size: 100%;
  background-position: center bottom;
  position: fixed;
  bottom: 0;
  z-index: 999;
  overflow: hidden;
}

.ploughBox {
  .container {
    .plough {
      .harvest {
        position: absolute;
        height: 0.77rem;
        width: 0.8rem;
        background: url("~@/static/img/farmGame/harvest.png")
          no-repeat;
        background-size: cover;
        left: -0.2rem;
        top: -0.38rem;
        z-index: 21;
        animation: float_up_and_down 1s infinite ease-in-out;
      }
    }
  }
}
// .list_icon {
//   position: fixed;
//   width: 3rem;
//   display: flex;
//   justify-content: space-between;
//   bottom: 0.5rem;
//   left: 50%;
//   z-index: 20;
//   transform: translateX(-50%);

// }
.close {
  position: fixed;
  left: 0.3rem;
  bottom: 0.3rem;
  width: 1.2rem;
  height: 1.2rem;
}
.isHarvest {
  position: fixed;
  left: 1.6rem;
  bottom: 2rem;
  width: 1.2rem;
  height: 1.2rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.pointer {
  position: fixed;
  z-index: 10;
  left: 2.1rem;
  bottom: 1.3rem;
  width: 0.77rem;
  height: 0.97rem;
  animation: hand_scale 1s infinite;
}
.hand_light1 {
  position: fixed;
  left: 1.9rem;
  bottom: 1.8rem;
  width: 0.64rem;
  height: 0.64rem;
  animation: hand_light 1s 0.5s infinite;
}

@keyframes float_up_and_down {
  0% {
    transform: translate(0px) rotateZ(-5deg) skew(47deg, -27deg) scale(0.8, 1.1);
  }

  50% {
    transform: translate(-0.2rem, -0.14rem) rotateZ(-5deg) skew(47deg, -27deg)
      scale(0.8, 1.1);
  }

  100% {
    transform: translate(0px) rotateZ(-5deg) skew(47deg, -27deg) scale(0.8, 1.1);
  }
}
</style>
