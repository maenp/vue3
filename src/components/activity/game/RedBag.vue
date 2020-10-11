<template>
  <div class="pop_bg" v-if='showFlag' @touchmove.prevent>
    <div class="video">
      <div  @click='video($event,2)'></div>
      <p @click='video($event,1)'></p>
    </div>
    <div class="close" @click='close'></div>
  </div>
</template>

<script>
import $ from "jquery";
import { showRewardAd } from "./../../../api/getVideoAdId";
export default {
  data() {
    return {
      showFlag: false,
    };
  },
  methods: {
    show(source, fn) {
      if (fn instanceof Function) this.callback = fn;
      this.showFlag = true;
      if (source === "plough") {;//收获红包券
        this.source = "plough";
      }
      this.$nextTick(() => {
        $(".video").addClass("fanzhuan");
      });
      setTimeout(() => {
        $(".video").removeClass("fanzhuan");
      }, 2000);
    },
    close() {
      this.callback && this.callback();
      this.$com.bottonAudioPlay();
      this.showFlag = false;
      if (this.source === "plough") return;
      this.$emit("close_video");
    },

    video(e, type) {
      //1-普通，2-20倍领取
      e.stopPropagation(); //防止穿透
      this.$com.bottonAudioPlay();
      this.showFlag = false;
      if (this.source === "plough") {
        //收获红包券 播放视频回调
        this.$emit("ploughShowRewardAd", false, type);
        if(type==1){
          this.$button_click("plant_redBag1");
        }else{
          this.$button_click("plant_redBag20");
        }
      } else {
        //偷菜收获红包券
        //看激励视频,红包券不需要查看播放状态的回调，调用了方法，就调红包券接口
        // let adPlayComplete = () => {
          this.$emit("reward", type);
          if(type==1){
            this.$button_click("steal_redBag1");
          }else{
            this.$button_click("steal_redBag20");
          }
        // };
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="stylesheet/scss">
.pop_bg {
  transform: perspective(1000);
}
.video {
  position: fixed;
  z-index: 999;
  top: 3.5rem;
  left: 0.65rem;
  width: 6.19rem;
  height: 7.37rem;
  background: url("/static/img/activity/game/redBag.png") no-repeat;
  background-size: cover;
  div{
    position: absolute;
    top: 2.4rem;
    left: 2.2rem;
    width: 1.8rem;
    height: 2.3rem;
// border: 1px solid green;
  }
  p{
    position: absolute;
     top: 6.1rem;
    left: 2.1rem;
    width: 2rem;
    height: .5rem;
// border: 1px solid green;
  }
}
.fanzhuan {
  animation: scale_1 1s linear;
}

@keyframes scale_1 {
  0% {
    transform: scale(0.1, 0.2) rotateY(0deg) translateY(0);
  }
  15% {
    transform: scale(0.2, 0.3) rotateY(180deg) translateY(-1.5rem);
  }
  30% {
    transform: scale(0.3, 0.4) rotateY(0deg) translateY(-3rem);
  }
  45% {
    transform: scale(0.4, 0.5) rotateY(180deg) translateY(-4.5rem);
  }
  60% {
    transform: scale(0.5, 0.6) rotateY(0deg) translateY(-3rem);
  }
  75% {
    transform: scale(0.6, 0.7) rotateY(180deg) translateY(-1.5rem);
  }
  100% {
    transform: scale(1) rotateY(0deg) translateY(0);
  }
}
.close {
  position: fixed;
  top: 2rem;
  right: 0.3rem;
  width: 0.44rem;
  height: 0.44rem;
  background: url("/static/img/close_icon.png") no-repeat;
  background-size: cover;
}
</style>
