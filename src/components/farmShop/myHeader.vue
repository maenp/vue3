<template>
  <div class="header">
    <img class="img" src="/static/img/farmShop/back.png" @click="backHandler" alt="" />
    <div>{{title}}</div>
    <div class="img"></div>
  </div>
</template>
<script>
export default {
    props:['title'],
    methods:{
      backHandler(){
        this.$router.back()
      }
    }
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 1rem;
  background: #10940a;
  color: #fff;
  font-size: .36rem;
  box-sizing: border-box;
  padding:0 .22rem .12rem;

  .img{
      height: .54rem;
      width: .54rem;
  }
}
</style>
