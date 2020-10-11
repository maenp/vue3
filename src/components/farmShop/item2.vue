<template>
  <div class="item2" @click="cashHandelr">
    <div class="imgBox" :style="source==='topPage'?'height:60%':''">
      <img class="img" v-lazy="`/static/img/farmShop/${Math.floor(Math.random()*3)}.png`" alt="" />
      <div class="top_icon" v-if="top">{{top}}</div>
      <div class="_money">￥<span>{{ item.label1_money | price }}元</span></div>
    </div>
    <div class="list_title">【{{ item.label1_money | price }}元专用券】{{ item.title }}</div>
    <!-- <div class="list_price">
      券后价￥<span class="price">{{ item.m_useq_price | price }}</span>
      <span v-if="source==='topPage'" class="old_price">￥{{item.m_discount_price| price}}</span>
    </div> -->
    <div :class="[{ page_money: source==='topPage' }, 'list_money']">
      <img src="/static/img/activity/game/main_gold.png" alt="" />
      {{ item.label1_money| goldRate }}抵{{ item.label1_money | price }}元券
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
        //   recommendation:'recommendation'
      }
    },
    source:{
      type:String,
      default:"topBox"
    },
    top:{
      type:Number
    }
  },
  methods:{
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
        boxName='hotprod'
      }
      this.$button_click(boxName,'','','',num_iid,title);
    }
  }
};
</script>
<style lang="scss" scoped>
.item2 {
    /* background: #999; */
    height: 100%;
    position: relative;
  .imgBox {
    width: 100%;
    height: 54%;
    position: relative;
    .img{
    border-radius: 0.2rem 0.2rem 0px 0px;
      height: 100%;
      width: 100%;
    }
    .top_icon{
      width: 1.1rem;
      height: .56rem;
      background:url('/static/img/farmShop/top_n.png') no-repeat;
      background-size:100% 100%;
      position: absolute;
      top: -.09rem;
      left: .15rem;
      font-size: .32rem;
      color: #fff;
      font-weight: 600;
      text-align: center;
    }
  }
  .list_title {
      /* min-height: .9rem; */
    color: #333;
    padding: 0 0.05rem;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .list_price {
    color: #ff2b00;
    display: flex;
    align-items: flex-end;
    line-height: 1;
    justify-content: center;
    margin-top: 0.06rem;
    .price {
      display: block;
      font-size: 0.36rem;
      font-weight: 700;
    }
    .old_price{
        text-indent: .1rem;
        text-decoration: line-through;
        color: #999999;
    }
  }
  .list_money {
    position: absolute;
    bottom: .2rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2rem;
    height: 0.4rem;
    background: #fff2b3;
    border-radius: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 0.28rem;
      width: 0.28rem;
    }
  }
  .page_money{
      color: #fff;
    width: 2.90rem;
    height: .48rem;
    background: linear-gradient(90deg, #FFD508 0%, #FF5E05 100%);
    border-radius: .10rem;
  }
}
</style>
