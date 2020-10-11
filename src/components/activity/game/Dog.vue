<template>
    <div class="dog_box" @touchmove.stop v-if='showFlag'>
      <img class="dog" src='/static/img/activity/game/main_dog_gif.gif' />
      <div class="msg">
        <div class="dog_msg">
          <p>{{dog_msg.slice(0,4)}}</p>
          <p style="margin-left:.15rem">{{dog_msg.slice(4,9)}}</p>
          <p class="maxW" style="margin-left:.45rem">{{dog_msg.slice(9)}}</p>
        </div>
        <img class="dhk" src="/static/img/activity/game/duihuakuang.png" alt="">
      </div>
    </div>
</template>

<script>
import { getDogValApi } from "./../../../api";
export default {
  data() {
    return {
      dog_msg: "", //对话框消息
      showFlag: false
    };
  },
  created() {
    this.getVal();
  },
  methods: {
    getVal() {
      clearInterval(this.getVal_timer);
      getDogValApi()
        .then(res => {
          if (res.data.resultCode === "0") {
            this.showFlag = true;
            let { list, time } = res.data.obj;
            this.dog_msg = this.$com.get_one_from_arr(list);
            this.getVal_timer = setInterval(() => {
              this.dog_msg = this.$com.get_one_from_arr(list);
            }, time * 1000);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    close() {
      this.$com.bottonAudioPlay();
      this.showFlag = false;
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="stylesheet/scss">
.dog_box {
  position: fixed;
  left: 1.41rem;
  bottom: 6.4rem;
  width: 1.46rem;
  height: 1.8rem;
  /* display: flex; */
  .dog {
    position: absolute;
    width: 1.46rem;
    height: 1.8rem;
  }
  .msg {
    position: absolute;
    width: 1.81rem;
    height: 1.39rem;
    left: 1.36rem;
    top: -1rem;
    .dhk {
      width: 100%;
      height: 100%;
    }
    .dog_msg {
      position: absolute;
      left: 0.3rem;
      top: 0.15rem;
      color: #623623;
      font-size: 0.22rem;
      line-height: 0.28rem;
      width: 1.81rem;
      height: 1.39rem;
      .maxW {
        max-width: 0.8rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
