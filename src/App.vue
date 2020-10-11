<template>
  <div id="app">
    <!-- <keep-alive :include="cachedViews"> -->
      <router-view v-if="isRouterAlive"></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
// const cachedViews='game,shop'
export default {
  name: 'App',
  provide(){
    return {
      reload: this.reload
    }
  },
  data(){
    return {
      // cachedViews:cachedViews,
      isRouterAlive: true
    }
  },
  methods:{
    reload(){
      this.isRouterAlive = false
      // this.cachedViews = ''
      this.$nextTick(() => {
        // this.cachedViews = cachedViews
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="scss">
  @import './assets/scss/app.scss';
</style>
