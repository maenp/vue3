<template>
  <div class="main" ref="main">
    <!-- 个人信息 -->
    <div class="myInfo" @click="toNativePageHandler($event, 'user')">
      <div class='top'>
        <img class='headImg' :src="myInfoX.headImg" alt="">
        <div class="value">
          <div class="gold">
            <img src='/static/img/activity/game/main_gold.png'>
            {{(myInfoX.gold ||0) | num}}</div>
          <div class="tili">
            <img src='/static/img/activity/game/main_value.png'>
            {{myInfoX.strength ||0}}/{{myInfoX.maxStrength ||0}}</div>

        </div>
      </div>
      <Progress ref='Progress' :strength='myInfoX.percentage*100 || 0' :maxStrength='100'></Progress>
    </div>
    <!-- 狗粮 -->
    <div :class="['dogFood',{'dogFood_s':petInfo.power==0}]" @click="openNativeBoxHandler('dog')">
      <div class='bar'>
        <div v-show='petInfo.power'>
          <img v-for='(item,index) in petInfo.power' :key="index" src="/static/img/activity/game/main_gouliang.png" alt="">
        </div>
        <div v-show='petInfo.power1'>
          <img v-for='(item,index) in petInfo.power1' :key="index" src="/static/img/activity/game/main_gouliang.png" alt="">
        </div>
      </div>
      <img src="/static/img/activity/game/main_dog.png" alt="">
    </div>
    <div class="list_icon">
      <!-- 提现 -->
      <div v-if='!nativeBridge.iosCheck' class="cash" @click="toNativePageHandler($event, 'cash')">
      </div>
      <div v-if='!nativeBridge.iosCheck' class='cash_v' @click="toNativePageHandler($event, 'cash')"> {{myInfoX.regBagVal || 0}}
        <img src="/static/img/activity/game/main_redBag_btn.png" alt="">
      </div>

      <!-- 动态消息 -->
      <div class="notice" @click="openNativeBoxHandler('notice')">
        <img v-show='notice_flag&&(MessageObj.information.length > 0||MessageObj.mine.length > 0)' src="/static/img/activity/game/gantanhao.png">
      </div>

      <!-- 签到 -->
      <!-- <div v-show='!myInfoX.isSign' class="sign" @click="openNativeBoxHandler('sign')" /> -->

    </div>
    <!-- 攻略按钮  ios审核模式或v1.0.6的不展示 -->
    <div class="method" v-if='(!nativeBridge.iosCheck)&&($com.versionName()>=1061)' @click="openNativeBoxHandler('gonglue')">
      玩法攻略
      <img src='/static/img/activity/game/gonglue.png' />
    </div>
    <!-- 底部icon -->
    <div class="list_icon2">
      <!-- 种植 -->
      <div class="plant" @click="PlantBoxHandler()" />
      <!-- 收获 -->
      <!-- <div class='shouhuo' @click="onPloughHandler('changeHarvest')" :style="isHarvest&&isHarvestAllX?'background-image:url(/static/img/activity/game/mian_shouhuo_btn0.png)':''" /> -->

      <!-- 好友/偷菜 -->
      <div class="myFriends" v-if='$com.versionName()>=1050' @click="openNativeBoxHandler('friends')"></div>
      <!-- 邀请好友 -->
      <!-- <div v-if='$com.versionName()>=1071' class="invite" @click="openNativeBoxHandler('invite')"></div> -->
      <!-- 转盘 -->
      <!-- <div v-if='!nativeBridge.iosCheck' class="turntable" @click="openNativeBoxHandler('turn')" /> -->
      <!-- 商店 -->
      <!-- <div  class="invite" @click="openNativeBoxHandler('shop')">
        <div class="label">金币换优惠券</div> -->
        <!-- <div class="label">金币抵{{goldTomoney}}</div> -->
      <!-- </div> -->
      <!-- <router-link to="/shop" tag="div" class="invite"></router-link> -->
      <!-- 任务 -->
      <!-- <div class="task"
        @click="toNativePageHandler($event,'task')"></div> -->
      <!-- 福利 -->
      <!-- <div class="welfare" @click="toNativePageHandler($event,'task')">
        <div class="label">领取1元</div>
      </div> -->
      <!-- ios审核模式，展示我的入口 -->
      <div v-if='nativeBridge.iosCheck' class='ios_to_my' @click="toNativePageHandler($event, 'user')"></div>
    </div>

    <TurnTable ref="TurnTable" @initInfo='initInfo' @get_myInfo='get_myInfo' @getMyPets='getMyPets'></TurnTable>
    <Notice ref="Notice" @notice_flag_fn='notice_flag_fn'></Notice>
    <!-- 奖励 -->
    <!-- <div v-if='!nativeBridge.iosCheck' class="rewards" @click="openNativeBoxHandler('award')">
      <img class='hand_light' v-show='myInfoX.isCan' src="/static/img/farmGame/hand_light.png" alt="">
      <img class='hand' v-show='myInfoX.isCan' src="/static/img/farmGame/hand.png" alt="">
    </div> -->
    <!-- 好友 -->
    <Friends ref='Friends' @getMessage='getMessage' @openNativeBoxHandler='openNativeBoxHandler'></Friends>
    <!-- 种植弹窗 -->
    <PlantBox ref="plantBox" @to_turnTable="openNativeBoxHandler" @guidePopFn='guidePopFn' />

    <!-- 土地 -->
    <Plough ref="Plough" :isHarvest="isHarvest" :showDog='showDog' @PlantBoxHandler="PlantBoxHandler" @PurseAnimation="PurseAnimation" @PlantHarvest="PlantHarvestHandler" @setHarvest='setHarvest' @guidePopFn='guidePopFn' />
    <PurseAnim ref="PurseAnim" />
    <Toucai ref='Toucai'></Toucai>
    <RedBag ref='RedBag' @ploughShowRewardAd="showRewardAdHandler"></RedBag>
    <!-- 计时奖励 -->
    <TimeAward ref="TimeAward" @PlantHarvest="PlantHarvestHandler" />

    <!-- 气球 -->
    <Balloon ref='Balloon' @PlantHarvest="PlantHarvestHandler"></Balloon>
    <!-- 升级弹窗 -->
    <MessageBox ref="MessageBox" @ploughShowRewardAd="showRewardAdHandler" />
    <!-- 引导弹窗 弹窗 -->
    <GuidePop ref='GuidePop' @guidePopBtn='guidePopBtn'></GuidePop>
    <audio preload="auto" id="butAudio" :src="require('./../../../static/music/farmGame/button_audio.mp3')" type="audio/mpeg"></audio>
    <NewGuide v-if="showNewGuide" @PlantBoxHandler="PlantBoxHandler" @showGuide="showGuideHandler" />
  </div>
