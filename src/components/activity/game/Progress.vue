<template>
  <div class="progress-outer" v-if='flag'>
    <div class="lv">Lv.{{lv}}</div>
    <div class="progress-inner" :class="{'progress-striped active':animate}">
      <div class="progress-bar" role="progressbar" :aria-valuenow="strength" :aria-valuemin="0" :aria-valuemax="maxStrength" :style="{width:ratio + '%'}">
      </div>
      <!-- <div class="num">{{strength}}/{{maxStrength}}</div> -->
    </div>
  </div>
</template>

<script>
import Qs from "qs";
export default {
  data() {
    return {
      lv: 1,
      flag: false, //默认不显示

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

  mounted() {},
  watch: {
    strength(val, oldVal) {
      this.ratioFn();
    },
    maxStrength(val, oldVal) {
      this.ratioFn();
    }
  },
  methods: {
    show(n) {
      this.flag = true;
      this.lv = n;
      this.ratioFn();
    },
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
  position: relative;
  display: flex;
  align-items: center;
  z-index: 4;
  margin-top: -0.08rem;
}
.lv {
  color: #552620;
  font-size: 0.22rem;
  width: 0.9rem;
  text-align: center;
  margin-left: 0.2rem;
  font-weight: 600;
  padding-top: 0.02rem;
}
.progress-inner {
  width: 1.6rem;
  height: 0.1rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 0.05rem;
  overflow: hidden;
}
.num {
  position: absolute;
  z-index: 9;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 0.4rem;
  line-height: 0.4rem;
  color: #fff;
}
.progress-bar {
  position: relative;
  width: 0;
  height: 100%;
  text-align: center;
  background: #f9bb06;
  border-radius: 0.05rem;
  opacity: 1;
  transition: width 0.9s ease;
}
</style>
