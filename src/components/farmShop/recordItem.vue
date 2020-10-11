<template>
  <div :class="[{ rewardItem: source==='reward' }, 'tabsItem']" @click="cashHandler">
    <!-- <img class="img" v-lazy="item.pic_url+'_150x150'" alt=""> -->
    <div class="imgBox">
        <div class="_money">￥<span>{{ item.label1_money | price }}元</span></div>
        <img class="img" v-lazy="`/static/img/farmShop/${Math.floor(Math.random()*3)}.png`" alt="" />
    </div>
    <div class="info">
        <div class="info_title">【{{ item.label1_money | price }}元专用券】{{item.title}}</div>
        <div class="info_tips" v-if="source==='cash'">
            <img src="/static/img/activity/game/main_gold.png" alt="">
            {{item.gold}}
        </div>
        <!-- <div class="info_price" v-if="source==='reward'">
            现金抵扣券{{item.label1_money|price()}}元券
        </div> -->
        <!-- <div class="info_money" v-else>
              券后价￥ 
              <span class="price">{{item.m_useq_price|price}}</span>
              <span class="old_price">{{item.label1_money|price()}}元券</span>
        </div> -->
        <div class="info_cash">
            <div class="_cash_have">兑换时间 : {{item.create_time|timestamp}}</div>
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
         item_id: 624020,
        label1_money: 500,
        pic_url:"https://img.alicdn.com/imgextra/i1/1672236481/O1CN01WDbH0C1xkLWYSqED0_!!1672236481.jpg",
        title: "一次性浴帽女防水洗澡加厚100只",
        gold:1000
     }
    },
    source:{
        type:String,
        default:'cash'
    }
  },
  created(){
      this.time=0
  },
  methods:{
      cashHandler(){
        // let time=new Date().getTime()
        // if(time-this.time<500)return
        // this.time=time
        // this.$com.toTaobaoHandler(this.item.coupon_click_url)
        // this.buttonEvent()
      },
      buttonEvent(){
        let boxName
        if(this.source==='cash'){
            boxName='rec_cash'
        }else{
            boxName='rec_reward'
        }
        this.$button_click(boxName);

      }
  }
};
</script>
<style lang="scss" scoped>
    .tabsItem{
        width: 100%;
        height: 2.60rem;
        background: #FFFFFF;
        box-shadow: 0rem 0rem .16rem .2rem rgba(241,241,241,1);
        border-radius: .20rem;
        padding: .1rem;
        box-sizing: border-box;
        display: flex;
        .imgBox{
            height: 100%;
            position: relative;
            .img{
                height: 100%;
                border-radius: .1rem;
                /* width: 2.4rem; */
            }
        }
        .info{
            position: relative;
            margin-left: .18rem;
            .info_title{
                color: #222222;
                font-size: .3rem;
                 text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
                width: 4.4rem;
            }
            .info_tips{
                position: absolute;
                top: 1rem;
                color: #FF9007;
                font-size: .24rem;
                line-height: 1;
                display: flex;
                align-items: center;
                img{
                    height: .24rem;
                    width: .24rem;
                }
            }
            .info_money{
                line-height: 1;
                color: #FF2A00;
                display: flex;
                align-items: flex-end;
                font-size: .24rem;
                position: absolute;
                bottom: .7rem;
                .price{
                font-weight: 600;
                    font-size: .34rem;
                }
                .old_price{
                    background: url('/static/img/farmShop/money_bg.png');
                    background-size: 100% 100%;
                    font-size: .2rem;
                    color: #FF0000;
                    height: .34rem;
                    width: 1.2rem;
                    text-align: center;
                    line-height: .4rem;
                    margin-left: .18rem;
                }

            }
            .info_cash{
                position: absolute;
                bottom: .76rem;
                bottom: 0;
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                ._cash_have{
                    color: #555555;
                    font-size: .2rem;
                }
            }
        }
    }
    .rewardItem{
        height: 2.13rem;
        .info_price{
            position: absolute;
            top: .8rem;
            height: .6rem;
            width: 2.8rem;
            background: url('/static/img/farmShop/price_bg.png');
            background-size: 100% 100%;
            border-radius: .1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FF0000;
            font-size: .24rem;
        }
    }
</style>
