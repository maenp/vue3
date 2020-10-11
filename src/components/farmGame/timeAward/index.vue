<template>
  <div v-if="show" class="timing" @click="getTimeAward">
    {{time|daojishi}}
    <div class="award_icon">
      <img :src='awardIcon' alt='' />
    </div>
  </div>
</template>
<script>
import { daojishi } from "./../../../util/common";
import { getTimeAwardApi } from "./../../../api";
import { showRewardAd } from "./../../../api/getVideoAdId";
export default {
  computed: {
    timeAwardListX: {
      get() {
        return this.$store.state.farmGame.timeAwardList;
      },
      set(val) {
        this.$store.commit("farmGame/timeAwardListUpdate", val);
      }
    }
  },
  filters: {
    daojishi(data) {
      if (data < 1) return "点击领取";
      return data && daojishi(data);
    }
  },
  watch: {
    timeAwardListX(newVal) {
      if (newVal.length === 0) {
        if (this.show) this.show = false;
        return;
      }

      if (!this.show) this.show = true;
      this.daojishiHandler();
    }
  },
  data() {
    return {
      time: 0,
      show: false,
      awardIcon: ""
    };
  },
  created(){
    this.clickTime=0
  },
  methods: {
    daojishiHandler() {
      this.interval && clearInterval(this.interval);
      this.rewardInfo = this.timeAwardListX[0];
      this.awardIcon = this.rewardInfo.icon;
      this.time = this.rewardInfo.time;

      // if(!rewardInfo.id)return //
      this.interval = setInterval(() => {
        if (this.time < 1) {
          this.timeAwardListX[0].time = 0;

          //存储数据
          if (this.$store.state.farmGame.if_first_time !== -1) {
            //未登录不存储
            let timeAward = JSON.parse(localStorage.getItem("timeAward")) || {};
            timeAward[this.$store.state.farmGame.userId] = this.timeAwardListX;
            localStorage.setItem("timeAward", JSON.stringify(timeAward));
            this.timeAwardStorage = timeAward;
          }

          clearInterval(this.interval);
        }
        this.time -= 1;
      }, 1000);
    },
    getTimeAward() { //点击领取
      this.$button_click('time_award_enter')
      if (!this.$com.isLogin())return
      if (this.time > 1) {
        this.$toast("倒计时结束后可得奖励");
        return;
      }
      
      let nowClickTime=new Date().getTime()
      if(nowClickTime-this.clickTime<500)return
      this.clickTime=nowClickTime

      this.$com.bottonAudioPlay();
      let getTimeAwardCallBack;
      let type = this.rewardInfo.type; // 奖品类型，1金币，2种子，3化肥，4宠物食品，5体力，6偷菜，7红包券
      if (type === 7) this.rewardInfo.type = 2; //云龙接口 type=2 时为红包券 这里让数据一致
      if (type === 2 && this.rewardInfo.time > 1) this.rewardInfo.type = 8; // 奖品类型，1金币，2红包券，3化肥，4宠物食品，5体力，6偷菜，8种子
      if (this.rewardInfo.isShowVideo) {;// 是否显示激励视频0不显示1显示 ,
        getTimeAwardCallBack = () => {
          //播放激励视频
          showRewardAd(
            "PLANT_HARVEST_ADID",
            this.getTimeAwardHandler,
            null,
            () => {
              if (this.rewardInfo.isShowVideo && rawardStatus) {
                this.rawardStatus = false;
                this.$toast(
                  `获取奖励 ${this.typeToText()}*` + this.rewardInfo.num
                );
              }
            }
          );
        };
      } else {
        this.getTimeAwardHandler();
        return
      }

      //点击计时奖励不弹窗直接播放视频     2020-09-08 
      getTimeAwardCallBack()

      //弹窗后点击再播放视频     2020-09-08 
      // this.$emit( 
      //   "PlantHarvest",
      //   {
      //     source: "timeAward",
      //     type: this.rewardInfo.type,
      //     redbag: this.rewardInfo.num,
      //     icon: this.rewardInfo.icon,
      //     isShowVideo: this.rewardInfo.isShowVideo,
      //     title: "计时奖励"
      //   },
      //   getTimeAwardCallBack
      // );
    },
    getTimeAwardHandler() {;//领取奖励
      let { id, type } = this.rewardInfo;
      getTimeAwardApi(id).then(({ data }) => {
        if (data.resultCode == 0) {
          this.rawardStatus = true;
          let awardName = this.typeToText();
          if (this.rewardInfo.isShowVideo)
            this.$toast(`获取奖励 ${awardName}*` + this.rewardInfo.num);

          //删除数据
          this.timeAwardStorage[this.$store.state.farmGame.userId].shift();
          localStorage.setItem(
            "timeAward",
            JSON.stringify(this.timeAwardStorage)
          );

          this.updateInfoHandler();
          this.buttonClickHandler(type, awardName, this.rewardInfo.num);
          // if (this.rewardInfo.isShowVideo) {
            this.$emit("PlantHarvest", {
              source: "timeAward",
              type: this.rewardInfo.type,
              redbag: this.rewardInfo.num,
              icon: this.rewardInfo.icon,
              isShowVideo: false,
              title: "计时奖励"
            });
          // }
        }
      });
    },
    buttonClickHandler(type, awardName, num) {
      //埋点
      if (awardName === 2) awardName = 7;
      if (awardName === 8) awardName = 2;
      this.$button_click("time_award", type, awardName, num);
    },
    typeToText() {
      let obj = {
        1: "金币",
        2: "红包券",
        3: "化肥",
        4: "狗粮",
        5: "体力",
        6: "偷菜",
        8: "种子"
      };
      return obj[this.rewardInfo.type];
    },
    updateInfoHandler() {
      let type = this.rewardInfo.type;
      switch (type) {
        case 1:
        case 2:
        case 5:
          this.$store.commit("farmGame/myInfoChangeUpdate"); //更新个人信息
          break;
        case 3:
        case 8:
          this.$store.dispatch("farmGame/getPloughInfo"); //更新种子化肥
          break;
        case 4:
          this.$store.commit("farmGame/myInfoChangeUpdate", 2);
          break;
        default:
          break;
      }
    }
  },

  beforeDestroy() {
    this.interval && clearInterval(this.interval);
    this.interval = null;
  }
};
</script>
<style lang="scss" scoped>
.timing {
  position: fixed;
  top: 2.33rem;
  /* top: 3.4rem; */
  width: 2.05rem;
  right: 0;
  z-index: 10;
  background: rgba(244, 224, 199, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-right: none;
  border-radius: 0.25rem 0 0 0.25rem;
  height: 0.48rem;
  font-size: 0.26rem;
  text-indent: 0.14rem;
  display: flex;
  align-items: center;

  color: #552620;
  font-weight: bold;
  padding-left: 0.1rem;
  padding-top: 0.02rem;
  box-sizing: border-box;
}
.award_icon {
  position: absolute;
  right: 0.2rem;
  bottom: -0.04rem;
  height: 0.63rem;
  width: 0.63rem;
  // background: rgba(255, 255, 255, 0.7) 91% 50% no-repeat;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  img {
    height: 100%;
    width: auto;
    max-width: 100%;
  }
}
</style>
