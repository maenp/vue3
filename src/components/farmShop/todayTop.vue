<template>
  <div class="todayTop">
    <div class="todayTop_head">
      <div class="_head_left">今日榜单</div>
      <div class="_head_right" @click="toTodaytopPageHandler">更多</div>
      <!-- <router-link to="/todayTop" tag="div" class="_head_right">更多</router-link> -->
    </div>
    <div class="todayTop_list">
      <ul>
        <li v-for="t in topListX" :key="t.item_id">
          <Item2 :item="t" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getTopListApi } from "./../../api/shop";
import Item2 from './item2'
export default {
    components:{Item2},
  computed: {
    topListX: {
      get() {
        return this.$store.state.shop.topList.slice(0, 10);
      }
    }
  },
  methods: {
    toTodaytopPageHandler(){
      this.$router.push('/todayTop')
    },
    getShopTopListHandler() {
      this.$store.dispatch("shop/getShopTopListHandler", {
        page_no: 1
      });
    }
  },
  mounted() {
    this.getShopTopListHandler();
  }
};
</script>
<style lang="scss" scoped>
.todayTop {
  box-sizing: border-box;
  height: 5.48rem;
  width: 7.3rem;
  background-color: #fff;
  border-radius: 0.2rem;
  margin: 0 auto 0.2rem;
  padding: 0 0.2rem;
  .todayTop_head {
    height: 0.92rem;
    color: #038f00;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ._head_left {
      font-weight: 600;
      font-size: 0.36rem;
    }
    ._head_right {
      font-size: 0.28rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 0.9rem;
    }
    ._head_right::after {
      content: "";
      display: block;
      background: url("/static/img/top_back.png") no-repeat;
      background-size: contain;
      transform: rotate(180deg);
      height: 0.23rem;
      width: 0.14rem;
    }
  }
  .todayTop_list {
    height: 4.5rem;
    overflow-x: scroll;
    ul {
      height: 100%;
      width: max-content;
      overflow: hidden;
      margin-left: -.1rem;
      li {
        float: left;
        width: 2.25rem;
        margin-left: 0.09rem;
        font-size: 0.24rem;
        height: 100%; 
      }
    }
  }
}
</style>
