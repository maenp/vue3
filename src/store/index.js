import Vuex from 'vuex'
import {
  getPlantInfoApi,
  getploughInfoApi,
  addPlantApi,
  setLeaseBlockApi,
  getTimeAwardListApi,
  addFertilizerApi,
  setFertilizerApi,
  harvestPlantApi
} from './../api'
import {loadImage} from './../util/common'
let timer
import shop from './shop'
const state={
    myInfo: {
      headImg: "http://cbdmcn.oss-cn-beijing.aliyuncs.com/user/user_default_head.png",
      isSign: false,
      gold: 0, //金币
      regBagVal: 0, //红包
      strength: 0, //体力
      userGrade: 0, //等级
      isFirstDraw:'' //是否获取到第一次奖励，true已经获取奖励，false未获取奖励
    }, //个人信息
    ploughList: [{
      blockId: 1, //地块id ,
      blockStatus: 1, //地块种植状态：0未种植，1种植，2宝箱,
      // plantId: null,//种植作物id ,
      // plantStatus: 1,//植物状态：0幼苗期，1成长期，2成熟期 ,
      // seedlingImg: null,//作物幼苗期图片 ,
      // growthImg: 'https://cbdmcn.oss-cn-beijing.aliyuncs.com/game/plant/pumpkin_mature.png',//作物成长期图片 ,
      // matureImg: null,//作物成熟期图片 ,
      // growthPeriodTime: null,//生长周期时间(单位：秒) ,
      // surplusTime: 1000,//倒计时时间(单位：秒)
      // ifLeaseBlock: 0,//是否为扩建地块: 0否，1是 ,
      // leaseSurplusTime: null,//扩建倒计时时间(单位：秒) ,
    },
    {
      // blockId: 1,//地块id ,
      // blockStatus: 2,//地块种植状态：0未种植，1种植，2宝箱,
    }, {}, {}, {}, {}, {
      blockId: 7,
      blockStatus: 0,
      ifLeaseBlock: 1,
    }, {
      blockId: 8,
      blockStatus: 0,
      ifLeaseBlock: 1,
    }, {
      blockId: 9,
      blockStatus: 0,
      ifLeaseBlock: 1,
    },
    ],
    plantList: [{
      id: 0,
      name: "作物种子",
      imgSrc: '~@/static/img/farmGame/plant',
      list: [
        {
          id: 1,
          name: "小白菜", //作物名称
          plantImg: "https://cbdmcn.oss-cn-beijing.aliyuncs.com/game/plant/sea_bottom.png", //作物图片
          growthPeroid: 120, //生长周期时长（单位：秒） ,
          probabilityDesc: "很小", //红包概率
          rewardGold: 400, //奖励金币
          sellPrice: 100, //出售单价
          stockNum: 0, //库存：针对稀有种子 ,
          type: 1, //作物类型：1 普通，2 稀有
          lockStatus: 1, //0 未解锁，1 已解锁
          plantGrade: 0, //作物等级
        },
      ]
    },
    {
      id: 1,
      name: "加速肥料",
      imgSrc: '~@/static/img/farmGame/Fertilizer',
      list: [{
        id: 4,
        plantImg: "http://mcnvideo.ertoutiao.com/task/1596102117937.png",
        name: "普通化肥",
        stockNum: 0, //库存
        acceleratedTime: 300, //加速时间
        ifVideoNumLimit: 0 //当日是否看视频增加次数到达上限：0 否，1 是 ,
      }]
    }
    ],
    nowSow: -1, //当前地块
    fertilizerId: null, //当前选中的化肥ID
    isFertilizer: false, //当前地块是否有可施肥的作物
    ploughTop: false, //种植弹窗显示/动画
    myInfoChange: 0, //绑定首页用户信息
    if_first_time: -1, //当前登录状态
    isHarvestAll: false,//是否有可收获的作物
    userId: 0,
    timeAwardList: [],
    ifUpperLimit: 0,//作物是否达到看视频领金币上限值: 0 未达到，1达到
    maxLvPlantIndex: 1,//最大等级作物在列表中的下标
    token:'',
}
const mutations = {
  tokenUpdate(state, newVal) {
    state.token = newVal
  },
  myInfoUpdate(state, newVal) {
    state.myInfo = newVal
  },
  timeAwardListUpdate(state, newVal) {
    state.timeAwardList = newVal
  },
  if_first_timeUpdate(state, newVal) {
    state.if_first_time = newVal.if_first_time
    state.userId = newVal.userId
    state.token = newVal.token
  },
  myInfoChangeUpdate(state, sort) { //触发首页用户信息更新
    if (!sort) sort = 1
    if (typeof sort !== 'string') sort += ''
    let randomNum = '-' + (Math.random() * 10000 + '').slice(0, 4)
    state.myInfoChange = sort + randomNum //更新信息
  },
  setPloughTopUpdate(state, newVal) {
    state.ploughTop = newVal
    if (timer) { //提前打开了种植弹窗 清掉5s后的预加载
      clearTimeout(timer)
      timer = null
    }
  },
  showFertilizer(state, newVal) { //显示施肥按钮 获取化肥ID
    if (newVal === 'default') {//默认选择第一个肥料
      let fertilizer = state.plantList[1].list[0]
      if (fertilizer.ifVideoNumLimit === 1 && fertilizer.stockNum < 1) {//肥料获取达到上限&库存不足
        VM.$toast('今日肥料加速机会已用完,明日继续')
      } else {
        state.fertilizerId = fertilizer.id
      }
      return
    }
    state.fertilizerId = newVal
  },
  ploughListUpdate(state, newVal) { //更新土地信息
    let first = false
    let firstLeaseBlock = true
    let fertilizer = false
    let nowSow = -1
    let isHarvest = false
    state.ploughList = newVal.map((t, i) => {
      let noLease = t.ifLeaseBlock && !t.leaseSurplusTime //未扩建
      let blockStatus = t.blockStatus //种植状态
      if (!isHarvest && t.plantStatus === 2) {//是否有可收获的作物
        isHarvest = true
      }

      if (firstLeaseBlock && noLease && !blockStatus) { //找到第一个扩建地块 竖牌子
        t.canLeaseBlock = true
        firstLeaseBlock = false
      }
      if (!fertilizer && t.surplusTime) { //是否有可施肥的土地
        fertilizer = true
      }



      if (first || (blockStatus || noLease)) { //已种植或未扩建
        return t
      } else {
        first = true
        t.sow = true
        nowSow = i
        return t
      }
    })
    state.nowSow = nowSow
    state.isFertilizer = fertilizer
    state.isHarvestAll = isHarvest
  },
  ploughInfoUpdate(state, newVal) { //更新种子肥料
    let { fertilizerList, plantList, ifUpperLimit } = newVal
    state.ifUpperLimit = ifUpperLimit
    state.plantList[0].list = plantList
    state.plantList[1].list = fertilizerList
    let maxLvPlantIndex = plantList.findIndex(t => t.lockStatus === 0)
    state.maxLvPlantIndex=maxLvPlantIndex-1
  },
  fertilizerNumUpdate(state, newVal) {//更新化肥数量
    let { fertilizerId,
      stockNum, ifVideoNumLimit,//施肥
      addNum,//看视频增加化肥
    } = newVal
    let fertilizerList = state.plantList[1].list
    let fertilizerIndex = fertilizerList.findIndex(t => t.id === fertilizerId)
    if (typeof stockNum === 'number') {
      fertilizerList[fertilizerIndex].stockNum = stockNum
      fertilizerList[fertilizerIndex].ifVideoNumLimit = ifVideoNumLimit
      if (stockNum <= 0) {//当前化肥用尽，清除施肥状态
        // this.$toast(data.obj.name+" 库存不足~");
        state.fertilizerId = null
      }
    } else if (typeof addNum === 'number') {
      fertilizerList[fertilizerIndex].stockNum += addNum
    }

  }
};
const actions = {
  getTimeAwardList({ commit, state }, obj) { //获取计时奖励列表
    if (obj.if_first_time === -1) { //未登录数据
      commit('timeAwardListUpdate', [{
        time: 0,
        icon: '/static/img/activity/game/main_gold.png'
      }])
      return
    }

    let timeAward_nextDay = localStorage.getItem('timeAward_nowDay')
    if (timeAward_nextDay === new Date().toLocaleDateString()) { //判断计时奖励是否过期   数据第二天要清空
      let timeAward = JSON.parse(localStorage.getItem('timeAward'))
      if (timeAward && timeAward[state.userId]) { //上次计时奖励未领取
        console.log('nextAward');
        commit('timeAwardListUpdate', timeAward[state.userId])
        return
      }
    } else {
      localStorage.setItem('timeAward_nowDay', new Date().toLocaleDateString())
      localStorage.removeItem('timeAward')
    }

    getTimeAwardListApi().then(({ data }) => {
      if (data.resultCode == 0) {
        commit('timeAwardListUpdate', data.obj)
      } else {
        console.log('计时列表', data.msg);
      }

    })
  },
  async addFertilizer({ dispatch, commit }, id) { //获取肥料
    let { data } = await addFertilizerApi(id)
    if (data.resultCode == 0) {
      let addNum = data.obj.addNum
      commit('fertilizerNumUpdate', { addNum, fertilizerId: id })//更新化肥个数
      VM.$toast("获得 肥料*" + addNum);
      return addNum;
    } else {
      VM.$toast(data.msg);
    }
  },
  async harvestPlant({ dispatch }, blockId) {//收获
    let { data } = await harvestPlantApi(blockId)
    if (data.resultCode !== '0' || data.obj.type === 1) dispatch('getPlantInfo')//更新土地
    return data
  },
  async setLeaseBlock({ dispatch }, blockId) { //扩建
    let { data } = await setLeaseBlockApi(blockId)
    dispatch('getPlantInfo')
    if (data.resultCode == 0) {
      VM.$toast('扩建成功');
      return true
    } else {
      console.log('扩建接口', data.msg);
    }
  },
  setFertilizer({ commit, dispatch, state }, blockId) {//施肥
    let fertilizerId = state.fertilizerId
    setFertilizerApi(blockId, fertilizerId).then(({ data }) => {
      if (data.resultCode == 0) {
        let obj = data.obj
        commit('fertilizerNumUpdate', { stockNum: obj.stockNum, fertilizerId, ifVideoNumLimit: obj.ifVideoNumLimit })//更新化肥个数
        dispatch('getPlantInfo')//更新土地
      } else {
        console.log('施肥接口', data.msg);
      }
    })
  },
  addPlantInfo({ commit, dispatch, state }, obj) { //种植
    let nowSow = state.nowSow + 1
    let {plantId,type,itemName}=obj
    if(itemName)VM.$button_click("land", "", "", "", plantId, itemName);//埋点

    //首次种植通知客户端
    // let firstPloughId=localStorage.getItem('firstPlough')
    // let userId=state.userId
    // console.log(VM.firstPlant);
    // if(VM.firstPlant){
    //   VM.$nativeBridge.handler('firstPlant',true)
    //   VM.firstPlant=null
    // }
    
    addPlantApi(nowSow, plantId).then(({ data }) => {
      dispatch('getPlantInfo')
      if (data.resultCode == 0) {
        if (type === 2) dispatch('getPloughInfo') //种植稀有种子  刷新种植信息
        commit('myInfoChangeUpdate') //更新个人信息
      } else if (data.resultCode == 3001) {
        VM.$toast('你点的太快啦~')
        console.log('种植接口', data.msg);
      } else if (data.resultCode == 3017) {
        VM.$toast('您的等级不足，快去升级吧')
        console.log('种植接口', data.msg);
      } else {
        VM.$toast(data.msg)
        console.log('种植接口', data.msg);

      }
    })
  },
  getPlantInfo({ commit, dispatch }, obj) { //更新土地信息
    getPlantInfoApi(obj)
      .then(({ data }) => {
        if (data.resultCode == 0) {
          commit('ploughListUpdate', data.obj)
        } else {
          console.log('土地接口', data.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
    if (obj) {
      commit('if_first_timeUpdate', obj)
      dispatch('getPloughInfo', obj.token)
      dispatch('getTimeAwardList', obj)
      // loading.close();//关闭页面loadingloading
    }
  },
  getPloughInfo({ commit }, token) { //更新种子肥料
    timer && clearTimeout(timer)
    getploughInfoApi(token)
      .then(({ data }) => {
        if (data.resultCode == 0) {
          let obj = data.obj
          commit('ploughInfoUpdate', obj)

          if (token) { //首次加载  5s后预加载种子 化肥图片
            timer = setTimeout(_ => {
              let imgs = obj.fertilizerList.concat(obj.plantList).map(t => t.plantImg.trim())
              imgs = Array.from(new Set(imgs))
              loadImage(imgs)
            }, 5000)
          }
        } else {
          console.log('种子肥料列表接口', data.msg);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
};
const getters={
}
const modules={
  shop
}

export default Vuex.createStore({
    state,mutations,actions,modules,getters
});