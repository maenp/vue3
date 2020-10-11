<template>
  <div class="pop_bg" v-if='showFlag' @touchmove.stop>
    <div class="pop_container">
      <div class="close">
        <img @click='close' src="/static/img/activity/game/close2.png" alt="">
      </div>

      <div class="title">{{obj.title}}</div>
      <div class="des">{{obj.des}}</div>
      <div class="btn" @click='guide'>
        <!-- ios审核模式，不展示播放按钮 -->
        <img v-show='!$nativeBridge.iosCheck&&obj.type==1' src="/static/img/farmGame/play_icon.png" alt="">
        <span>{{obj.btnText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
export default {
  data() {
    return {
      showFlag: false,
      obj: {
        title: "", //标题
        des: "", //描述
        btnText: "", //按钮文字描述
        type: 1 //1-看视频  2-去转盘
      }
    };
  },
  components: {},

  methods: {
    show(obj) {
      this.showFlag = true;
      this.obj = obj;
    },

    close() {
      this.$com.bottonAudioPlay();
      this.showFlag = false;
    },
    guide() {
      //引导按钮
      this.$com.bottonAudioPlay();
      this.showFlag = false;
      this.$emit("guidePopBtn", this.obj);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="stylesheet/scss">
.pop_container {
  width: 5.8rem;
  height: 3.58rem;
  background: url("/static/img/activity/game/guide_pop_bg.png") no-repeat;
  background-size: cover;
  text-align: center;
  .close {
    position: absolute;
    width: 0.44rem;
    height: 0.44rem;
    top: 0.2rem;
    right: 0.2rem;
    img {
      width: 0.24rem;
      height: 0.24rem;
      margin: 0.1rem;
    }
  }
  .title {
    margin-top: 0.11rem;
    color: #a76e4d;
    font-size: 0.4rem;
    font-weight: bold;
    line-height: 0.68rem;
  }
  .des {
    margin-top: 0.23rem;
    font-size: 0.34rem;
    color: #795038;
    font-weight: bold;
    line-height: 1.34rem;
  }
  .btn {
    margin-left: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    width: 3.2rem;
    height: 0.7rem;
    background: url("/static/img/activity/game/guide_pop_btn.png") no-repeat;
    background-size: 100%;
    img {
      width: 0.25rem;
      height: 0.25rem;
      margin-right: 0.06rem;
    }
  }
}
</style>
