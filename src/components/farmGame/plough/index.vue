<template>
  <div @click="closePloughHandler" closePloug=true :class="[{ ploughBgTop: ploughTopX}, 'ploughBg']">
    <div class="ploughBox">
      <ul class="container">
        <li :class="[{ LeaseBlock: (t.blockStatus===0&&t.ifLeaseBlock&&!t.leaseSurplusTime) }, 'plough']" v-for="t in ploughListX" :key="t.blockId" plough='sowGuide' @click="PlantBoxHandler">
          <!-- 种子图片 -->
          <transition name="fade">
            <img class="plant variant" :src="getPlantImg(t)" v-if="t.blockStatus===1&&getPlantImg(t)" @click.stop="clickPlantHandler(t.plantStatus)" alt="" />
          </transition>
          <!-- 宝箱图片 -->
          <div class="awardBoxClick variant" @click="getBoxRewardHandler($event,t.blockId)" v-show="t.blockStatus==2"></div>
          <transition name="fade">
            <div class="variant awardBox" v-show="t.blockStatus==2">
              <div class="halo"></div>
            </div>
          </transition>
          <!-- 播种指示图片 -->
          <img class="sow variant upDown" v-show="t.sow" plough='sow' src="~@/static/img/farmGame/variant.png" alt="">
          <!-- 收割图片 -->
          <img class="harvest variant upDown" v-show="t.plantStatus===2&&isHarvest" @click="PlantHarvestHandler($event,t.blockId)" src="~@/static/img/farmGame/shouge.png" alt="">
          <!-- 倒计时 -->
          <Daojishi v-if="t.surplusTime" :surplusTime='t.surplusTime' :growthPeriodTime="t.growthPeriodTime" :plantStatus="t.plantStatus" />
          <!-- 施肥 -->
          <img v-if="fertilizerX&&t.surplusTime" @click="setFertilizerHandler(t.blockId)" class="fertilizer variant upDown" :src="'~@/static/img/farmGame/'+(fertilizerX==='video'?'shifei_video.png':'shifei.png')" alt="">
          <!-- 扩建牌子  ios审核模式，不展示播放按钮-->
          <div v-if="t.canLeaseBlock"> 
            <img class="LeaseBlockAd variant" v-if="!$nativeBridge.iosCheck" @click="setLeaseBlockHandler(t.blockId)" src="/static/img/farmGame/lease.png" alt="">
            <img class="LeaseBlockAd variant" v-else @click="setLeaseBlockHandler(t.blockId)" src="/static/img/farmGame/lease_ios.png" alt="">
            </div>
         
          <!-- 扩建地块小闹钟 -->
          <!-- <Clock v-if="t.leaseSurplusTime&&!t.blockStatus" :leaseSurplusTime="t.leaseSurplusTime" /> -->
        </li>
      </ul>
    </div>
    <!-- 田园犬 -->
    <Dog v-if='showDog' />

    <!-- 背景音乐 -->
    <audio id="plough_audio" loop ref="plough_audio" :src="require('@/static/music/farmGame/plough_bg.mp3')" type="audio/mpeg" />
  </div>
</template>
<script>
import {
  harvestPlantApi,
  harvestRewardApi,
  getBoxRewardApi
} from "./../../../api";
// import Dog from "./../dog"; //田园犬
import Daojishi from "./daojishi";
// import Clock from "./clock";
import { showRewardAd } from "./../../../api/getVideoAdId";
import Dog from "../../../components/activity/game/Dog"; //田园犬

