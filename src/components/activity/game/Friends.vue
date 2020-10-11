<template>
  <div>
    <ElsePlough ref='ElsePlough' @animationHandler='go'></ElsePlough>
    <Animation ref='Animation'></Animation>
  </div>
</template>

<script>
import Qs from "qs";
import ElsePlough from "./ElsePlough.vue"; //偷菜界面
import Animation from "./Amimation.vue"; //偷菜动画
export default {
  components: {
    ElsePlough,
    Animation
  },
  methods: {
    go(source,id) {//去偷菜
      this.$refs.Animation.animationHandler(); //偷菜开屏动画
      this.timerElse = setTimeout(_ => {//等待动画结束后再打开偷菜页面
        this.$refs.ElsePlough.show(source,id);
      }, 400);
    },
  }
};
</script>
