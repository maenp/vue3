<template>
  <div class="empty">
    <div class="content">
      <img :src="`/static/img/farmShop/${source}_empty.png`" alt="" />
      {{source==='reward'?'暂无记录，收割植物开宝箱即可收获～':'暂无兑换记录，赶快赚金币来兑换吧～'}}
    </div>
  </div>
</template>
<script>
export default {
    props:['source']
}
</script>
<style lang="scss" scoped>
.empty{
    margin-top: 3.5rem;
    .content{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        font-size: .24rem;
        color: #10940A;
        height: 2.3rem;
        img{
            width: 1.6rem;
            height: 1.86rem;

        }

    }
}
</style>