export default {
  components: {
    Daojishi,
    // Clock,
    Dog
  },
  props: {
    isHarvest: {
      type: Boolean,
      required: true,
      default: false
    },
    showDog: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    ploughListX: {
      get() {
        return this.$store.state.farmGame.ploughList;
      },
      set(val) {
        this.$store.commit("farmGame/ploughListUpdate", val);
      }
    },
    fertilizerX: {
      get() {
        let fertilizerId = this.$store.state.farmGame.fertilizerId;
        let fertilizer = this.$store.state.farmGame.plantList[1].list[0]; //第一个肥料
        let stockNum = fertilizer.stockNum; //肥料库存
        if (stockNum < 1 && fertilizerId === fertilizer.id) return "video"; //选中的是第一个肥料&&肥料库存为0
        return fertilizerId;
      }
    },
    ploughTopX: {
      get() {
        return this.$store.state.farmGame.ploughTop;
      },
      set(val) {
        this.$store.commit("farmGame/setPloughTopUpdate", val);
      }
    },
    maxLvPlantId(){
      let maxLvPlantIndex = this.$store.state.farmGame.maxLvPlantIndex;
      console.log(maxLvPlantIndex);
      let maxLvPlant=this.$store.state.farmGame.plantList[0].list[maxLvPlantIndex]
      console.log(maxLvPlant);

      let maxLvPlantSellPrice = maxLvPlant.sellPrice;
      let nowGold=this.$store.state.farmGame.myInfo.gold
      if(nowGold>=maxLvPlantSellPrice)return maxLvPlant.id
      return false
    }
  },
  methods: {
    clickPlantHandler(plantStatus) {//点击计时中的作物弹起肥料
      if (plantStatus === 2) {//打开镰刀
        this.$emit("setHarvest", true);
      } else {//施肥
        this.$emit("PlantBoxHandler","plantTime");
      }
    },
    changeBgAudioHandler(param) {//0临时关闭音乐  1播放临时关闭的音乐   3打开背景音乐开关 4关闭背景音乐开关
      if (typeof param !== "number") param = Number(param);
      if (param == 0) {
        this.$com.changeBgAudio("else_plough_audio", param);
        this.$com.changeBgAudio("plough_audio", param);
      } else if (param == 1) {
        this.$com.changeBgAudio("", param);
      } else if (param > 2) {
        this.isBgAudioHandler(param);
      }
    },
    isBgAudioHandler(param) {//背景音乐开关
      let isBgAudio = localStorage.getItem("BgAudio");
      if (
        (isBgAudio === "false" && param === 4) ||
        (isBgAudio !== "false" && param === 3)
      )
        return;
      if (param === 3) {//打开
        localStorage.removeItem("BgAudio");
        this.changeAudioHandler("on");
      } else if (param === 4) {//关闭
        this.changeAudioHandler("off");
        localStorage.setItem("BgAudio", "false");
      }
    },
    initBgAudioHandler() {//初始化背景音乐
      let isBgAudio = localStorage.getItem("BgAudio");
      if (isBgAudio !== "false") {
        this.$refs.plough_audio.play();
        this.Observer.$on("changeAudio", this.changeAudioHandler);
      }
    },
    changeAudioHandler(toggle) {//背景音乐切换
      let isBgAudio = localStorage.getItem("BgAudio");
      if (isBgAudio === "false") return;

      let plough_audio = this.$refs.plough_audio;
      if (!plough_audio) return;

      if (toggle === "on") {
        plough_audio.play();
      } else if (toggle === "off") {
        plough_audio.pause();
      } else {
        if (plough_audio.paused) {
          plough_audio.play();
        } else {
          plough_audio.pause();
        }
      }
    },
    closePloughHandler(e) {//关闭种植弹窗
      if (e.target.getAttribute("closePloug") !== "true") return;
      this.$emit("setHarvest", false); //关闭收割
      if (!this.ploughTopX) return;
      this.ploughTopX = false;
      this.$store.commit("farmGame/showFertilizer", null); //清除施肥状态
    },
    getBoxRewardHandler(e, blockId) {//领取宝箱奖励
      getBoxRewardApi(blockId).then(({ data }) => {
        if (data.resultCode === "0") {
          let obj=data.obj
          if(obj.type===1){//金币奖励
            this.Observer.$emit('messageBox',
            {
              source: "boxReward",
              title: "宝箱奖励",
              type: 1,
              redbag: obj.rewardVal
            })
            this.$button_click("box");

          }else{//消费券奖励
            let commodity=obj.commodityData 
            let money=commodity.label1_money/100
            this.$nativeBridge.handler("showRedBagDialogEgou",true,money,commodity.coupon_click_url)
            this.$button_click("box",8,'优惠券',money);
          }
          this.$store.commit("farmGame/myInfoChangeUpdate", "13");
        } else if (data.resultCode === "3020") {
          this.$store.commit("farmGame/myInfoChangeUpdate", "3");
        }
      });
    },
    setLeaseBlockHandler(blockId) {//扩建
     this.$button_click("lease_enter");
      this.$com.bottonAudioPlay();
      if (!this.$com.isLogin()) return;
      // if(this.$nativeBridge.iosCheck){
        let zulinStatus
        showRewardAd("SET_LEASEBLOCK_ADID",
          async () => {
            zulinStatus = await this.$store.dispatch("farmGame/setLeaseBlock",blockId);
            this.$button_click("lease");
          },
          null,
          () => {
            if (zulinStatus) {
              this.$toast("扩建成功");
              zulinStatus = false;
            }else{
              this.$toast("扩建失败");
            }
          }
        ); //播放激励视频
      // }else{
      //   this.$emit("guidePopFn", { type: 1, blockId }); //type必传  blockId补充参数
      // }

    },

    async addFertilizer(id) {//看视频获取肥料
      this.addNum = await this.$store.dispatch("farmGame/addFertilizer", id);
    },
    setFertilizerHandler(blockId) {//施肥
      this.$com.bottonAudioPlay();
      if (this.fertilizerX === "video") {
        //点击计时中的作物且没有肥料时---点击施肥变为点击看视频获取肥料
        console.log("点击视频");
        showRewardAd(
          "ADD_FERTILIZER_ADID",
          this.addFertilizer.bind(
            this,
            this.$store.state.farmGame.fertilizerId
          ),
          null,
          () => {
            if (this.addNum) {
              this.$toast("获得 肥料*" + this.addNum);
              this.addNum = 0;
            }
          }
        );
        return;
      }
      console.log("点击施肥");
      this.$button_click("shifei");
      this.$store.dispatch("farmGame/setFertilizer", blockId);
    },
    async PlantHarvestHandler(e, blockId) {//收获
      this.$com.bottonAudioPlay();
      let data = await this.$store.dispatch("farmGame/harvestPlant", blockId);
      if (data.resultCode == 0) {
        let obj = data.obj;
        let isFirstDraw=this.$store.state.farmGame.myInfo.firstDraw


        
        if(!isFirstDraw&&this.$com.getVersionNameNumber()>=1050){//首次收获
          console.log(isFirstDraw,'新人奖励');
          this.$nativeBridge.handler("showNewUserRewardDialog105",true);
          if(obj.type === 2){
            this.$emit("PlantHarvest", {
              source: "plough",
              blockId,
              rewardVal: obj.rewardVal,
              noVideo:true
            });
          }
          return
        }


        if (obj.type === 2) {//红包券
          this.$emit("PlantHarvest", {
            blockId,
            rewardVal: obj.rewardVal,
            redbag:Math.ceil(obj.rewardVal*obj.dowReta),//速降后的奖励
            source: "plough",
            isShowVideo:true,
            title:'收割奖励'
          });
        } else {//金币
          if (obj.gameUserLvConfig) {
            this.$emit("PlantHarvest", {
              source: "gameUserLvConfig",
              ...obj.gameUserLvConfig,
              isShowVideo: 0,
              title: "升级奖励",
              des: `成功晋级LV.${this.$store.state.farmGame.myInfo.userGrade + 1}`
            });
          }
          this.$emit("PurseAnimation", e, obj.rewardVal);
          // this.$toast('收获金币*'+obj.rewardVal);
          this.$store.commit("farmGame/myInfoChangeUpdate", 1); //更新个人信息
          this.$button_click("gain", 1, "金币", obj.rewardVal);
        }
      } else if (data.resultCode === "3010") {//已被偷走
        this.$toast(data.msg);
      } else {
        this.$toast(data.msg);
        console.log("收获接口", data.msg);
      }
    },
    getPlantImg(t) {//返回不同阶段作物图片
      switch (t.plantStatus) {
        case 0:
          return t.seedlingImg;
        case 1:
          return t.growthImg;
        case 2:
          return t.matureImg;
        default:
          return t.matureImg;
      }
    },
    PlantBoxHandler(e) { //播种
      let ploughSource= e.target.getAttribute("plough");
      if (!ploughSource) return;

      let maxLvPlantId=this.maxLvPlantId
      if(ploughSource==='sow'&&maxLvPlantId){//点击播种&金币足够
          this.$store.dispatch("farmGame/addPlantInfo", { plantId: maxLvPlantId, type:1});
          //
           this.$button_click("land");
      }else{
        this.$emit("PlantBoxHandler",'sowGuide');
        this.$toast('请选择作物种子~')
      }
    }
  },
  mounted() {
    window.changeBgAudio = this.changeBgAudioHandler;
    this.initBgAudioHandler();
  }
};
</script>
<style lang="scss" scoped>
.ploughBg {
  touch-action: none;

  height: 100vh;
  width: 7.5rem;
  background: url("/static/img/farmGame/plantBg.png") no-repeat;
  background-size: 100%;
  background-position: center bottom;
  position: relative;
  z-index: 1;
  transform: translateY(0);
  overflow: hidden;
  bottom: 0;
  transition: 0.2s;

}
.ploughBgTop {
  transition: 0.5s;

  transform: translateY(-3rem);
}
.ploughBox {
  .container {
    .plough {
      .upDown {
        animation: float_up_and_down 1s infinite ease-in-out;
      }
      .awardBoxClick {
        height: 0.9rem;
        z-index: 21;
      }
      .awardBox {
        z-index: 1;
      }
      .awardBoxClick,
      .awardBox {
        position: absolute;
        height: 0.96rem;
        width: 0.66rem;
        left: 0.06rem;
        top: -0.18rem;
        background: url("/static/img/farmGame/box.png");
        background-size: 100% 100%;
        .halo{
          position: absolute;
        height: 1rem;
        width: 1rem;
        left: -8px;
        top: 8px;
        background: url("/static/img/farmGame/light.png");
        border-radius: 50%;
        background-size: 100% 100%;
        animation: turn 3s linear infinite;
        }
      }
      @keyframes turn {
        0% {
          transform: rotate(0deg);
          opacity: 1;
        }
        50% {
          transform: rotate(180deg);
          opacity: 0.5;
        }
        100% {
          transform: rotate(360deg);
          opacity: 1;
        }
      }
      /* .awardBox::before {
        content: "";
        display: block;
        position: absolute;
        height: 1rem;
        width: 1rem;
        left: -8px;
        top: 8px;
        background: url("/static/img/farmGame/light.png");
        border-radius: 50%;
        background-size: 100% 100%;
        animation: turn 3s linear infinite;
      } */
      /* .awardBox::after {
        content: "";
        display: block;
        position: absolute;
        height: 0.96rem;
        width: 0.66rem;
        background: url("/static/img/farmGame/box.png");
        background-size: 100% 100%;
      } */
      .sow,
      .harvest,
      .fertilizer {
        position: absolute;
        z-index: 21;
        height: 1rem;
        width: 0.55rem;
        left: -0.15rem;
        top: -0.45rem;
      }
      .LeaseBlockAd {
        transform: rotateZ(-5deg) skew(47deg, -27deg) scale(0.8, 1.1);
        position: absolute;
        left: -0.3rem;
        top: -0.44rem;
        height: 1.245rem;
        width: 1.14rem;
        z-index: 20;
      }
    }
  }
  .fade-enter-active {
    animation: fade 0.3s ease;
  }
  @keyframes fade {
    0% {
      transform: scale(0) rotateZ(-11deg) skew(41deg, -21deg) translateY(100%);
    }
    100% {
      transform: scale(1) rotateZ(-11deg) skew(41deg, -21deg) translateY(0%);
    }
  }
}
</style>
