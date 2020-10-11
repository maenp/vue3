<template>
  <div class="surplusTime">
    {{ time | daojishi }}
  </div>
</template>
<script>
import { daojishi } from "./../../../util/common";
export default {
  name: "daojishi",
  props: {
    surplusTime: {
      default: ""
    },
    plantStatus: {
      default: 0
    },
    growthPeriodTime: {
      default: ""
    }
  },
  filters: {
    daojishi(data) {
      if (data < 1) return "00:00:00";
      return data && daojishi(data);
    }
  },
  watch: {
    surplusTime() {
      this.daojishiHandler();
    }
  },
  data() {
    return {
      time: ""
    };
  },
  created() {
    this.daojishiHandler();
  },

  methods: {
    daojishiHandler() {
      this.interval && clearInterval(this.interval);
      let plantGrowTime = this.growthPeriodTime / 2;
      let plantStatus = this.plantStatus;

      this.time = this.surplusTime;

      this.interval = setInterval(() => {
        if (plantStatus === 0 && this.time < plantGrowTime) {
          //到达成长期 刷新地块信息
          this.$store.dispatch("farmGame/getPlantInfo");
        } else if (this.time < 1) {
          //到达成熟期 刷新地块信息
          clearInterval(this.interval);
          this.$store.dispatch("farmGame/getPlantInfo");
        }
        this.time -= 1;
      }, 1000);
    }
  },
  beforeDestroy() {
    this.interval && clearInterval(this.interval);
    this.interval = null;
  }
};
</script>
<style lang="scss" scoped>
.surplusTime {
  transform: rotateZ(-11deg) skew(41deg, -21deg) scale(0.6,0.8);
  position: absolute;
  z-index: 20;
  font-size: 0.27rem;
  left: 0.34rem;
  top: 0.52rem;
  height: 0.35rem;
  width: 1.25rem;
  line-height: 0.375rem;
  background-color: #a57149;
  border-radius: 0.2rem;
  color: #fff;
  text-align: center;
  padding-top: 0.04rem;
}
</style>
