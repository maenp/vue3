<template>
  <div class="toTop" @click="toTopHandler" v-show="isShow" />
</template>
<script>
export default {
  props: ["scroll"],
  mounted() {
    if (this.scroll) {
      this.scrollDom = document.getElementById(this.scroll);
      this.scrollDom.addEventListener("scroll", this.scrollHandler);
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    toTopHandler() {
      if (this.scroll) {
        if (!this.scrollDom) this.scrollDom = document.getElementById(this.scroll);
        this.scrollDom.scrollTop = 0;
      } else {
        document.body.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }
    },
    scrollHandler(e) {
      let scrollTop = e.target.scrollTop;
      this.clear()
      this.timer = setTimeout(_ => {
          this.clear()
        if (scrollTop > 100) {
          this.isShow = true;
        } else {
          this.isShow = false;
        }
      }, 300);
    },
    clear(){
        this.timer&&clearTimeout(this.timer)
        this.timer=null
    },
  },
  destroyed(){
      this.clear()
  }
};
</script>
<style lang="scss" scoped>
.toTop {
  height: 0.88rem;
  width: 0.88rem;
  background: url("/static/img/farmShop/toTop.png") no-repeat;
  background-size: 100% 100%;
  position: fixed;
  bottom: 1.26rem;
  right: 0.1rem;
  z-index: 50;
}
</style>
