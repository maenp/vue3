<template>
    <div class="loading">{{prompt}}</div>
</template>
<script>
export default {
    props:{
        prompt:{
            type:String,
            default:'正在加载中...'
        }
    }
    
}
</script>
<style lang="scss" scoped>
    .loading{
        text-align: center;
        height: .6rem;
        line-height: .6rem;
    }
</style>