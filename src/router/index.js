import { createRouter, createWebHashHistory } from 'vue-router'
import {loadImage} from "@/util/common"
import {HomeImg} from "./../assets/loadImage"
import Loading from "@/lib/loading"
const routes = [
  {
    path: '/',
    redirect: "/game"
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('./../pages/test/demo2.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('./../pages/game'),
    meta:{
      preload:true
    }
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 给路由设置守卫函数
router.beforeEach((to, form, next) => {
  // to表示将要访问的路径
  // form表示从那个页面跳转而来
  if(to.meta.preload){
    Loading.open();

    loadImage(HomeImg,(scale)=>{
      // console.log('加载'+scale*100+'%');
    }).then(()=>{
      Loading.close();
      console.log('加载完成');
      next()
    })
  }
  next()
})

export default router
