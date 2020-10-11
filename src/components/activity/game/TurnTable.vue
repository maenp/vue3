<template>
  <div class="pop_bg " v-if='flag'>
    <!-- <div class="ball_right_top">狗粮</div>
    <div class="ball_left_down">种子、肥料</div>
    <div class="ball_left_top">金币</div> -->

    <div class="pop_container">
      <img class='trun_light_bg' src='/static/img/activity/game/000.png' alt="" />
      <!-- 大转盘 -->
      <div class="lucky-wheel">
        <img src="/static/img/activity/game/turn_pointer.png" alt="" class="pointer">
        <!-- 关闭按钮 -->
        <div class="close" @click='close'>
          <img src="/static/img/activity/game/close.png" alt="">
        </div>
        <div class="wheel-main">
          <!-- 奖品，动画 -->
          <img v-show='gift_img' :src="gift_img" alt="" class="gift">

          <!-- 转盘 -->
          <div class="wheel_bg" :style="{transform:rotate_angle,transition:rotate_transition}">
            <div class="prize-list">
              <div class="prize-item" v-for="(item,index) in prize_list" :key="index">

                <img :src="item.img">

              </div>
            </div>
          </div>
        </div>

      </div>
      <Progress_turn ref='Progress_turn' :strength='userInfo.strength' :maxStrength='userInfo.maxStrength'>
      </Progress_turn>
      <p class="time" v-show='time'>{{time}}<span>后恢复{{recoveryStrength}}点体力</span></p>

      <!-- 概率 -->
      <div @click='Probability_show' class="ratio"></div>

    </div>

    <!-- 转动按钮 -->
    <div v-show='time' class="turn_button seeVideo" @click='seeVideo'></div>
    <div v-show='!time' class="turn_button" @click="luck">
      <img v-show='!is_down' src='/static/img/activity/game/turn_button.png' />
      <img v-show='is_down' src='/static/img/activity/game/turn_button_1.png' />
    </div>

    <Probability ref='Probability'></Probability>
    <!-- 偷菜 -->
    <div v-show='DEV' @click='go' style="font-size:.5rem;color: #fff;">去偷菜</div>
    <ElsePlough ref='ElsePlough' @animationHandler='go'></ElsePlough>
    <!-- 偷菜 开屏/离开 动画 -->
    <Animation ref='Animation'></Animation>
    <!-- 抽中动效 -->
    <Light ref='Light'></Light>
    <!-- 转盘转到金币音效 -->
    <audio preload="auto" ref="turn_gold_audio" :src="require('@/static/music/farmGame/turn_gold.mp3')" type="audio/mpeg"></audio>
    <!-- 转盘转到其他音效 -->
    <audio preload="auto" ref="turn_else_audio" :src="require('@/static/music/farmGame/turn_else.mp3')" type="audio/mpeg"></audio>
  </div>
</template>
<script>
import Qs from "qs";
import $ from "jquery";
import Progress_turn from "./Progress_turn.vue"; //体力值进度
import Probability from "./Probability.vue"; //概率明示
import ElsePlough from "./ElsePlough.vue"; //偷菜界面
import Animation from "./Amimation"; //偷菜动画
import Light from "./Light"; //光效
import { TurnImg } from "./../../../assets/loadImage"; //需要预加载的图片
import {
  showRewardAd,
  showInterstitial1080
} from "./../../../api/getVideoAdId";

