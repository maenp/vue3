import store from './../../store'

export const num=(gold,u)=>{
  if (!u) u = 'w'
  if (gold > 9999) {
    return (gold / 10000).toFixed(1) + u
  } else {
    return gold || 0;
  }
}

// Vue.filter("num", (num, u) => {
//   if (!u) u = 'w'
//   if (num > 9999) {
//     return (num / 10000).toFixed(1) + u
//   } else {
//     return num || 0;
//   }
// })

// Vue.filter("price", (num) => {
//   return num/100
// })

// let goldRate
// Vue.filter("goldRate", (num) => {
//   if(!goldRate)goldRate=store.state.shop.bRate
//   return num/100*goldRate
// })


// Vue.filter("timestamp", (num) => {
//   let str=new Date(num).toLocaleString()
//   str=str.replace(/\//g,'-')
//   return str
// })
// Vue.filter("imgsmall", (url) => {
//   console.log(url);
//   return url+'_150x150'
// })

