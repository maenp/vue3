<template>
  <div class="pop_bg guide">
    <div class="clickBox" :style="`
        height:${list[nowIndex].height};
        width:${list[nowIndex].width};
        bottom:${list[nowIndex].bottom};
        top:${list[nowIndex].top};
        left:${list[nowIndex].left};
    `" @click="clickGuideHandler"></div>
    <div class="tips" :style="`
        top:${list[nowIndex].t_top};
        left:${list[nowIndex].t_left};
        bottom:${list[nowIndex].t_bottom};
    `">{{list[nowIndex].tips}}</div>
    <!-- <div class="close" @click="close">跳过</div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          height: "1.8rem",
          width: "1.8rem",
          top: "",
          left: "2.8rem",
          bottom: "5rem",
          tips: "点击空地，种下作物 !",
          t_top: "",
          t_bottom: "4rem",
          t_left: "2.06rem"
        },
        {
          height: "3.80rem",
          width: "2.3rem",
          top: "",
          bottom: ".44rem",
          left: "2.6rem",
          tips: "点击按钮，种下作物",
          t_top: "",
          t_bottom: "4.6rem",
          t_left: "3rem"
        },
        {
          height: "1.8rem",
          width: "1.8rem",
          top: "",
          left: "2.8rem",
          bottom: "8rem",
          tips: "种植成功！\n点击作物可以施肥！",
          t_top: "",
          t_left: "2.1rem",
          t_bottom: "6.5rem"
        },
        {
          height: "1.8rem",
          width: "1.8rem",
          top: "",
          left: "2.8rem",
          bottom: "8rem",
          tips: "点击肥料，立即加速！",
          t_top: "",
          t_left: "2rem",
          t_bottom: "7rem"
        },
        {
          height: "1.8rem",
          width: "1.8rem",
          top: "",
          left: "2.8rem",
          bottom: "8rem",
          tips: "点击收获，获得奖励",
          t_top: "",
          t_left: "2.1rem",
          t_bottom: "7rem"
        }
      ],
      nowIndex: 0
    };
  },
  methods: {
    close() {
      //通知客户端引导结束 销毁当前组件
      this.$nativeBridge.handler("guideFinished", true);
      this.$emit("showGuide");
    },
    clickGuideHandler(e) {
      //点击引导
      switch (this.nowIndex) {
        case 0:
          this.$store.commit("farmGame/setPloughTopUpdate", true);
          break;
        case 1:
          this.$store.dispatch("farmGame/addPlantInfo", { plantId: 1 });
          if(this.$com.versionName() >=1070)this.$nativeBridge.handler('firstPlant',true)//首次种植通知客户端
          break;
        case 2: //点击作物进行施肥
          this.$emit("PlantBoxHandler","plantTime");
          break;
        case 3: //点击作物头上的化肥 立即加速
          this.$store.dispatch("farmGame/setFertilizer", 1);
          break;
        case 4: //点击收获
          this.Observer.$emit("newGuideHarvest", e, 1);
          break;
        default:
          break;
      }
      if (this.nowIndex > this.list.length - 2) {
        console.log("引导结束");
        this.close();
        return;
      }
      this.nowIndex += 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.guide {
  background: transparent;
  .clickBox {
    position: absolute;
    border-radius: 0.2rem;
    box-shadow: 0 0 0 99rem rgba(0, 0, 0, 0.5);
    transition: 0.5s;
  }
  .clickBox::after {
    content: "";
    animation: hand_scale 1s infinite;
    display: block;
    background: url("/static/img/farmGame/hand.png");
    background-size: 100% 100%;
     width: 0.77rem;
    height: 0.97rem;
    position: absolute;
    right: -0.3rem;
    bottom: -0.08rem;
  }
  .clickBox::before {
    content: "";
    animation: hand_light 1s 0.5s infinite;
    display: block;
    background: url("/static/img/farmGame/hand_light.png");
    background-size: 100% 100%;
    position: absolute;
    right: 0rem;
    bottom: .4rem;
    width: 0.64rem;
    height: 0.64rem;
  }
  .tips {
    position: absolute;
    border: solid 1px #C17A32;
    background-color: #fff;
    padding: 0.1rem 0.4rem;
    border-radius: 0.35rem;
    font-size: 0.3rem;
    line-height: 0.4rem;
    transition: 0.5s;
    white-space: pre-line;
  }
  .close {
    position: absolute;
    height: 0.5rem;
    color: #fff;
    border: solid 1px #fff;
    padding: 0 0.2rem;
    border-radius: 0.35rem;
    line-height: 0.5rem;
    font-size: 0.3rem;
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>
