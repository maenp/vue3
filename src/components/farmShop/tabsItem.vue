<template>
  <div class="tabsItem"  @click="cashHandelr">
    <div class="imgBox">
      <img class="img" v-lazy="`/static/img/farmShop/${Math.floor(Math.random()*3)}.png`" alt="" />
      <div class="_money">￥<span>{{ item.label1_money | price }}元</span></div>
      <!-- <img class="img" v-lazy="item.pic_url+'_150x150'" alt="" /> -->
      <div class="top_icon" v-if="top" :style="`background-image:url('/static/img/farmShop/top_${top<4?top:'n'}.png');`">{{top}}</div>
    </div>
    <div class="info">
      <div class="info_title">【{{ item.label1_money | price }}元专用券】{{ item.title }}</div>
      <!-- <div class="info_tips">{{ item.recommendation }}</div> -->
      <!-- <div class="info_money">
        券后价￥
        <span class="price">{{ item.m_useq_price | price }}</span>
        <span class="old_price">￥{{ item.m_discount_price | price }}</span>
      </div> -->
      <div class="info_cash">
        <div class="_cash_have">已兑换{{ item.volume }}个</div>
        <div class="_cash_btn">
          <div class="_btn_money">{{ item.label1_money | price }}元券</div>
          <div class="_btn_price">
            <img src="/static/img/activity/game/main_gold.png" alt="" />
            <div>{{ item.label1_money | goldRate }}兑</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: {
        //   egou_commission1: 59,
        //   is_tmall: 1,
        //   item_id: 624020,
        //   label1_money: 500,
        //   m_useq_price: 580,
        //   pic_url:"https://img.alicdn.com/imgextra/i1/1672236481/O1CN01WDbH0C1xkLWYSqED0_!!1672236481.jpg",
        //   title: "一次性浴帽女防水洗澡加厚100只",
        //   volume: 1203,
        //   recommendation:'推荐语'
      }
    },
    top:{
      type:Number,
    }
  },
  methods: {
    cashHandelr() {
      this.$store.dispatch("shop/goodsCheckHandler",this.item);
      this.buttonEvent()
    },
    buttonEvent(){
      let boxName
      let {num_iid,title}=this.item
      if(this.top){
        boxName='hotprodlist'
      }else{//在商店首页
        boxName='prod'
      }
      this.$button_click(boxName,'','','',num_iid,title);
    }
  }
};
</script>
<style lang="scss" scoped>
.tabsItem {
  width: 100%;
  height: 2.6rem;
  background: #ffffff;
  box-shadow: 0rem 0rem 0.16rem 0.2rem rgba(241, 241, 241, 1);
  border-radius: 0.2rem;
  padding: 0.1rem;
  box-sizing: border-box;
  display: flex;
  .imgBox {
    height: 2.4rem;
    width: 2.4rem;
    position: relative;

    .img{
      border-radius: .1rem;
      height: 100%;
      width: 100%;
    }
    .top_icon{
      width: 1.1rem;
      height: .56rem;
      background:url('/static/img/farmShop/top_1.png') no-repeat;
      background-size:100% 100%;
      position: absolute;
      top: -.1rem;
      left: .1rem;
      font-size: .32rem;
      color: #fff;
      font-weight: 600;
      text-align: center;
    }
  }
  .info {
    margin-left: 0.18rem;
    .info_title {
      color: #222222;
      font-size: 0.3rem;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      width: 4.3rem;
    }
    .info_tips {
      color: #ff9007;
      font-size: 0.2rem;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      width: 4.3rem;
    }
    .info_money {
      line-height: 1;
      margin-top: 0.5rem;
      color: #ff2a00;
      display: flex;
      align-items: flex-end;
      font-weight: 400;
      .price {
        font-weight: 600;
        font-size: 0.38rem;
      }
      .old_price {
        text-indent: 0.1rem;
        text-decoration: line-through;
        color: #999999;
      }
    }
  }
  .info_cash {
    margin-top: 0.9rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    ._cash_have {
      color: #555555;
      font-size: 0.2rem;
    }
    ._cash_btn {
      padding: 0.1rem;
      box-sizing: border-box;
      height: 0.48rem;
      width: 2.8rem;
      background: linear-gradient(90deg, #ffd608 0%, #ff5d05 100%);
      border-radius: 0.1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      ._btn_money {
        height: 0.34rem;
        width: 1rem;
        background: url("/static/img/farmShop/money_bg.png");
        background-size: 100% 100%;
        color: #ff0000;
        font-size: 0.22rem;
        line-height: 0.34rem;
        text-align: center;
      }
      ._btn_price {
        color: #fff;
        display: flex;
        align-items: center;
        font-size: 0.28rem;
        img {
          /* margin-right: 0.1rem; */
          height: 0.28rem;
          width: 0.28rem;
        }
      }
      ._btn_price::after {
        content: "";
        display: block;
        background: url("/static/img/back.png") no-repeat;
        background-size: contain;
        transform: rotate(180deg);
        height: 0.23rem;
        width: 0.14rem;
        margin-left: 0.05rem;
      }
    }
  }
}
</style>
