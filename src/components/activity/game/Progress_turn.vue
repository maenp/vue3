<template>
  <div class="progress-outer">
    <img src="/static/img/activity/game/turn_value.png">
    <div class="progress-inner" :class="{'progress-striped active':animate}">
      <div class="progress-bar" role="progressbar" :aria-valuenow="strength" :aria-valuemin="0" :aria-valuemax="maxStrength" :style="{width:ratio + '%'}">
      </div>
      <div class="num">{{strength}}/{{maxStrength}}</div>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
export default {
  data() {
    return {
      ratio: 0
    };
  },
  props: {
    strength: {
      type: Number,
      default: 0
    },
    maxStrength: {
      type: Number,
      default: 0
    },
    animate: {
      type: Boolean,
      default: true
    }
  },
  created() {},

  mounted() {
    this.ratioFn();
  },
  watch: {
    strength(val, oldVal) {
      this.strength = val;
      this.ratioFn();
    },
    maxStrength(val, oldVal) {
      this.maxStrength = val;
      this.ratioFn();
    }
  },
  methods: {
    ratioFn() {
      this.ratio =
        this.strength < this.maxStrength
          ? (this.strength * 100) / this.maxStrength
          : 100; //进度条所占的宽度
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="stylesheet/scss">
.progress-outer {
  position: absolute;
  z-index: 4;
  left: 0.31rem;
  bottom: 0.3rem;
  width: 5.4rem;
  height: 0.58rem;
  border: 0px solid rgba(7, 0, 2, 1);
  background: linear-gradient(
    0deg,
    rgba(121, 69, 41, 1) 0%,
    rgba(103, 59, 33, 1) 100%
  );
  box-shadow: 0px 0px 0.06rem 0px rgba(41, 26, 17, 1);
  border-radius: 0.29rem;
}
img {
  position: absolute;
  left: -0.1rem;
  top: -0.1rem;
  z-index: 1;
  width: 0.62rem;
  height: 0.78rem;
}
.progress-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -45%);
  width: 5.28rem;
  height: 0.46rem;
  background: #7a462a;
  border-radius: 0.2rem;
  overflow: hidden;
  .progress-bar {
    overflow: hidden;
    position: relative;
    width: 0;
    height: 100%;
    text-align: center;
    // background: linear-gradient(#3eb7fc, #4af4ff);
    background: url("~@/static/img/activity/game/value_bar.png")
      no-repeat;
    background-position: right center;
    background-size: auto 100%;
    border-radius: 0.2rem;
    opacity: 1;
    transition: width 0.9s ease;
  }
  .num {
    position: absolute;
    z-index: 9;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: 0.46rem;
    line-height: 0.46rem;
    color: #fff;
    font-weight: bold;
  }
}
// .progress-striped .progress-bar {
//   overflow: hidden;
//   background-image: linear-gradient(
//     -45deg,
//     rgba(255, 84, 0, 1) 25%,
//     orange 25%,
//     transparent 50%,
//     rgba(255, 84, 0, 1) 50%,d
//     rgba(255, 84, 0, 1) 75%,
//     orange 75%,
//     transparent
//   );
//   background-size: 40px 40px;
// }
</style>
