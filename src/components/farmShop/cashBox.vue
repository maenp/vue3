<template>
  <transition name="fade">
    <div class="pop_bg" v-show="isShow">
      <div class="wrapper">
        <!-- <img class="imgBox" :src="pic_url|imgsmall" alt=""> -->
        <img class="imgBox" :src="`/static/img/farmShop/${Math.floor(Math.random()*3)}.png`" alt="">
        <div class="_money">￥<span>{{ item.label1_money | price }}元</span></div>
        <div class="container">
          <div class="title">金币兑现金</div>
          <div class="money">￥<span>{{label1_money|price}}元现金券</span></div>
          <div class="cash_money">
            兑换将消耗
            <img src="/static/img/activity/game/main_gold.png" alt="" />
            <span>{{label1_money|goldRate}}</span>
            金币
          </div>
          <div class="btn" @click="toCashHandler">立即兑换</div>
          <div class="close" @click="close"/>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import {saveMoneyApi} from './../../api'
export default {
  data() {
    return {
      isShow: false,
      label1_money:1000,
      item:{},
      pic_url:'http://img.alicdn.com/imgextra/i2/2201188731272/O1CN01tRZhIf1LGcMozH4jg_!!2201188731272.jpg'
    };
  },
  created(){
    this.Observer.$once('cashBox',this.show)
    this.time=0
  },
  methods: {
    show(info) {
      if(!info){//关闭
        this.isShow=false
        return
      }
      console.log('打开');
      this.isShow=true
      this.label1_money=info.label1_money
      this.pic_url=info.pic_url
      this.item=info
      console.log(info);
    },
    toCashHandler(){//点击兑换
    // console.log(this.item.coupon_click_url);
    // return
    // location.href=decodeURIComponent(this.item.coupon_click_url)
    //       // window.open(this.item.coupon_click_url)
    //   return
      let time=new Date().getTime()
      if(time-this.time<1000)return
      this.time=time
      this.$button_click('exc_goods',8,'优惠券',this.label1_money/100);
      saveMoneyApi(this.item).then(({data})=>{
        if(data.resultCode==='0'){
          window.updateH5Info(1)
          // this.$com.toTaobaoHandler(this.item.coupon_click_url)
          this.isShow=false
          this.$toast('兑换成功~')
          console.log(data);
        }
      })
    },
    close() {
      this.isShow=false
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 6.02rem;
  height: 7.5rem;
  top: 20%;
  .btn,.close,.imgBox,.title,.money,.cash_money{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    ._money{
      top: 40%;

        font-size: .5rem;
      span{

        font-size: 1rem;
      }
    }
  .imgBox{
    position: absolute;
    z-index: -1;
    width: 5.82rem;
    height: 5.82rem;
    top: .05rem;
  border-radius: .3rem .3rem 0 0;

  }
  .container{
    background: url("/static/img/farmShop/cashBox.png");
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 5;
    .title{
      margin-top: .1rem;
      color: #C27100;
      font-size: .39rem;
      font-weight: 700;
    }
    .money{
      width: 3.54rem;
      height: .8rem;
    background: url("/static/img/farmShop/boxmoney_bg.png");
    background-size: 100% 100%;
    bottom: .65rem;
    color: #FF3308;
    font-size: .24rem;
    font-weight: 700;
     text-shadow: 
      1px 1px 0 #fff, 
      1px -1px 0 #fff, 
      -1px -1px 0 #fff,
      -1px 1px 0 #fff,
      -1px 0px 0 #fff,
      0px -1px 0 #fff,
      1px 0px 0 #fff,
      0px 1px 0 #fff;
      display: flex;
      justify-content: center;
      align-items: baseline;
      padding-top: .16rem;
      box-sizing: border-box;
      span{
        font-size: .34rem;
      }

    }
    .cash_money{
      width: max-content;
      font-size: .29rem;
      color: #fff;
      bottom: .1rem;
      display: flex;
      align-items: center;
      img{
        height: .28rem;
        margin: 0 .05rem;
      }
      span{
        color: #F5A34D;
        font-size: .32rem;
        margin-right: .05rem;
      }
    }
    .btn {
      width: 3.46rem;
      height: 0.92rem;
      background: url("/static/img/farmShop/btn.png");
      background-size: 100% 100%;
      bottom: -1.3rem;
      font-size: .4rem;
      line-height: .92rem;
      text-align: center;
      color: #A86305;
      font-weight: 600;
    }
    .close{
      height: .44rem;
      width: .44rem;
      background: url("/static/img/close_icon.png");
      background-size: 100% 100%;
      bottom: -2.1rem;
  
    }
  }
}
</style>
