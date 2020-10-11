import store from '@/store'
import nativeBridge from "@/util/nativeBridge";
//页面、弹窗
const plant_page = {
  viewName: 'h5_view_plant_page',
  viewDisplayName: '主页面',
}
const dlg_plant = {
  viewName: 'h5_dlg_plant',
  viewDisplayName: '种植',
}
const steal_page = {
  viewName: 'h5_view_steal_page',
  viewDisplayName: '偷菜页面',
}
const dlg_wheel = {
  viewName: 'h5_dlg_wheel',
  viewDisplayName: '转盘',
}
const shop_page = {
  viewName: 'h5_shop',
  viewDisplayName: '商店页面',
}
const hot_page = {
  viewName: 'h5_hotprod',
  viewDisplayName: '榜单页面',
}
const record_page = {
  viewName: 'h5_prodrecord',
  viewDisplayName: '记录页面',
}
//按钮配置
const config = {
  sign: {
    ...plant_page,
    buttonId: 'h5_btn_sign_in',
    buttonDisplayName: '签到'
  },
  ball: {
    ...plant_page,
    buttonId: 'h5_btn_ball',
    buttonDisplayName: '气球'
  },
  award: {
    ...plant_page,
    buttonId: 'h5_btn_first_award',
    buttonDisplayName: '首次奖励'
  },
  notice: {
    ...plant_page,
    buttonId: 'h5_btn_user_msg',
    buttonDisplayName: '动态'
  },
  friends: {
    ...plant_page,
    buttonId: 'h5_btn_user_friend',
    buttonDisplayName: '好友'
  },
  gonglue: {
    ...plant_page,
    buttonId: 'h5_btn_user_gonglue',
    buttonDisplayName: '攻略'
  },
  invite: {
    ...plant_page,
    buttonId: 'h5_btn_user_invite',
    buttonDisplayName: '邀请'
  },
  shop: {
    ...plant_page,
    buttonId: 'h5_btn_user_shop',
    buttonDisplayName: '商店'
  },
  turn: {
    ...plant_page,
    buttonId: 'h5_btn_turn',
    buttonDisplayName: '转盘'
  },
  task: {
    ...plant_page,
    buttonId: 'h5_btn_task',
    buttonDisplayName: '任务'
  },
  cash: {
    ...plant_page,
    buttonId: 'h5_btn_cash',
    buttonDisplayName: '提现'
  },
  user: {
    ...plant_page,
    buttonId: 'h5_btn_user_icon',
    buttonDisplayName: '个人中心'
  },
  time_award: {
    ...plant_page,
    buttonId: 'h5_btn_time_award',
    buttonDisplayName: '计时奖励'
  },
  time_award_enter: {
    ...plant_page,
    buttonId: 'h5_btn_time_award_enter',
    buttonDisplayName: '计时奖励入口'
  },
  plant: {
    ...plant_page,
    buttonId: 'h5_btn_plant',
    buttonDisplayName: '种植'
  },
  harvest: {
    ...plant_page,
    buttonId: 'h5_btn_harvest',
    buttonDisplayName: '收获'
  },
  lease: {
    ...plant_page,
    buttonId: 'h5_btn_Lease',
    buttonDisplayName: '扩建'
  },
  lease_enter: {
    ...plant_page,
    buttonId: 'h5_btn_Lease_enter',
    buttonDisplayName: '扩建入口'
  },
  gain: {
    ...plant_page,
    buttonId: 'h5_btn_gain',
    buttonDisplayName: '收割作物'
  },
  box: {
    ...plant_page,
    buttonId: 'h5_btn_box',
    buttonDisplayName: '宝箱'
  },
  dog: {
    ...plant_page,
    buttonId: 'h5_btn_dog',
    buttonDisplayName: '点击小狗'
  },
  land: {
    ...dlg_plant,
    buttonId: 'h5_btn_land',
    buttonDisplayName: '种地'
  },
  shifei: {
    ...dlg_plant,
    buttonId: 'h5_btn_shifei',
    buttonDisplayName: '施肥'
  },
  //首页红包弹窗1倍
  plant_redBag1: {
    ...plant_page,
    buttonId: 'h5_btn_plant_redBag1',
    buttonDisplayName: '首页红包1倍奖励'
  },
  //首页红包弹窗20倍
  plant_redBag20: {
    ...plant_page,
    buttonId: 'h5_btn_plant_redBag20',
    buttonDisplayName: '首页红包20倍奖励'
  },
  //首页红包弹窗1倍
  steal_redBag1: {
    ...steal_page,
    buttonId: 'h5_btn_steal_redBag1',
    buttonDisplayName: '偷菜页红包1倍奖励'
  },
  //首页红包弹窗20倍
  steal_redBag20: {
    ...steal_page,
    buttonId: 'h5_btn_steal_redBag20',
    buttonDisplayName: '偷菜页红包20倍奖励'
  },




  wheel: {
    ...dlg_wheel,
    buttonId: 'h5_btn_wheel',
    buttonDisplayName: '转盘转动'
  },
  steal_back: {
    ...steal_page,
    buttonId: 'h5_btn_steal_back',
    buttonDisplayName: '偷菜-返回'
  },
  steal_gain: {
    ...steal_page,
    buttonId: 'h5_btn_steal_gain',
    buttonDisplayName: '偷菜-收割'
  },
  steal_harvest: {
    ...steal_page,
    buttonId: 'h5_btn_steal_harvest',
    buttonDisplayName: '偷菜-收获'
  },
  
  
  prod:{
    ...shop_page,
    buttonId: 'h5_btn_shop_prod',
    buttonDisplayName: '商店列表商品'
  },
  hotprod:{
    ...shop_page,
    buttonId: 'h5_btn_shop_hotprod',
    buttonDisplayName: '商店榜单商品'
  },
  prodtab:{
    ...shop_page,
    buttonId: 'h5_btn_prodcatbar',
    buttonDisplayName: '商店商品类别'
  },
  hotprodlist:{
    ...hot_page,
    buttonId: 'h5_btn_shop_hotprodlist',
    buttonDisplayName: '榜单商品列表'
  },
  rec_cash:{
    ...record_page,
    buttonId: 'h5_btn_excprodlist',
    buttonDisplayName: '我的记录兑换商品'
  },
  rec_reward:{
    ...record_page,
    buttonId: 'h5_btn_boxprodlist',
    buttonDisplayName: '我的记录中奖商品'
  },
  exc_goods:{
    viewName: 'h5_extprod_layer',
    viewDisplayName: '商品兑换弹层',
    buttonId: 'button h5_btn_extprod',
    buttonDisplayName: '兑换商品按钮'
  },
}
/**
 * 
viewName	该页面的子模块名称，或者弹窗名称，例如主页面的种植模块
viewDisplayName	模块的中文名称
buttonId	button的唯一命名，例如 tixian
buttonDisplayName	button上的显示文案，例如 提现
itemId	如果是列表页，可以填列表的关键id，甚至position，或者分享的id
itemName	如果是列表页，可以填列表的一些附加属性，或者分享描述
userGrade	用户当前等级
gold	用户当前的金币
strength	用户当前体力值
regBagVal	用户当前的红包券数量
awardTypeId	事件如果发生奖励id，没有填空
awardTypeName	事件如果发生奖励，奖励类型，红包券，金币，体力，狗粮，化肥，种子
awardNumber	事件如果发生奖励，奖励额度
 */

export default function button_click(key, awardTypeId, awardTypeName, awardNumber, itemId, itemName) {
  awardTypeName = awardTypeName ? awardTypeName : ''
  awardNumber = awardNumber ? awardNumber : ''
  itemId = itemId ? itemId : ''
  itemName = itemName ? itemName : ''
  awardTypeId = awardTypeId ? awardTypeId : ''
  let { userGrade, gold, strength, regBagVal, } = store.state.myInfo
  let {viewName,viewDisplayName,buttonId,buttonDisplayName}=config[key]
  nativeBridge.handler('buttonEventAllParams', true, 
    viewName,viewDisplayName,buttonId,buttonDisplayName,
    itemId+'', itemName, 
    userGrade+'',gold+'',strength+'',regBagVal+'', 
    awardTypeId+'', awardTypeName, awardNumber+''
  )
}



/**
 * 普通按钮
 * this.$button_click(boxName);
 * 种植按钮
 * this.$button_click('land','','','',id,itemName);
 * 奖励按钮
 * this.$button_click('gain',1,'金币',rewardVal);
 */