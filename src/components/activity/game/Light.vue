<template>
  <div class="pop_bg" v-if='flag'>
    <div class="pop_container" v-show='flag_light'>
      <img src="/static/img/farmGame/light.png" alt="" class="light1">
      <img src="/static/img/farmGame/light3.png" alt="" class="light2">
      <img src="/static/img/farmGame/light2.png" alt="" class="light3">

      <img :src="url" alt="" class="gift scale">

    </div>
    <img v-show='gif_flag' class="gif800" src="" alt="">
  </div>
</template>

<script>
import Qs from "qs";
import $ from "jquery";
export default {
  data() {
    return {
      flag: false, //默认不显示
      flag_light: true,
      gif_flag: false,
      url: "",
      src: "/static/img/activity/game/800_gold_gif.gif"
    };
  },
  created() {},

  mounted() {},

  methods: {
    show(url, type) {
      this.flag = true;
      this.flag_light = true;
      this.gif_flag = false;
      this.url = url;
      if (type) {
        //是金币
        setTimeout(() => {
          this.flag_light = false;
          $(".gift").hide();
          // $(".gif" + type).show();
          $(".gif800").attr("src", this.src);
          this.gif_flag = true;
          setTimeout(() => {
            this.flag = false;
            this.gif_flag = false;
            $(".gif800").attr("src", "");
          }, 1600);
        }, 1000);
      } else {
        setTimeout(() => {
          this.flag = false;
        }, 1000);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="stylesheet/scss">
.scale {
  animation: scale 0.6s;
}
@keyframes scale {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
  }
  70% {
    transform: translate(-50%, -50%) scale(1.2);
  }
  85% {
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

.gif800 {
  // display: none;
  width: 7.5rem;
  height: 13.34rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999999;
  border: none;
}
.pop_bg {
  position: fixed;
  z-index: 9999999;

  .pop_container {
    width: 5.66rem;
    height: 5.66rem;
    background-color: transparent;
    top: 40%;
  }
  .light2,
  .light3,
  .gift {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .light1 {
    position: absolute;
    top: 0.005rem;
    left: 0.01rem;
    width: 5.64rem;
    z-index: 1;
    animation: rotate 5s infinite linear;
  }
  .light2 {
    width: 5.4rem;
    z-index: 2;
    // animation: show 3s infinite linear;
  }
  .light3 {
    width: 4.77rem;
    z-index: 3;
    animation: show 3s infinite linear;
  }
  .gift {
    width: 2.06rem;
    height: 2.22rem;
    z-index: 4;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes show {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}
</style>
