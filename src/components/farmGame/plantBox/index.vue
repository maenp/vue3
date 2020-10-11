<template>
  <transition name="fade">
    <div class="Plant" v-show="ploughTopX">
      <!-- <div @click='$emit("guidePopFn",{type:2})'>1111</div> -->
      <div class="container">
        <div class="close" @click="closeHandler" />
        <ul class="PlantBox_head">
          <li :class="plantId === t.id ? 'active_li' : ''" v-for="t in plantListX" :key="t.id" @click="clickPlantHandler(t.id)">
            <img :src="plantId === t.id ? t.imgSrc + '.png' : t.imgSrc + '1.png'" alt="" />
          </li>
        </ul>

        <!-- 作物 -->
        <div class="PlantBox_list" ref="plantBox" v-show="plantId===0">
          <ul class="_list">
            <li :class="{'xiyou_li':t.type==2}" v-for="t in plantListX[0].list" :key="t.id" @touchstart="startPlantHandler($event,t)" v-show="plantId||t.type===1||!$nativeBridge.iosCheck">
              <img v-show='t.type==2' src="/static/img/activity/game/xy_light.png" alt="" class="light">
              <img v-show='t.type==2' class="xiyou" src="/static/img/activity/game/xy_label.png" alt="">
              <div class="plantImg" @click="CLICK" :style="'background-image:url(' + t.plantImg + ')'" />
              <div>
                <div class="plantInfo">
                  <!-- 锁定遮罩 -->
                  <div class="locking" v-if="t.lockStatus === 0" @click="toastHandler(t.plantGrade)">
                    <p>{{ 'Lv.'+t.plantGrade}}开启 </p>
                  </div>
                  <!-- 作物等级 -->
                  <div class="LVn" v-show="t.plantGrade >= 0"> {{ t.type===1?'LV.'+t.plantGrade:'稀有'}} </div>

                  <div class="growthPeroid" style="line-height:.28rem;margin-top:.1rem;">
                    成熟时间 : {{ t.growthPeroid / 60 }}分钟
                  </div>
                  <div class="rewardGold" style="line-height:.28rem">收获金币 : {{ t.rewardGold |num}}</div>
                  <div class="probabilityDesc" style="line-height:.28rem">
                    红包概率 : <span>{{ t.probabilityDesc }}</span>
                  </div>
                  <div class="stockNum" v-if="t.type === 2">
                    <span> 拥有:{{ t.stockNum }} </span>
                  </div>
                </div>

                <div class="sellPrice">
                   <!-- ios审核模式，不展示播放按钮 -->
                  <img v-show="t.type === 1" :src="'~@/static/img/farmGame/'+(!$nativeBridge.iosCheck&&plantGold(t)==='看视频'?'play_icon.png':'gold.png')" alt="" />
                  <span :ref="'fzee_btn'+t.id">{{plantGold(t)}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- 化肥 -->
        <div class="PlantBox_list" v-show="plantId===1">
          <ul class="_list">
            <li v-for="t in plantListX[1].list" :key="t.id" @touchstart="startPlantHandler($event,t)" @touchend="endPlantHandler($event, t)">
              <div class="fertilizerImg" :style="'background-image:url(' + t.plantImg + ')'" />

              <div>
                <div class="plantInfo">
                  <div class="stockNum1">数量:{{ t.stockNum }}</div>
                  <div class="acceleratedTime">
                    加速{{ t.acceleratedTime / 60 }}分钟
                  </div>
                </div>
                <div class="sellPrice" :style="(t.stockNum < 1&&t.ifVideoNumLimit===1)?'filter: grayscale(100%)':''">
                  <!-- ios审核模式，不展示播放按钮 -->
                  <img v-show="!$nativeBridge.iosCheck&&t.stockNum < 1&&t.ifVideoNumLimit===0" src="~@/static/img/farmGame/play_icon.png" alt="" />
                  <span :ref="'fzee_btn'+t.id">{{ t.stockNum > 0 ? "加速" : (t.ifVideoNumLimit===0?"点击获取":"明日继续") }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 引导点击种植的手 -->
        <div class="guideHand" v-if='guideHandShow'>
          <img class='hand_light' src="/static/img/farmGame/hand_light.png" alt="">
          <img class='hand' src="/static/img/farmGame/hand.png" alt="">
        </div>

      </div>
    </div>
  </transition>
</template>
<script>
import { getGoldApi } from "./../../../api";
import { showRewardAd } from "./../../../api/getVideoAdId";
export default {
  computed: {
    myInfoX: {
      get() {
        return this.$store.state.farmGame.myInfo;
      }
    },
    plantListX: {
      get() {
        return this.$store.state.farmGame.plantList;
      },
      set(val) {
        return this.$store.commit("farmGame/userIdUpdate", val);
      }
    },
    showFertilizerX: {
      get() {
        return this.$store.state.farmGame.fertilizerId;
      },
      set(val) {
        return this.$store.commit("farmGame/showFertilizer", val);
      }
    },
    ploughTopX: {
      get() {
        return this.$store.state.farmGame.ploughTop;
      },
      set(val) {
        this.$store.commit("farmGame/setPloughTopUpdate", val);
      }
    }
  },
  data() {
    return {
      plantId: 0,
      guideHandShow: false,
      hasVideoNum: false
    };
  },
  watch: {
    ploughTopX(newVal) {
      if (newVal) {
          this.goMiddleHandler();
          // this.$com.tuiya(0)//不展示推呀icon
        }else{
          //  this.$com.tuiya(1)//展示推呀icon
        }      
    }
  },
  methods: {
    goMiddleHandler() {//定位最高等级作物在种植弹窗中间
      let box = this.$refs.plantBox;
      let maxLvPlantIndex = this.$store.state.farmGame.maxLvPlantIndex;
      let maxLvPlant = box.firstElementChild.children[maxLvPlantIndex];
      this.$nextTick(_ => {
        // box.scrollLeft=(box.scrollWidth - box.clientWidth) / 2;
        box.scrollLeft =
          maxLvPlant.offsetLeft +
          maxLvPlant.clientWidth / 2 -
          box.offsetLeft -
          box.clientWidth / 2;
      });
    },
    plantGold(t) {
      this.hasVideoNum = false;
      let str;
      if (t.type === 1) {
        //普通种子
        if (
          this.myInfoX.gold < t.sellPrice &&
          t.lockStatus === 1 &&
          this.$store.state.farmGame.ifUpperLimit === 0
        ) {
          //金币不足&已解锁&有看视频次数
          str = "看视频";
        } else if (
          this.myInfoX.gold < t.sellPrice &&
          t.lockStatus === 1 &&
          this.$store.state.farmGame.ifUpperLimit === 1
        ) {
          // //金币不足&已解锁&没有看视频次数
          str = t.sellPrice;
          this.hasVideoNum = true; //金币不足，视频次数用完，调用弹窗
        } else {
          str = t.sellPrice;
        }
      } else if (t.stockNum > 0) {
        str = "种植";
      } else {
        str = "获取种子";
      }
      return str;
    },
    toastHandler(plantGrade) {
      // this.$toast("升到" + plantGrade + "级才可以种植哦~");
      this.$toast("您的等级不足，快去升级吧");
    },
    CLICK() {
      //清除缓存---------------
      return;
      this.$store.dispatch("farmGame/clearChcheApi");
    },
    init(source, plantBoxId) {
      //暂时只有新人引导才会传plantBoxId
      if (source === "plantTime") {
        //点击计时中的作物选中默认肥料id
        this.showFertilizerX = "default";
        return;
      }
      if (plantBoxId) {
        this.plantId = plantBoxId;
      } else {
        if (this.plantId !== 0) this.plantId = 0; //重置选项卡
      }
      if (!this.ploughTopX) this.ploughTopX = true; //打开动画
      if (this.showFertilizerX) this.showFertilizerX = null; //点击播种清除施肥状态

      if (source === "sowGuide") {//点击土地播种引导icon
        this.goMiddleHandler();
        this.timer = setTimeout(_ => {
          clearTimeout(this.timer);
          this.guideHandShow = true;
          this.timer = setTimeout(_ => {
            clearTimeout(this.timer);
            this.guideHandShow = false;
          }, 3000);
        }, 500);
      }
    },
    closeHandler() {
      this.$com.bottonAudioPlay();
      if (this.showFertilizerX) this.showFertilizerX = null; //关闭清除施肥状态
      this.ploughTopX = false;
    },
    clickPlantHandler(id) {
      //切换  作物/化肥
      this.$com.bottonAudioPlay();
      this.plantId = id;
      if (this.guideHandShow) this.guideHandShow = false;
      if (id === 0 && this.showFertilizerX) this.showFertilizerX = null; //切换作物选项卡清除施肥状态
    },

    startPlantHandler(e, item) {
      //按下
      this.plantElement = e.currentTarget;
      this.plantElement.style.transform = "scale(0.97)";
      this.plantItem = item;

      this.plantElement.addEventListener("touchmove", this.movePlantHandler);
      this.plantElement.addEventListener("touchend", this.endPlantHandler);
    },
    movePlantHandler() {
      //移动
      this.destroyPlantHandler();
      if (this.guideHandShow) this.guideHandShow = false;
    },
    endPlantHandler() {
      //松开
      this.addPlantHandler();
      this.destroyPlantHandler();
    },
    destroyPlantHandler() {
      //销毁
      this.plantElement.style.transform = "scale(1)";
      this.plantElement.removeEventListener("touchmove", this.movePlantHandler);
      this.plantElement.removeEventListener("touchend", this.endPlantHandler);
    },
    addPlantHandler() {
      //点击  作物/化肥
      let item = this.plantItem;
      let { id, stockNum, type, ifVideoNumLimit } = item;
      if (!this.$com.isLogin()) return;
      this.$com.bottonAudioPlay();
      let itemName;
      if (this.plantId === 0) {
        //作物
        if (type === 2 && stockNum <= 0) {
          //稀有作物库存为0 打开转盘
          this.$emit("to_turnTable", "turn");
        } else if (this.plantGold(item) === "看视频") {
          //金币不足
          this.getGoldHandler(id);
        } else if (this.hasVideoNum) {//金币不足看视频次数用完调弹窗
          this.$emit("guidePopFn", { type: 2 });
        } else if (this.$store.state.farmGame.nowSow > -1) {
          //种植埋点
          itemName = this.$refs["fzee_btn" + id][0].innerText;

          //有可种植地块
          this.$store.dispatch("farmGame/addPlantInfo", { plantId: id, type ,itemName});

        } else {
          this.$toast("没位置啦");
        }
      } else {
        //化肥
        if (stockNum > 0) {
          if (this.$store.state.farmGame.isFertilizer) {
            this.showFertilizerX = id;
          } else {
            this.$toast("没有可加速作物，快去种一些吧");
          }
        } else {
          //获取化肥
          if (ifVideoNumLimit === 1) {
            this.$toast("今日肥料加速机会已用完，明日继续");
            return;
          }
          showRewardAd(
            "ADD_FERTILIZER_ADID",
            this.addFertilizer.bind(this, id),
            null,
            () => {
              if (this.addNum) {
                this.$toast("获得 肥料*" + this.addNum);
                this.addNum = 0;
              }
            }
          );
        }
      }
    },
    getGoldHandler(id) {
      //种植作物金币不足看视频获取金币
      let adPlayComplete = () => {
        this.getGoldMsg = null;
        getGoldApi(id).then(({ data }) => {
          this.$store.commit("farmGame/myInfoChangeUpdate", "134");
          if (data.resultCode === "0") {
          } else {
            this.getGoldMsg = data.msg;
            this.$toast(data.msg);
          }
        });
      };
      showRewardAd("PLONTBOX_GET_GOLD_ADID", adPlayComplete, null, () => {
        this.getGoldMsg && this.$toast(this.getGoldMsg);
      });
    },
    async addFertilizer(id) {
      this.addNum = await this.$store.dispatch("farmGame/addFertilizer", id);
    }
  }
};
</script>
<style lang="scss" scoped>
.Plant {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 5.28rem;
  z-index: 10;
  background: url("/static/img/farmGame/ploughBg.png") no-repeat #673922;
  background-size: contain;
  border-radius: 0.68rem 0.68rem 0 0;
}

.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .close {
    position: absolute;
    top: 0.07rem;
    right: 0.35rem;
    height: 0.7rem;
    width: 0.7rem;
    z-index: 3;
  }
  .PlantBox_head {
    height: 0.68rem;
    font-size: 0.4rem;
    position: relative;
    li {
      position: absolute;
      bottom: 0;
      width: 2.46rem;
      height: 0.53rem;
      background: linear-gradient(
        180deg,
        rgba(189, 134, 68, 1) 0%,
        rgba(148, 100, 61, 1) 100%
      );
      color: #efbc87;
      box-shadow: inset 0px -15px 10px -15px #000;
      border-radius: 0.4rem 0.4rem 0px 0px;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: 0.3rem;
        width: 1.52rem;
      }
    }
    li:nth-of-type(1) {
      left: 1.37rem;
    }
    li:nth-of-type(2) {
      right: 1.37rem;
    }
    .active_li {
      color: #fff;
      height: 0.59rem;
      background: linear-gradient(
        180deg,
        rgba(255, 213, 68, 1) 0%,
        rgba(254, 183, 14, 1) 100%
      );
      z-index: 2;
    }
  }
  .PlantBox_list {
    /* touch-action: none; */
    scroll-behavior: smooth;
    flex: 1;
    overflow: scroll;
    margin: 0.22rem 0.2rem 0.32rem 0.19rem;
    display: flex;
    align-items: center;
    ul {
      height: 3.8rem;
      width: max-content;
      display: flex;
      padding: 0 0.13rem 0.04rem 0.13rem;
      li {
        flex-shrink: 0;
        margin-left: 0.1rem;
        /* padding: 0.17rem 0 0; */
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.12rem;
        position: relative;
        box-sizing: border-box;
        width: 2.3rem;
        height: 3.76rem;
        transition: transform 0.3s;
        background: linear-gradient(
          0deg,
          rgba(255, 237, 198, 1),
          rgba(255, 237, 201, 1)
        );
        box-shadow: 0px 0.04rem 0px 0px rgba(255, 189, 118, 1);
        border-radius: 0.16rem;
        .LVn {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 0.15rem 0 0.16rem 0;
          height: 0.32rem;
          min-width: 0.81rem;
          padding: 0 0.05rem;
          background-color: #b28058;
          color: #fff;
          font-size: 0.22rem;
          text-align: center;
        }
        .locking {
          border-radius: 0.16rem;
          position: absolute;
          top: 0;
          bottom: -0.06rem;
          left: 0;
          right: 0;
          z-index: 11;

          background: url("/static/img/farmGame/lock.png") no-repeat
            rgba($color: #000000, $alpha: 0.6) 50% 40%;
          background-size: 1.34rem 1.2rem;
          text-align: center;
          p {
            color: #ffffff;
            padding-top: 2.4rem;
          }
        }
        .fertilizerImg {
          width: 2rem;
          height: 1.76rem;
          background: no-repeat;
          background-size: 100% 100%;
        }
        .plantImg {
          margin-top: 0.28rem;
          width: 1.7rem;
          height: 2rem;
          background-repeat: no-repeat;
          background-size: cover;
          // background: no-repeat 0.12rem 0.04rem;
          // background-size: 89% 111%;
        }
        .plantInfo {
          margin-top: -0.16rem;
          margin-left: 0.16rem;
          flex: 1;
          font-size: 0.22rem;
          font-weight: bold;
          color: #673922;
          display: flex;
          width: 2.1rem;
          flex-direction: column;
          .stockNum1 {
            margin-top: 0.7rem;
          }
          .probabilityDesc {
            span {
              display: inline-block;
              width: 0.8rem;
            }
          }
        }
        .sellPrice {
          // position: absolute;
          // left: 0.2rem;
          // bottom: 0.1rem;
          margin: 0.1rem auto 0;
          width: 1.9rem;
          height: 0.54rem;
          background: url("~@/static/img/farmGame/sellPrice.png")
            no-repeat;
          background-size: cover;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.24rem;
          padding-bottom: 0.01rem;
          box-sizing: border-box;
          // box-shadow: 0px 3px 2px 0px rgba(53, 150, 55, 1);
          // border-radius: 0.25rem;
          img {
            width: 0.25rem;
            height: 0.26rem;
            margin-right: 0.06rem;
          }
        }
      }
      // 稀有作物
      .xiyou_li {
        height: 3.8rem;
        box-shadow: none;
        background: url("/static/img/activity/game/xy_card.png") no-repeat;
        background-size: cover;
        .light {
          position: absolute;
          z-index: 16;
          top: 0.5rem;
          width: 1.22rem;
          height: 1.59rem;
        }
        .LVn {
          display: none;
        }
        .stockNum {
          position: absolute;
          left: 0;
          top: 0.18rem;
          padding: 0.05rem 0.04rem 0 0.01rem;
          box-sizing: border-box;
          height: 0.36rem;
          background: linear-gradient(
            90deg,
            rgba(0, 111, 130, 1) 0%,
            rgba(52, 222, 171, 1) 100%
          );
          border-radius: 0px 0.16rem 0.16rem 0px;
          font-size: 0.2rem;
          color: #017083;
          border-left: none;
          span {
            background: linear-gradient(
              -90deg,
              rgba(197, 255, 145, 1),
              rgba(66, 230, 139, 1)
            );
            border-radius: 0px 0.13rem 0.13rem 0px;
            display: block;
            box-sizing: border-box;
            height: 0.26rem;
            display: flex;
            align-items: center;
            position: relative;
            left: 0;
            padding: 0.04rem 0.05rem 0;
          }
        }
        .xiyou {
          position: absolute;
          z-index: 13;
          top: 0.16rem;
          right: 0.09rem;
          width: 0.75rem;
          height: 0.64rem;
        }
        .sellPrice {
          background: url("/static/img/activity/game/xy_btn.png") no-repeat;
          background-size: cover;
          span {
            color: #027484;
          }
        }
      }
      li:nth-of-type(1) {
        margin-left: 0;
      }
    }
  }
  .guideHand {
    position: absolute;
    height: 1rem;
    width: 1rem;
    left: 63%;
    transform: translateX(-50%);
    bottom: 0.6rem;
  }
}

.fade-enter,
.fade-leave-to {
  transform: translateY(100%);
}
.fade-enter-active,
.fade-leave-active {
  transition: 0.3s;
}
</style>