</template>

<script>
import $ from "jquery";
import Notice from "../../components/activity/game/Notice.vue"; //动态消息
import TurnTable from "../../components/activity/game/TurnTable.vue"; //转盘
import Progress from "../../components/activity/game/Progress.vue"; //体力值进度
import Toucai from "../../components/activity/game/Toucai.vue"; //偷菜
import RedBag from "../../components/activity/game/RedBag.vue"; //红包
import Friends from "../../components/activity/game/Friends.vue"; //好友列表
import Balloon from "../../components/activity/game/Balloon"; //气球
import GuidePop from "../../components/activity/game/GuidePop"; //引导弹窗
import { harvestRewardApi } from "./../../api";
import { showRewardAd } from "./../../api/getVideoAdId";
import {
  PlantBox, //种植弹窗
  Plough, //土地
  TimeAward, //计时
  MessageBox, //公共弹窗
  PurseAnim, //收获金币动画
  NewGuide //新人引导
} from "./../../components/farmGame";
import {mapState} from 'vuex'
import * as $com from './../../util/common'
import nativeBridge from './../../util/nativeBridge'
export default {
  name:'game',
  setup(){
    return{
      nativeBridge,
      $com
    }
  },
  data() {
    return {
      notice_flag: true, //动态 新动态标识，刚进页面-显示，关闭动态弹窗，不显示。重新进来再显示
      petInfo: { power: 0 }, //宠物信息
      MessageObj: { information: [], mine: [] },
      showNewGuide: false,
      isHarvest: false,
      showDog: false,
    };
  },
  components: {
    Plough,
    PlantBox,
    TimeAward,
    MessageBox,
    PurseAnim,
    NewGuide,

    Notice,
    TurnTable,
    Progress,
    Toucai,
    RedBag,
    Friends,
    Balloon,
    GuidePop
  },
  computed: {
    myInfoChangeX: {
      get() {
        return this.$store.state.myInfoChange;
      }
    },
    myInfoX: {
      get() {
        return this.$store.state.myInfo;
      }
    },
    isHarvestAllX() {
      let isHarvestAll = this.$store.state.farmGame.isHarvestAll;
      if (!isHarvestAll && this.isHarvest) this.isHarvest = false;
      return isHarvestAll;
    },
    goldTomoney(){
      let money=Math.round(this.myInfoX.gold/this.$store.state.shop.bRate)
      if(money>1){
        return money+'元'
      }else{
        return '现金'
      }
    },
  },
  watch: {
    myInfoChangeX(sort) {
      sort = sort.slice(0, sort.indexOf("-"));
      this.updateInfoHandler(sort);
    },
  },
  inject: ["reload"],
  created() {
    this.getToken();
  },
  activated(){
    this.Observer.$emit('cashBox')
  },
  mounted() {
    window.resume = this.reload; //登录后刷新页面
    window.updateH5Info = this.updateInfoHandler;
    window.signResult = this.get_myInfo; //签到成功调用个人信息接口  result: 0成功 1失败
    window.showGuide = this.showGuideHandler;
    window.goElsePlough = this.goElsePloughHandler;
  },
  methods: {
    goElsePloughHandler(source, id) {
      //进入偷菜页面
      this.$refs.Friends.go(source, id);
      // this.$router.push('elsePlough')
    },
    guidePopFn(obj) {
      //展示引导弹窗
      if (obj.type == 1) {
        //土地扩建
        obj.title = "土地扩建";
        obj.des = "观看视频后可在该土地种植";
        obj.btnText = "看视频扩建";
      } else if (obj.type == 2) {
        //去大转盘
        obj.title = "金币不足";
        obj.des = "玩转盘可获得大量金币噢！";
        obj.btnText = "去转盘";
      }
      this.$refs.GuidePop.show(obj);
    },
    guidePopBtn(obj) {
      //引导弹窗的关闭按钮
      console.log(obj.type);
      if (obj.type == 1) {
        var zulinStatus = false;
        //土地扩建弹窗，关闭按钮触发
        showRewardAd(
          "SET_LEASEBLOCK_ADID",
          async () => {
            zulinStatus = await this.$store.dispatch(
              "farmGame/setLeaseBlock",
              obj.blockId
            );
            this.$button_click("lease");
          },
          null,
          () => {
            if (zulinStatus) {
              this.$toast("扩建成功");
              zulinStatus = false;
            }
          }
        ); //播放激励视频
      } else if (obj.type == 2) {
        this.$button_click("turn");
        this.$refs.TurnTable.show(this.token); //去大转盘
      }
    },
    updateInfoHandler(sort) {
      if (typeof sort !== "string") sort += "";
      if (sort.indexOf("1") > -1) this.get_myInfo(); //更新个人信息
      if (sort.indexOf("2") > -1) this.getMyPets(); //更新宠物
      if (sort.indexOf("3") > -1) this.$store.dispatch("farmGame/getPlantInfo"); //更新土地
      if (sort.indexOf("4") > -1)
        this.$store.dispatch("farmGame/getPloughInfo"); //更新种子化肥
      if (sort.indexOf("5") > -1) this.getToken(); //全部更新
      if (sort.indexOf("6") > -1) this.getMessage(); //更新动态
    },
    onPloughHandler(type) {
      //传递土地事件
      if (type === "changeHarvest") {
        //收获开关
        if (!this.isLogin()) return;
        if (!this.isHarvest) this.$button_click("harvest");
        if (this.isHarvestAllX || this.isHarvest) {
          //有可收获的作物才能打开
          this.isHarvest = !this.isHarvest;
        } else {
          this.$toast("无成熟作物~");
        }
      }
    },
    setHarvest(status) {
      if (this.isHarvest !== status) this.isHarvest = status;
    },
    showGuideHandler() {
      //开启新人引导
      this.showNewGuide = !this.showNewGuide;
      // localStorage.setItem('firstPlant',this.res.data.obj.id)
      // this.prototype.firstPlant=true

      this.$store.commit("farmGame/setPloughTopUpdate", false); //关闭种植弹窗
      this.Observer.$once(
        "newGuideHarvest",
        this.$refs.Plough.PlantHarvestHandler
      );
    },
    PurseAnimation(e, rewardVal) {
      //开启收获金币动画
      this.$refs.PurseAnim.show(e, rewardVal);
    },
    showRewardAdHandler(noVideo, type) {;//收获红包弹窗点击视频 回调

      let adPlayComplete = boxShow => {;//收获视频 红包奖励
        let { blockId, rewardVal } = this.rewardInfo;
        harvestRewardApi(blockId, rewardVal, type).then(({ data }) => {
          if (data.resultCode == 0) {
            let obj = data.obj;
            if (!(boxShow === 1)) {
              //只有首次收获不弹窗
              this.PlantHarvestHandler({
                source: "ploughAfter",
                redbag: obj.rewardVal,
                isShowVideo: 0,
                type: 2,
                title: "收割奖励"
              });
            }
            if (obj.gameUserLvConfig) {
              //升级了
              this.PlantHarvestHandler({
                source: "gameUserLvConfig",
                ...obj.gameUserLvConfig,
                isShowVideo: 0,
                title: "升级奖励",
                des: `成功晋级LV.${this.$store.state.farmGame.myInfo.userGrade +
                  1}`
              });
            }
            this.$store.dispatch("farmGame/getPlantInfo");
            this.$store.commit("farmGame/myInfoChangeUpdate"); //更新个人信息
            this.$button_click("gain", 7, "红包券", obj.rewardVal);
          }
        });
      };
      if (noVideo) {
        //首次收获 ios审核 不看视频
        adPlayComplete(noVideo);
        return;
      }
      if (type == 1) {
        //1倍奖励
        adPlayComplete();
      } else if (type == 2) {
        //20倍奖励
        showRewardAd(
          "PLANT_RAWARD_RED_ADID",
          adPlayComplete,
          () => {
            this.showRewardAdHandler(null, 1);
          },
          adPlay => {
            if (!adPlay) this.showRewardAdHandler(null, 1);
          }
        ); //播放激励视频
      }
    },
    PlantHarvestHandler(rewardInfo, fn) {
      let source = rewardInfo.source;
      if (source === "plough") {
        //收获红包券 打开红包弹窗
        this.rewardInfo = rewardInfo;
        if (rewardInfo.noVideo) {
          //首次收获 不看视频
          this.showRewardAdHandler(1, 2);
        } else if (nativeBridge.iosCheck) {
          //ios审核模式 不看视频
          this.showRewardAdHandler(2, 2);
        } else {
          // if (this.$com.versionName() >= 1080) {;//收获红包使用客户端弹窗  2020-09-08；   不使用客户端弹窗   2020-09-11；
          //   this.$refs.MessageBox.show(rewardInfo);
          // } else {
            this.$refs.RedBag.show(source);
          // }
        }
      } else if (source === "gameUserLvConfig") {
        //升级弹窗
        this.$refs.MessageBox.show(rewardInfo);
        this.$store.dispatch("farmGame/getPloughInfo");
      } else if (source === "timeAward" || source === "balloonAward") {
        //计时奖励弹窗||气球奖励
        this.$refs.MessageBox.show(rewardInfo, fn);
      }else if (source === "ploughAfter") {
        this.$refs.MessageBox.show(rewardInfo);
      }
    },
    // goMiddleHandler() {
    //   //定位初始界面位置
    //   let main = this.$refs.main;
    //   main.scrollLeft = (main.scrollWidth - main.clientWidth) / 2;
    // },
    PlantBoxHandler(plantBoxId, source) {
      //打开种植
      this.$com.bottonAudioPlay();
      if (!this.isLogin()) return;
      this.$refs.plantBox.init(plantBoxId, source);
      this.$button_click("plant");
    },
    async getToken() {
      // this.$store.dispatch("shop/getShopTopListHandler", {//获取金币汇率
      //   page_no: 1
      // });
      this.token = await $com.getToken();
      this.res = await this.$com.isTourist(this, this.token); //获取用户信息
      this.if_first_time = this.res.data.obj.if_first_time; //新老用户
      this.$store.dispatch("farmGame/getPlantInfo", {
        token: this.token,
        userId: this.res.data.obj.id,
        if_first_time: this.if_first_time
      });
      this.initInfo();

      // this.$refs.Notice.show(this.token)
      // this.$refs.TurnTable.show(this.token);
    },
    initInfo() {
      //初始化信息
      this.getBalloonConfig(); //气球配置
      this.get_myInfo(); //个人信息
      this.getMyPets(); // 宠物模块
      this.getMessage(); //动态消息
      this.showDog = true; //初始化狗
      // if (this.$com.versionName() >= 1081) { 
      //   this.getTuiAInfo()//推呀信息
      // }
    },

    getBalloonConfig() {
      //气球配置
      // this.$refs.Balloon.getBalloonConfig(this.token);
    },
    getMessage() {
      // 1.0.7 不要通知的角标  接口请求放到弹窗里
      return;
      this.$http
        .post("/gameDynamicMess/getMessage?token=" + this.token)
        .then(res => {
          if (res.data.resultCode == 0) {
            this.MessageObj = res.data.obj;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getMyPets() {
      // 宠物模块
      this.$http("/game/pets/getMyPets", {
        params: {
          token: this.token
        }
      })
        .then(res => {
          if (res.data.resultCode == 0) {
            this.petInfo = res.data.obj;
            if (this.petInfo.power > 3) {
              this.petInfo.power1 = this.petInfo.power - 3;
            } else {
              this.petInfo.power1 = 0;
            }
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    notice_flag_fn() {
      this.notice_flag = false;
    },
    get_myInfo(n) {
      //个人信息
      if (n == 1) return; //签到失败不调用
      this.getInfoTimer && this.clearGetInfoTimer();
      this.getInfoTimer = setTimeout(_ => {
        this.clearGetInfoTimer();
        this.get_myInfoHandler();
      }, 200);
    },
    clearGetInfoTimer() {
      clearTimeout(this.getInfoTimer);
      this.getInfoTimer = null;
    },
    get_myInfoHandler() {
      this.$http
        .post("/personalInformation/myInfo?token=" + this.token)
        .then(res => {
          if (res.data.resultCode == 0) {
            let obj = res.data.obj;
            this.$store.commit("farmGame/myInfoUpdate", obj);
            obj.userGrade && this.$refs.Progress.show(obj.userGrade); //展示等级
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toNativePageHandler(e, pageName) {
      //去原生页面
      this.$com.bottonAudioPlay();
      if (!this.isLogin()) return;
      let pageUrl;
      switch (pageName) {
        case "task": //去任务
          pageUrl = "farmgame://task_list?Login=1";
          break;
        case "cash": //去提现
          pageUrl = "farmgame://wallet_forward?Login=1";
          break;
        case "user": //去个人中心
          pageUrl = "farmgame://user_center?Login=1";
          break;
        default:
          break;
      }
      this.$button_click(pageName);
      this.nativeBridge.handler("toNativePage", true, pageUrl);
    },
    openNativeBoxHandler(boxName) {
      //打开弹窗
      this.$com.bottonAudioPlay();
      if (!this.isLogin()) return;
      switch (boxName) {
        case "sign": //签到
          this.nativeBridge.handler("signInPop", true);
          break;
        case "award": //首次奖励
          this.nativeBridge.handler("showFirstAward", true);
          break;
        case "notice": //动态
          this.$refs.Notice.show(this.token);
          break;
        case "friends": //好友/商店
          this.nativeBridge.handler("getFriendsList", true);
          // this.$refs.Friends.show(this.token);
          break;
        case "turn": //大转盘
          this.$refs.TurnTable.show(this.token);
          break;
        case "dog": //点击小狗
          this.nativeBridge.handler("onDogClick", true);
          break;
        case "gonglue": //攻略
          this.nativeBridge.handler("onGongLue", true);
          break;
        case "invite": //邀请好友
          this.nativeBridge.handler("jumpToInviteHome1071", true);
          break;
        case "shop": //去商店
          this.$router.push('/shop')
          break;

        default:
          break;
      }
      this.$button_click(boxName);
    },
    isLogin() {
      return this.$com.isLogin();
    }
  }
};
</script>
<style lang="scss" scoped>
.main {
  height: 100vh;
  width: 100vw;
  /* overflow: scroll; */
  background-color: #66d038;
  /* background-size: 100%; */
}

/* 个人信息 */
.myInfo {
  position: fixed;
  width: 2.94rem;
  height: 1.37rem;
  top: 0.43rem;
  left: -0.04rem;
  background: url("/static/img/activity/game/main_left.png") no-repeat;
  background-size: 100% 100%;
  padding: 0.05rem;
  z-index: 2;
  .top {
    display: flex;
    align-items: center;
    width: 2.94rem;
    height: 1.06rem;
    .value {
      color: #552620;
      font-size: 0.3rem;
      font-weight: bold;
      div {
        display: flex;
        align-items: center;
        width: 1.6rem;
        height: 0.38rem;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 0.19rem;
        img {
          margin-left: 0.06rem;
          margin-right: 0.1rem;
        }
      }
      .gold {
        img {
          width: 0.32rem;
          height: 0.32rem;
        }
      }
      .tili {
        margin-top: 0.08rem;
        img {
          width: 0.27rem;
          height: 0.34rem;
        }
      }
    }
    .headImg {
      width: 0.9rem;
      height: 0.9rem;
      margin-right: 0.1rem;
      margin-left: 0.2rem;
      border-radius: 50%;
    }
  }
}

/* 狗粮 */
.dogFood {
  position: fixed;
  width: 2.15rem;
  height: 1.06rem;
  top: 0.43rem;
  right: 0;
  display: flex;
  // flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("/static/img/activity/game/main_right.png")
    no-repeat;
  background-size: cover;
  z-index: 2;

  & > img {
    width: 0.9rem;
    height: 0.9rem;
    margin-left: 0.03rem;
  }

  div {
    line-height: 0.3rem;
    font-size: 0.24rem;
    img {
      width: 0.25rem;
      height: 0.32rem;
      margin-top: 0.02rem;
      &:first-child {
        margin-left: 0.1rem;
      }
    }
  }
  .bar {
    div {
      width: 0.98rem;
      height: 0.36rem;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(255, 255, 255, 1);
      border-radius: 0.18rem;
      &:last-child {
        margin-top: 0.06rem;
      }
    }
  }
}
.dogFood_s {
  width: 1.2rem;
}
/* 奖励 */
.rewards {
  position: fixed;
  width: 2.97rem;

  height: 1.42rem;
  top: 1.8rem;
  right: 0;
  background: url("/static/img/activity/game/main_rewards_btn.png") no-repeat;
  background-size: cover;
  z-index: 10;
}

// 左部icon
.list_icon {
  position: fixed;
  top: 2.09rem;
  left: 0.23rem;
  z-index: 10;
  .cash,
  .notice,
  .sign,
  .myFriends {
    width: 1.2rem;
    height: 1.2rem;
    margin-top: 0.17rem;
  }
  /* 提现 */
  .cash {
    position: relative;
    margin-top: 0;
    z-index: 10;
    background: url("/static/img/activity/game/main_cash_btn.png") no-repeat;
  }
  .cash_v {
    position: absolute;
    z-index: 9;
    left: 1.05rem;
    top: 0.24rem;
    width: auto;
    height: 0.5rem;
    padding: 0 0 0 0.2rem;
    background: rgba(244, 224, 199, 0.6);
    border-radius: 0 0.25rem 0.25rem 0;
    color: #552620;
    font-size: 0.3rem;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 0.61rem;
      height: 0.5rem;
      margin-left: 0.1rem;
      margin-bottom: 0.04rem;
    }
  }

  /* 动态 */
  .notice {
    position: relative;
    background: url("/static/img/activity/game/main_notice_btn.png") no-repeat;
    img {
      position: absolute;
      top: 0;
      right: 0;
      width: 0.36rem;
      height: 0.36rem;
    }
  }

  /* 签到 */
  .sign {
    background: url("/static/img/activity/game/main_sign_btn.png") no-repeat;
  }

  .cash,
  .notice,
  .sign {
    background-size: cover;
  }
}

// 底部icon
.list_icon2 {
  touch-action: none;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.45rem;
  z-index: 10;
  display: flex;
  align-items: baseline;
  & > div {
    margin-left: 0.2rem;
  }

  .plant {
    margin-left: 0;
    background: url("/static/img/activity/game/main_plant_btn.png") no-repeat;
  }
  /* 好友 */
  .myFriends {
    background: url("/static/img/activity/game/toucai0.png") no-repeat;
  }
  .shouhuo {
    background: url("/static/img/activity/game/mian_shouhuo_btn.png") no-repeat;
  }
  .invite {
    position: relative;
    background: url("/static/img/farmShop/shop_Icon.png") no-repeat;
    /* background: url("/static/img/activity/game/mian_friends.png") no-repeat; */
    .label{
      left: -1rem;
      right: -1rem;
      margin: 0 auto;
      top: -.4rem;
    }
  }
  .ios_to_my {
    background: url("/static/img/activity/game/mian_my_btn.png") no-repeat;
  }
  .welfare {
    position: relative;
    background: url("/static/img/activity/game/mian_welfare_btn.png") no-repeat;
    .label{
      transform-origin: left;
    }
  }
  .label{
    position: absolute;
    top: 0;
    left: 0.3rem;
    z-index: 11;
    background: rgba(255, 8, 8, 1);
    border-radius: 0.16rem;
    width: max-content;
    height: 0.32rem;
    line-height: 0.38rem;
    text-align: center;
    color: #fff;
    font-size: 0.22rem;
    padding:0 .05rem;
    animation: scale 0.8s infinite;
  }
  @keyframes scale {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.2);
    }
  }
  .plant,
  .myFriends,
  .shouhuo,
  .welfare,
  .ios_to_my,
  .invite {
    width: 1.2rem;
    height: 1.2rem;
    background-size: contain;
  }
}

/* 大转盘 */
.turntable {
  position: relative;
  top: -0.16rem;
  width: 1.5rem;
  height: 1.75rem;
}
.turntable::before {
  content: "";
  position: absolute;
  width: 1.5rem;
  height: 1.75rem;
  background: url("/static/img/activity/game/main_turn_btn.png") no-repeat;
  background-size: cover;
  z-index: 10;
  animation: rotate 0.5s linear infinite;
}
.turntable::after {
  content: "";
  height: 0.2rem;
  width: 1.3rem;
  background: #000;
  opacity: 0.2;
  border-radius: 50%;
  position: absolute;
  top: 2rem;
  left: 0.1rem;
  animation: shadow 0.5s linear infinite;
}

@keyframes shadow {
  0%,
  100% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.2);
  }
}

@keyframes rotate {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(0.2rem);
  }
  50% {
    transform: translateY(0.4rem) scale(1.1, 0.9);
  }
  75% {
    transform: translateY(0.2rem);
  }
  100% {
    transform: translateY(0);
  }
}
//攻略
.method {
  color: #552620;
  font-size: 0.26rem;
  font-weight: bold;
  position: fixed;
  z-index: 10;
  right: 0;
  top: 3.4rem;
  /* top: 4.4rem; */
  width: 1.93rem;
  height: 0.48rem;
  line-height: 0.48rem;
  padding-left: 0.2rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-right: 0;
  border-radius: 0.24rem 0px 0px 0.24rem;
  img {
    width: 0.49rem;
    height: 0.51rem;
    margin-top: -0.1rem !important;
  }
}
</style>

