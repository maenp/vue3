<template>
  <div class="balloon" v-if='showFlag'>
    <img class="icon" :src="BalloonConfig.icon" @click='getBalloonReward' alt="">
    <img class='hand_light' src="~@/static/img/farmGame/hand_light.png" @click='getBalloonReward' alt="">
    <img class='hand' src="~@/static/img/farmGame/hand.png" @click='getBalloonReward' alt="">
  </div>
</template>

<script>
import $ from "jquery";
import { showRewardAd } from "@/api/getVideoAdId";
import {http} from '@/util/http'
let duration=30 //动画过渡时间
export default {
  data() {
    return {
      showFlag: true,
      BalloonConfig: {},
    };
  },
  methods: {
    getBalloonConfig() { //气球配置
      http("/gameTimer/getBalloonConfig")
        .then(res => {
          if (res.data.resultCode == 0) {
            this.BalloonConfig = res.data.obj;
            this.balloon_djs();
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    balloon_djs() {
      clearInterval(this.balloon_djs_timer);
      this.balloon_djs_timer = setTimeout(() => {
        this.show();
      }, this.BalloonConfig.time * 1000);
    },
    show() {
      this.showFlag = true;
      this.$nextTick(() => {
        $(".balloon").css("animation-duration", duration + "s");
      });
      clearTimeout(this.timeOut_timer);
      this.timeOut_timer = setTimeout(() => {
        //气球显示的时候没有点击
        this.close();
        this.balloon_djs(); //下一轮气球
      }, duration * 1000);
    },
    getBalloonReward() {
      //点击气球
      this.$com.bottonAudioPlay();
      if (!this.$com.isLogin()) return;

      if (this.$com.versionName() >= 1070) {
        let pageUrl = this.BalloonConfig.url; //互动推链接
        this.$nativeBridge.handler(
          "jumpWebWithClose1070",
          true,
          pageUrl,
          "",
          0,
          0,
          "",
          false
        );
        this.balloon_djs(); //下一轮气球
        this.$button_click("ball");
      } else {
        this.getBalloonReward1();
      }
      this.close(); //调关闭方法
    },
    getBalloonReward1() {
      http("/gameTimer/getBalloonReward", {
        params: {
          id: this.BalloonConfig.id
        }
      })
        .then(res => {
          if (res.data.resultCode == 0) {
            this.balloon_djs(); //下一轮气球

            let { type, num, key } = res.data.obj;
            let getBallonAwardCallBack;
            if (type == 1) {
              //金币  num
              this.$store.commit("farmGame/myInfoChangeUpdate"); //更新个人信息
              this.$button_click("ball", type, "金币", num);
            } else {
              //红包券 key
              type = 2;
              getBallonAwardCallBack = () => {
                showRewardAd(
                  "PLANT_HARVEST_ADID",
                  () => {
                    http(
                      "/gameTimer/balloonAddReward",
                      {
                        params: {
                          key
                        }
                      }
                    ).then(({ data }) => {
                      if (data.resultCode == 0) {
                        this.balloonReward = true;
                        this.$toast(`获取奖励 红包券*` + num, {
                          duration: 1500
                        });
                        this.$store.commit("farmGame/myInfoChangeUpdate"); //更新个人信息
                        this.$button_click("ball", 7, "红包券", num);
                        this.$emit("PlantHarvest", {
                          //第二个弹窗
                          source: "balloonAward",
                          type: type,
                          redbag: num,
                          isShowVideo: false,
                          title: "气球奖励"
                        });
                      }
                    });
                  },
                  null,
                  () => {
                    if (this.balloonReward) {
                      this.$toast(`获取奖励 红包券*` + num);
                      this.balloonReward = false;
                    }
                  }
                ); //播放激励视频
              };
            }
            this.$emit(
              "PlantHarvest",
              {
                source: "balloonAward",
                type: type,
                redbag: num,
                isShowVideo: type === 2 ? true : false,
                title: "气球奖励"
              },
              getBallonAwardCallBack
            );
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    close() {
      this.showFlag = false;
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="stylesheet/scss">
.balloon {
  position: fixed;
  // top: 0.24rem;
  bottom: 7rem;
  left: -1.37rem;
  width: 1.37rem;
  z-index: 99;
  /* animation: pingyi 30s linear; */
  animation-name: pingyi;
  animation-timing-function: linear;
  .icon {
    width: 100%;
    height: 100%;
  }
}
@keyframes pingyi {
  0% {
    transform: translateX(-1.37rem);
  }
  100% {
    transform: translateX(8.37rem);
  }
}
.hand_light {
  right: 0.3rem;
}
.hand {
  right: 0;
}
</style>
