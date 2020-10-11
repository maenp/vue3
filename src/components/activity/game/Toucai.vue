<template>
  <div class="pop_bg" v-if='showFlag' @touchmove.prevent>
    <div class="pop_container">
      <!-- 成功 -->
      <div v-if='isSuccess' class="pop_s">
        <img class="title" src="/static/img/activity/game/tc_s.png" alt="">
        <div class="content">
          <div>你成功突袭了<span>{{nickName}}</span>的田园获得<span class="value">{{msg}}{{type==1?'金币':'红包券'}}</span>奖励
          </div>
        </div>
      </div>
      <!-- 失败 -->
      <div v-else>
        <img class="dog" src="/static/img/activity/game/toucai_dog.gif" alt="">
        <img class="title" src="/static/img/activity/game/tc_f.png" alt="">

        <div class="pop_f">
          <div class="content">
            <div>
              {{nickName?'突袭':''}}
              <span>{{nickName}}</span>
              {{msg}}</div>
          </div>
        </div>

      </div>
      <!-- 去收割植物 按钮 -->
      <div v-if='this.btn' class="close" @click='close(1)'>去收割植物</div>
      <!-- 确定按钮 -->
      <div v-else class="close" @click='close(0)'>确定</div>

      <!-- 关闭按钮 -->
      <div class="close1" @click='close()'></div>
    </div>

  </div>
</template>

<script>
import Qs from "qs";
export default {
  data() {
    return {
      showFlag: false,
      nickName: "",
      type: "",
      msg: "", //失败消息或奖励数值
      isSuccess: "",
      btn: "", //按钮标识
    };
  },
  methods: {
    show(nickName, msg, type, isSuccess, btn) {
      this.showFlag = true;
      this.nickName = nickName;
      this.msg = msg;
      this.type = type;
      this.isSuccess = isSuccess;
      this.btn = btn;
    },
    close(n) {
      this.showFlag = false;
      if (n == 1) {//去收割植物  去首页 
        this.$emit("close",'home');
      } else {
        this.$emit("close");
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="stylesheet/scss">
.dog {
  position: absolute;
  top: -3.2rem;
  z-index: 9;
  width: 3.8rem;
  margin-left: 1.7rem;
}
.pop_container {
  position: relative;
  width: 6.78rem;
  height: 5.92rem;
  background: url("~@/static/img/activity/game/tc_bg.png") no-repeat;
  background-size: cover;
  // overflow: hidden;
  .title {
    display: block;
    width: 2.86rem;
    height: 0.76rem;
    padding-top: 0.6rem;
    margin: 0 auto;
  }
  .content {
    position: absolute;
    top: 1.7rem;
    left: 50%;
    transform: translateX(-50%);
    width: 4.8rem;
    height: 2.1rem;
    color: #6a3616;
    font-size: 0;
    line-height: 0.5rem;
    display: flex;
    align-items: center;
    div {
      font-size: 0.32rem;
      span {
        font-weight: bold;
        color: #49c029;
      }
      .value {
        color: #ff6d0c;
      }
    }
  }
}

.close {
  position: absolute;
  width: 2.9rem;
  height: 0.83rem;

  bottom: 1.2rem;
  left: 50%;
  background: url("/static/img/activity/game/tc_btn.png") no-repeat;
  background-size: cover;
  transform: translateX(-50%);
  color: #ffffff;
  font-size: 0.32rem;
  text-align: center;
  line-height: 0.78rem;
}
.close1 {
  position: absolute;
  width: 0.6rem;
  height: 0.6rem;
  right: 0.35rem;
  top: 0.75rem;
}
.nav {
  display: flex;
  justify-content: space-around;
}
.active {
  color: red;
}
.list {
  li {
    display: flex;
    background: pink;
    margin-top: 0.1rem;
    img {
      width: 1rem;
      height: 1rem;
    }
    .time {
      color: orange;
    }
  }
}
</style>