export default {
  data() {
    return {
      DEV: window.DEV,
      flag: false, //默认不展示
      gift_img: "", //中奖后的图片1
      time: "", //倒计时时间
      recoveryStrength: 1, //恢复的点数
      userInfo: {
        //体力值
        strength: 0,
        maxStrength: 50
      },
      is_down: false, //显示哪个按钮  true-没按之前的   false-按下之后的
      gift_move_timer: null,
      prize_list: [], //奖品列表
      during_time: 3, //默认转动的时间-秒
      rotating_rotate_timer: null,
      rotating_timer: null,
      type: 1, // 奖品类型，1金币，2种子，3化肥，4宠物食品，5体力，6偷菜 ,7红包券
      click_flag: true, //是否可以旋转抽奖。false为置灰状态
      index: 1, //奖品的索引，转盘指针指向的位置

      // 转盘动效参数
      start_rotating_degree: 0, //初始旋转角度
      rotate_angle: 0, //将要旋转的角度
      rotate_angle_pointer: 0, //指针将要旋转的度数
      rotate_transition: "transform 3s ease-in-out", //初始化选中的过度属性控制
      rotate_transition_pointer: "transform 3s ease-in-out" //初始化指针过度属性控制
    };
  },
  components: {
    Progress_turn,
    Probability,
    Animation,
    ElsePlough,
    Light
  },
  watch: {
    userInfo: {
      // 表示对象中属性变化的处理函数，这个函数只能叫这个名字
      handler(newVal) {
        //监听体力值等信息变化，
        if (newVal.strength == 0) {
          //显示倒计时
          this.daojishi(newVal.countDownTime);
        } else {
          clearInterval(this.timer1);
          this.time = "";
        }
      },
      immediate: true,
      deep: true // 表示开启深度监听
    }
  },
  // created() {},
  // mounted() {},
  beforeDestroy() {
    clearTimeout(this.timerElse);
    clearTimeout(this.timerLoad);
  },
  methods: {
    loadImageHandler() {
      //进入转盘页  预加载一下必要的图片资源
      this.timerLoad = setTimeout(_ => {
        this.$com.loadImage(TurnImg);
      }, 2000);
    },
    show(token) {
      this.flag = true;
      this.token = token;
      this.gift_img = "";
      this.time = "";
      if (this.$com.versionName() >= 1080) {
        //是否展示插屏广告
        this.openBigCycle(token);
      }
      this.loadImageHandler();
      this.getCircle(token); //获取奖品列表
    },
    close() {
      this.$com.bottonAudioPlay();
      this.$emit("initInfo"); //刷新初始化信息
      // this.$store.dispatch("farmGame/getPlantInfo"); //土地信息
      this.$store.dispatch("farmGame/getPloughInfo"); //种子肥料
      this.flag = false;
    },
    go(to) {
      //去偷菜
      this.$refs.Animation.animationHandler(); //偷菜开屏动画
      this.timerElse = setTimeout(_ => {
        //等待动画结束后再打开偷菜页面
        this.$refs.ElsePlough.show();
        if (to === "home") this.flag = false;
      }, 400);
    },
    daojishi(timeParam) {
      clearInterval(this.timer1);
      this.time = $com.daojishi(timeParam);
      this.timer1 = setInterval(() => {
        timeParam = timeParam - 1;
        this.time = this.$com.daojishi(timeParam);
        if (timeParam <= 0) {
          //没有时间了,加体力值
          this.getCircle(this.token);
          clearInterval(this.timer1);
          this.time = "";
        }
      }, 1000);
    },
    //展示概率
    Probability_show() {
      this.$com.bottonAudioPlay();
      this.$refs.Probability.show(this.oddsList);
    },
    openBigCycle(token) {
      this.$http("/game/bigCircle/openBigCycle", {
        params: {
          token
        }
      })
        .then(res => {
          if (res.data.resultCode == 0 && res.data.obj) {
            showInterstitial1080("OPEN_TURN_ADID", null, null);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCircle(token) {
      this.time = "";
      //获取奖品列表
      this.$http("/game/bigCircle/init", {
        params: {
          token
        }
      })
        .then(res => {
          if (res.data.resultCode == 0) {
            this.prize_list = res.data.obj.prizeList; //奖品列表
            this.userInfo = res.data.obj.userInfo; //个人信息，体力值等
            this.oddsList = res.data.obj.oddsList; //概率列表
            this.recoveryStrength = res.data.obj.recoveryStrength; //恢复的点数
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    seeVideo() {
      //没有体力值
      //看激励视频
      showRewardAd("TURN_TOWER_ADID", this.addStrength, null);
    },
    luck(e) {
      //抽奖结果
      this.$com.bottonAudioPlay();
      this.gift_img = ""; //中奖后的图片
      if (!this.click_flag) return; //抽奖置灰的状态。不进行下一步
      if (this.userInfo.strength == 0) {
      }
      //按钮状态
      this.is_down = true;
      setTimeout(() => {
        this.is_down = false;
      }, 100);
      this.$http("/game/bigCircle/luck", {
        params: {
          token: this.token
        }
      })
        .then(res => {
          if (res.data.resultCode == 0) {
            var data = res.data.obj;
            this.index = data.circle_index; //转盘的位置
            this.type = data.type; //奖品的类型
            // this.userInfo = data.userInfo; //重置体力值
            this.luckInfo = data; //中奖后信息

            this.click_flag = false; //置灰
            this.rotating(); //进行转动
            this.$button_click("wheel", data.type, data.name, data.num);
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    rotating() {
      clearTimeout(this.rotating_timer);
      clearTimeout(this.rotating_rotate_timer);
      $(".trun_light_bg").addClass("trun_light_bg_scale");
      $(".pointer").addClass("pointer_rotate");
      this.rotating_rotate_timer = setTimeout(() => {
        $(".pointer").removeClass("pointer_rotate");
      }, this.during_time * 1000);
      //旋转的效果
      var result_index = this.index - 1; // 最终要旋转到哪一块，对应prize_list的下标
      var result_angle = [340, 300, 260, 220, 180, 140, 100, 60, 20]; //最终会旋转到下标的位置所需要的度数
      var rand_circle = 5; // 附加多转几圈，2-3

      // 转动盘子  起始的角度+转动的总角度+结束时奖品的角度-起始角度%360（减去当前的索引位置）
      var rotate_angle =
        this.start_rotating_degree +
        rand_circle * 360 +
        result_angle[result_index] -
        (this.start_rotating_degree % 360);
      this.start_rotating_degree = rotate_angle; //更新起始角度
      this.rotate_angle = "rotate(" + rotate_angle + "deg)"; //赋值即转动

      // 旋转结束后，允许再次触发
      this.rotating_timer = setTimeout(() => {
        this.click_flag = true;
        let isBgAudio = localStorage.getItem("BgAudio");
        if (isBgAudio !== "false") {
          if (this.type == 1) {
            //金币音效
            this.$refs.turn_gold_audio.play();
          } else {
            //其他音效
            this.$refs.turn_else_audio.play();
          }
        }
        this.userInfo = this.luckInfo.userInfo; //转盘结束再重置体力值
        this.animationImageList = this.luckInfo.animationImageList; //中奖后图片
        this.luck_num = this.luckInfo.num; //中奖后奖品数量
        // 1金币，2种子，3化肥，4宠物食品，5体力，6偷菜 ,7红包券
        // this.luck_num = 800;
        if (this.type != 6 && this.type != 1) {
          //红包券不展示动画
          this.gift_img = this.animationImageList[1]; //展示中奖后的图片
          this.$refs.Light.show(this.animationImageList[0]);
        }

        // this.gift_move("ball_left_up");
        if (this.type == 6) {
          //偷菜
          this.go();
          // this.$refs.Light.show(this.animationImageList[0], this.luck_num);
        } else if (this.type == 1) {
          //金币
          this.$refs.Light.show(this.animationImageList[0], this.luck_num);
          this.$emit("get_myInfo"); //转完更新个人信息
        } else if (this.type == 5 || this.type == 7) {
          //左上
          this.gift_move("ball_left_up");
          this.$emit("get_myInfo"); //转完更新个人信息
        } else if (this.type == 2 || this.type == 3) {
          //左下
          this.gift_move("ball_left_down");
        } else if (this.type == 4) {
          //右上
          this.gift_move("ball_right_up");
          this.$emit("getMyPets"); //转完更新宠物信息
        }
        $(".trun_light_bg").removeClass("trun_light_bg_scale");
      }, this.during_time * 1000 + 300); // 延时，保证转盘转完
    },
    gift_move(name) {
      clearTimeout(this.gift_move_timer);
      $(".gift")
        .removeClass("ball_left_up")
        .removeClass("ball_left_down")
        .removeClass("ball_right_up")
        .css({ transform: "translate(-50%, -50%)" });
      this.gift_move_timer = setTimeout(() => {
        $(".gift").addClass(name);
      }, 1200);
    },
    addStrength() {
      this.time = "";
      //加体力值
      this.$http("/game/bigCircle/addStrength", {
        params: {
          token: this.token
        }
      })
        .then(res => {
          if (res.data.resultCode == 0) {
            this.getCircle(this.token); //获取奖品,重新取值
          } else {
            this.$toast(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped lang='scss'>
.pop_container {
  width: auto;
  height: auto;
  background: none;
  top: 45%;

  .trun_light_bg {
    position: absolute;
    width: 6.74rem;
    height: 6.74rem;
    left: 0.1rem;
    z-index: 1;
    opacity: 0;
  }
  .trun_light_bg_scale {
    // animation: trun_light_bg_scale 1s infinite,
    //   trun_light_bg_opacity 2.8s linear;
    animation: trun_light_bg_opacity 3.5s linear;
  }
  .time {
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    color: #ffffff;
    span {
      color: #ffc209;
    }
  }
  .pointer {
    position: absolute;
    z-index: 999;
    width: 0.74rem;
    height: 0.97rem;
    top: -0.26rem;
    left: 3.16rem;
  }
  .pointer_rotate {
    transform-origin: top;
    animation: pointer_rotate 0.3s infinite;
  }
  .close {
    position: absolute;
    width: 0.58rem;
    height: 0.64rem;
    z-index: 9;
    right: 0.2rem;
    top: 0.1rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .ratio {
    position: absolute;
    right: 0.2rem;
    bottom: 0.2rem;
    width: 0.8rem;
    height: 0.8rem;
  }
  .lucky-wheel {
    position: relative;
    width: 6.95rem;
    height: 7.98rem;
    background: url("/static/img/activity/game/turn_bg.png") no-repeat;
    background-size: cover;
    .wheel_bg {
      margin-top: 0.3rem;
      width: 6.13rem;
      height: 6.13rem;
      background: url("/static/img/activity/game/turn_bg_inner.png") no-repeat
        center top;
      background-size: 100%;
      color: #fff;
      font-weight: 500;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      transition: transform 3s ease-in-out;
    }
  }
}
@keyframes pointer_rotate {
  0% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(-30deg);
  }
  100% {
    transform: rotate(-10deg);
  }
}
@keyframes trun_light_bg_scale {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes trun_light_bg_opacity {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
.turn_button {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
  width: 4.16rem;
  height: 2.86rem;
  img {
    position: absolute;
    width: 100%;
    height: auto;
    // bottom: 0;
    // left: 0;
  }
}
.seeVideo {
  background: url("~@/static/img/activity/game/turn_see_video.png")
    no-repeat;
  background-size: 100%;
}
.gift {
  position: absolute;
  z-index: 999;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1.7rem;
  height: 1.7rem;
}

.ball_left_up {
  animation: ball_left_up 1s both, opacity 1s both;
}

@keyframes ball_left_up {
  0% {
    transform: translate(-50%, -50%);
  }

  100% {
    transform: translate(-4rem, -6rem);
  }
}

@keyframes opacity {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.ball_left_down {
  animation: ball_left_down 1s both, opacity 1s both;
}

@keyframes ball_left_down {
  0% {
    transform: translate(-50%, -50%);
  }

  100% {
    transform: translate(-4rem, 6rem);
  }
}

.ball_right_up {
  animation: ball_right_up 1s 1s forwards, opacity 1s 1s forwards;
}

@keyframes ball_right_up {
  0% {
    transform: translate(-50%, -50%);
  }

  100% {
    transform: translate(4rem, -6rem);
  }
}

.my_info {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0.4rem 0 0 0.3rem;
  color: #ffffff;
  font-size: 0.24rem;
}

.my_info .back {
  width: 0.2rem;
  height: 0.38rem;
  opacity: 0.7;
}

.my_info .headImg {
  margin-left: 0.28rem;
  width: 0.66rem;
  height: 0.66rem;
  border-radius: 0.1rem;
}

.chance {
  margin-left: 0.26rem;
  display: flex;
  align-items: center;
}

.chance span {
  font-size: 0.36rem;
  font-weight: bold;
  color: #ffe93b;
}

.wheel-main {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 8;
}

// .light {
//   position: absolute;
//   z-index: 10;
//   top: 0;
//   left: 0;
//   /* transform: translate(-50%, -50%); */
//   width: 2rem;
//   height: 2rem;
//   border-radius: 50%;
//   border: 6px solid #ffffff;
//   background: #ffffff;
//   opacity: 0.33;
//   animation: light 0.6s infinite;
// }

// @keyframes light {
//   0% {
//     transform: scale(1);
//   }

//   50% {
//     transform: scale(1.1);
//   }

//   100% {
//     transform: scale(1);
//   }
// }

.prize-list {
  width: 100%;
  height: 100%;
  position: relative;
}

.prize-list .prize-item {
  position: absolute;
  width: 1.2rem;
  height: 1.64rem;
  top: 0;
  left: 0;
  z-index: 2;
}

.prize-list .prize-item:first-child {
  top: -0.06rem;
  left: 3.31rem;
  transform: rotate(20deg);
}

.prize-list .prize-item:nth-child(2) {
  top: 1.02rem;
  left: 4.6rem;
  transform: rotate(60deg);
}
.prize-list .prize-item:nth-child(3) {
  top: 2.67rem;
  left: 4.9rem;
  transform: rotate(100deg);
}
.prize-list .prize-item:nth-child(4) {
  top: 4.1rem;
  left: 4.02rem;
  transform: rotate(140deg);
}

.prize-list .prize-item:nth-child(5) {
  top: 4.7rem;
  left: 2.48rem;
  transform: rotate(180deg);
}
.prize-list .prize-item:nth-child(6) {
  top: 4.1rem;
  left: 0.9rem;
  transform: rotate(220deg);
}
.prize-list .prize-item:nth-child(7) {
  top: 2.66rem;
  left: 0.1rem;
  transform: rotate(260deg);
}
.prize-list .prize-item:nth-child(8) {
  top: 1.05rem;
  left: 0.4rem;

  transform: rotate(300deg);
}
.prize-list .prize-item:nth-child(9) {
  top: 0rem;
  left: 1.65rem;
  transform: rotate(340deg);
}

.prize-item {
  width: 1.96rem;
  height: 2rem;
}

.prize-item img {
  width: 100%;
  height: 100%;
  margin: 0.4rem auto;
}
</style>
