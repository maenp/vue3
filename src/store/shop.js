import Vuex from 'vuex'
import { getTopListApi ,goodsCheckApi} from "./../api/shop";
import game from './index'
const state = {
    topList: [
        // {
        //   egou_commission1: 142,
        //   is_tmall: 1,
        //   item_id: 584416,
        //   label1_money: 2000,
        //   m_useq_price: 690,
        //   pic_url:
        //     "https://img.alicdn.com/bao/uploaded/TB1i5LBAeL2gK0jSZFmXXc7iXXa.png",
        //   title: "【可孚】医用一次性防护口罩50个"
        // }
    ],
    bRate: 10, //金币兑换抵扣券汇率
};
const getters = {

};
const mutations = {
    topListUpdate(state, newVal) {
        let topList = state.topList
        console.log(topList);
        state.topList = topList.concat(newVal.data)
        state.bRate = newVal.bRate
    }
};
let goodsCheckBusy=false
const actions = {
    async getShopTopListHandler({ commit,state}, obj) {
        console.log('shop');
        let {page_no}=obj
        if(page_no===1&&state.topList.length)return
        let { data } = await getTopListApi({page_no})
        if (data.code === 0) {
            commit('topListUpdate', data.data)
            return false
        }
        
    },
    async goodsCheckHandler({state},item){//点击商品
        if(goodsCheckBusy){
            VM.$toast('领取中，请稍后...')
            return
        }
        goodsCheckBusy=true
        let {userId,myInfo:{gold}}=game.state
        let { data } = await goodsCheckApi({num_iid:item.num_iid,user_id:userId})
        goodsCheckBusy=false
        if (data.code === 0) {
            let money=item.label1_money/100*state.bRate //该商品兑换所需要的金币
            if(gold>=money){
                VM.Observer.$emit('cashBox',
                    {
                        ...item,
                        couponendtime:data.data.couponendtime,
                        coupon_click_url:encodeURIComponent(data.data.coupon_click_url),
                        item_url:encodeURIComponent(data.data.item_url),
                        gold:item.label1_money/100*state.bRate
                    }
                )
            }else{
                VM.$toast('金币不足')
            }

        }else{
            VM.$toast(data.sub_msg||data.msg)
        }

    }
};
export default Vuex.createStore({
    state,mutations,actions,getters
});