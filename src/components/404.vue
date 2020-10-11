<template>
  <div id="bg" class="bg" v-show="showFlag">
    <div class="container">
      <img src="/static/img/404/404.png" alt="" />
      <p>页面开小差了</p>
      <p class="btn" @click="refresh">点击刷新</p>
    </div>
  </div>
</template>
<script>
var path
export default {
  data() {
    return {
      showFlag: true,
      path: ""
    };
  },
  inject: ["reload"],
  mounted() {},
  beforeRouteEnter(to, from, next) {
    path = to.redirectedFrom || from.fullPath; //地址错误或请求失败
    next();
  },
  methods: {
    refresh() {
      this.$router.replace(path);
      path=null
    }
  }
};
</script>
<style lang="scss" type="stylesheet/scss" scoped>
.bg {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 50%;
  height: 50%;
  margin:3rem auto ;
}
img {
  width: 3.25rem;
  height: 3.25rem;
}
p {
  font-family: SourceHanSansCN-Medium;
  font-size: 0.32rem;
  color: #e5e5e5;
  margin: 0.39rem auto;
  text-align: center;
}
.btn {
  color: #ffffff;
  text-align: center;
  line-height: 0.68rem;
  width: 2rem;
  height: 0.68rem;
  background: url("../../static/img/404/btn.png") no-repeat;
  background-size: cover;
}
</style>
