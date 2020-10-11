<template>
  <div class="clock">
    <div class="daojishi"
      v-show="showTime">剩余扩建时间 {{ time | daojishi }}</div>
    <div class="clockImg"
      @click="showTimeHandler"></div>
  </div>
</template>
<script>
import { daojishi } from "./../../../util/common";
export default {
  props: {
    leaseSurplusTime: {
      default: ""
    }
  },
  filters: {
    daojishi(data) {
      if (data < 1) return "";
      return data && daojishi(data);
    }
  },
  watch: {
    leaseSurplusTime() {
      this.daojishiHandler();
    }
  },
  data() {
    return {
      time: "",
      showTime: 0
    };
  },
  created() {
    this.daojishiHandler();
  },
  methods: {
    showTimeHandler() {
      //显示倒计时
      this.$com.bottonAudioPlay();
      if (this.showTime) {
        clearTimeout(this.timeout);
      } else {
        this.showTime = 1;
      }
      this.timeout = setTimeout(_ => {
        this.showTime = 0;
      }, 3000);
    },
    daojishiHandler() {
      this.interval && clearInterval(this.interval);
      this.time = this.leaseSurplusTime;

      this.interval = setInterval(() => {
        if (this.time < 1) {
          //刷新地块信息
          clearInterval(this.interval); //应该不用
          this.$store.dispatch("farmGame/getPlantInfo");
        }
        this.time -= 1;
      }, 1000);
    }
  },
  beforeDestroy() {
    this.interval && clearInterval(this.interval);
    this.interval = null;
    clearTimeout(this.timeout);
    this.timeout = null;
  }
};
</script>
<style lang="scss" scoped>
.clock {
  position: absolute;
  left: 0.66rem;
  top: 0.42rem;
  height: 0.36rem;
  width: 0.33rem;
  /* transform: rotateZ(-11deg) skew(41deg,-21deg) scaleY(1.4); */
  /* transform: rotateZ(-5deg) skew(47deg,-27deg) scaleY(1.4); */
  transform: rotateZ(-5deg) skew(47deg, -27deg) scale(0.7, 1);
  z-index: 22;
  .clockImg {
    height: 100%;
    width: 100%;
    background: url("~@/static/img/farmGame/clock.png") no-repeat;
    background-size: cover;
  }
  .daojishi {
    background-color: #ba53ea;
    // background-color: #a57149;
    width: 1.4rem;
    font-size: 0.2rem;
    position: absolute;
    height: 0.55rem;

    top: -0.82rem;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    text-align: center;
    border-radius: 0.2rem;
    line-height: 0.25rem;
    padding-top: 0.1rem;
    z-index: 93;
  }
  .daojishi::before {
    content: "";
    display: block;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -0.29rem;
    height: 0px;
    width: 0px;
    border: 0.15rem solid transparent;
    border-top-color: #ba53ea;
  }
}
</style>
