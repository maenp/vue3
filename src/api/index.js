// import {
//   encryptByDESModeEBC
// } from './../../util/encryptDes'
import {http} from './../util/http'
let Token = '';
let UserId = '';

function queryString(obj) {
  let str = '';
  for (let key in obj) {
    str += key;
    str += '=';
    str += obj[key]
    str += '&'
  }
  return str.slice(0, -1)
}

function encodeHandler(param) {
  return param
  // if (window.DEV) return param
  // let key = Token || '' + ';lk23j0spd09f23';
  // let value = '';
  // let paramArr = Object.keys(param)
  // if (paramArr.length === 1) {
  //   let keyOne = paramArr[0]
  //   value = keyOne + '=' + param[keyOne]
  // } else {
  //   for (let key1 in {
  //       ...param
  //     }) {
  //     value += key1;
  //     value += "===";
  //     value += param[key1];
  //     value += "&&&"
  //   }
  //   value = value.slice(0, -3);
  // }
  // value = encryptByDESModeEBC(value, key);
  // return {
  //   value
  // }
}

//获取土地数据
export const getPlantInfoApi = (obj) => {
  if (obj && obj.token) { // 初始化token userId
    Token = obj.token
    UserId = obj.userId
  }
  return http("/game/plant/init/info", {
    params: {
      token: Token,
    }
  })
}
//获取种植数据
export const getploughInfoApi = (token = Token) => http("/game/plant/select/plant", {
  params: {
    token,
  }
})
/**
 * 种植接口 +
 * @param {number} blockId
 * @param {number} plantId
 */
export const addPlantApi = (blockId, plantId) => http.post(`/game/plant/add/plant?token=${Token}`,
  queryString(encodeHandler({
    blockId,
    plantId
  }))
)
/**
 * 施肥加速 +
 * @param {number} blockId 地块ID
 * @param {number} fertilizerId 化肥ID
 */
export const setFertilizerApi = (blockId, fertilizerId) => http.post(`/game/plant/user/fertilizer?token=${Token}`,
  queryString(encodeHandler({
    blockId,
    fertilizerId
  }))
)
/**
 * 看视频获取化肥 +
 * @param {number} fertilizerId 新增的肥料ID
 */
export const addFertilizerApi = (fertilizerId) => http.post(`/game/plant/add/fertilizer?token=${Token}`,
  queryString(encodeHandler({
    fertilizerId
  }))
)

/**
 * 扩建地块接口 +
 * @param {string} blockId 需要扩建的地块ID
 */
export const setLeaseBlockApi = (blockId) => http.post(`/game/plant/lease/block?token=${Token}`,
  queryString(encodeHandler({
    blockId
  }))
)
/**
 * 收获作物/偷菜 +
 * @param {string} blockId 地块ID
 * @param {string} userId 被收割的用户ID
 */
export const harvestPlantApi = (blockId) => http.post(`/game/plant/harvest/plant?token=${Token}`,
  queryString(encodeHandler({
    blockId,
    userid: UserId
  }))
)
/**
 * 收割领取红包券接口
 * @param {number} blockId 地块ID
 * @param {number} userid 用户ID
 * @param {number} rewardVal 红包券奖励值（收获接口的返回值）
 */
export const harvestRewardApi = (blockId, rewardVal, type) => http.post(`/game/plant/harvest/reward?token=${Token}`,

  queryString(encodeHandler({
    blockId,
    userid: UserId,
    rewardVal,
    receiveType: type
  })
  )
  
)
/**
 * 偷菜领取红包券接口
 * @param {number} blockId 地块ID
 * @param {number} userid 用户ID
 * @param {number} rewardVal 红包券奖励值（收获接口的返回值）
 * @param {number} userid 被偷人的ID
 */
export const ElseHarvestRewardApi = (blockId, rewardVal, type,userid) => http.post(`/game/plant/harvest/reward?token=${Token}`,

  queryString(encodeHandler({
    blockId,
    userid,
    rewardVal,
    receiveType: type
  })
  )
  
)

/**
 * 获取记时奖励列表
 */
export const getTimeAwardListApi = () => http(`/gameTimer/getTimeRewardList?token=${Token}`)
/**
 * 获取计时奖励
 */
export const getTimeAwardApi = (id) => http(`/gameTimer/getTimeReward?token=${Token}&id=${id}`)
/**
 * 领取宝箱奖励
 * @param {number} blockId 地块ID
 */
export const getBoxRewardApi = (blockId) => http.post(`/game/plant/received/treasureBox/reward?token=${Token}`, queryString(encodeHandler({
  blockId
})))
/**
 * 狗子的对话
 */
export const getDogValApi = () => http(`/sysEnt/getVal?token=${Token}`, {
  params: {
    key: "game_dog_ramd_say_info"
  }
})

/**
 * 看视频获取金币
 * @param {number} plantId 作物ID
 */
export const getGoldApi = (plantId) => http.post(`/game/plant/video/plant?token=${Token}`, queryString(encodeHandler({
  plantId
})))

/**
 * 偷菜收获接口
 * @param {number} blockId 地块ID
 * @param {number} userid 被偷菜的ID
 * @param {number} stealSource 偷菜来源
 */
export const getElsePLoughPlantApi = (blockId,userid,stealSource) => http.post(`/game/plant/harvest/plant?token=${Token}`, 
  queryString(encodeHandler({
    blockId,userid,stealSource
  }))
)

//点击兑换优惠券
export const saveMoneyApi = (data) => http.post(`/egou/exchang?token=${Token}`, 
  queryString(data)
)
//获取兑换列表
export const getCashListApi = (pageNum,type) => http(`/egou/selectList`, {
    params: {
      token:Token,
      pageSize:20,
      pageNum,
      type
    }
  }
)


