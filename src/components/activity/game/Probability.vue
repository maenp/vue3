<template>
  <div class="pop_bg pop_bg1" v-if='flag'>
    <div class="pop_container">
      <ul>
        <li v-for='(item,index) in list' :key="index">
          <div class="box_w">{{item.name}}:</div>
          <span>{{item.val}}</span>
        </li>
      </ul>
      <div class="btn" @click='close'></div>
      <div class="btn1" @click='close'></div>
    </div>
  </div>
</template>

<script>
import Qs from "qs";
export default {
  data() {
    return {
      flag: false, //默认不显示
      list: []
    };
  },
  methods: {
    show(list) {
      this.flag = true;
      this.list = list;
    },
    close() {
      this.flag = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="stylesheet/scss">
.pop_container {
  width: 5.89rem;
  height: 7.05rem;
  background: url("~@/static/img/activity/game/turn_ratio.png")
    no-repeat;
  background-size: cover;
}
ul {
  margin: 1.9rem 0 0 2rem;
  height: 3.5rem;
  overflow: auto;
}
li {
  display: flex;
  font-size: 0.3rem;
  line-height: 0.5rem;
  color: #83431b;
  span {
    font-weight: bold;
    color: #49c029;
  }
}
.btn {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0.82rem;
  width: 2.53rem;
  height: 0.68rem;
}
.btn1 {
  position: absolute;
  right: 0.2rem;
  top: 0.6rem;
  width: 0.6rem;
  height: 0.6rem;
}
</style>
