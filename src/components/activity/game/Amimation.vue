<template>
  <div class="animation">
    <transition name="fade_l">
      <img class="img1" v-if="cloud" src="/static/img/farmGame/cloud_left.png" alt="" />
    </transition>
    <transition name="fade_r">
      <img class="img2" v-if="cloud" src="/static/img/farmGame/cloud_right.png" alt="" />
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cloud: false
    };
  },
  methods: {
    animationHandler() {
      this.Observer.$emit("changeAudio"); //首页背景音乐开关
      this.cloud = !this.cloud;
      this.timerElse = setTimeout(_ => {
        this.cloud = !this.cloud;
      }, 1000);
      //  this.$com.tuiya(0) 
    }
  },
  beforeDestroy() {
    clearTimeout(this.timerElse);
  }
};
</script>
<style lang="scss" scoped>
.animation {
  .img1,
  .img2 {
    position: fixed;
    transition: 0.5s;
    top: -1.6rem;
    z-index: 999;
    height: 126%;
    width: 159%;
  }
  .img1 {
    left: -2.9rem;
  }
  .img2 {
    right: -5rem;
  }

  .fade_l-enter,
  .fade_l-leave-to {
    transform: translateX(-100%);
  }
  .fade_r-enter,
  .fade_r-leave-to {
    transform: translateX(100%);
  }
}
</style>
