import {http} from './../util/http'
const baseURL = "http://m.egou.com/api/rest.htm";
const defaultParams = { //设置默认参数
    term: 3,
    mtag: 123,
    uid: 100000,
    site: 1,
    chn: 'ttl',
};
const egouget = (url, params) => {
    params = Object.assign({ ...defaultParams }, { ...params },{method:url});
    return http({
        baseURL,
        params
    })
}
//热销榜单的 商品列表
// temai.item.hotsale.data
// act.temai.hotsale.data
export const getTopListApi = (data) => egouget("act.temai.hotsale.data", {
    ...data,
    page_size: 20,
    cat_lv1_id:5,

    saleListType: 1,
    fields:"num_iid,volume,m_discount_price,label1_status,recommendation,item_id,pic_url,title,m_useq_price,label1_money,egou_commission1,is_tmall"
})
//获取首页列表的 tabs
export const getTabsApi=()=>egouget("act.pagecat.lv1.get",{
    page: 'index',
    fields: 'name,cid,'
})
//获取首页列表的 商品
// temai.items.show.get
// act.items.show.get
export const getGoodsListApi=(data)=>egouget("act.items.show.get",{
    ...data,
    data_type: 'item',
    page_size: 20,
    item_fields: "num_iid,m_discount_price,label1_status,recommendation,item_id,pic_url,title,m_useq_price,label1_money,egou_commission1,is_tmall,volume"
})
//点击商品判断商品当前状态
export const goodsCheckApi=(data)=>egouget("act.fram.check.get",{
    ...data
})