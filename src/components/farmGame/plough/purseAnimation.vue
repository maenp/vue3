<template>
    <div class="purse">
        <div class="coinBox" v-for="(t,i) in 9" :key='i'>
            <transition name="skyUp">
                <div class="coin" v-if="up" :style="'top:'+(top+Math.random()*1-1)+'rem;left:'+(left+Math.random()*1-1)+'rem'"></div>
            </transition>
        </div>
        <transition name="fadeUp">
            <div class="toast" v-if="up" :style="'top:'+top+'rem;left:'+(left-1)+'rem'">
                <img src="/static/img/activity/game/main_gold.png" alt="">
                <span>+{{rewardVal}}</span>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    data(){
        return{
            up:false,
            top:0,
            left:0,
            rewardVal:''
        }
    },
    methods:{
        show(e,rewardVal){
            this.rewardVal=rewardVal
            this.top=(e.clientY/50)+0.5
            this.left=(e.clientX/50)+0.2
            this.up=true
            this.timer=setTimeout(() => {
                this.up=false
                clearTimeout(this.timer)
            }, 300);
        }
    }
}
</script>
<style lang="scss" scoped>
    .purse{
        position: absolute;
        left: 50%;
        top: 20%;
        z-index: 5;
        .coinBox{
            z-index: 100;
            
            .coin{
                position: fixed;
                top: 7.6rem;
                left:3.5rem;
                height: .32rem;
                width: .32rem;
                background: url("/static/img/activity/game/main_gold.png");
                background-size: 100% 100%;
                transition: 1s;
                /* transform: translate(112px,347px) rotate(0); */
            }
        }
            .toast{
                position: fixed;
                background: url('~@/static/img/farmGame/toast_bg.png');
                background-size: 100% 100%;
                height: .47rem;
                width: 1.7rem;
                display: flex;
                justify-content: center;
                padding: .05rem 0;
                color: #421E09;
                box-sizing: border-box;
                transition: 1s;
                img{
                    height: .3rem;
                    width: auto;
                    margin-right: .05rem;
                    margin-top: .03rem;
                }
            }
    }

/* .skyUp-enter{
    transform: translate(112px,347px) rotate(0);
}
.skyUp-enter-active{
    transition: 1s;
}
.skyUp-enter-to{
    transform: translateY(0%) rotateY(1080deg);
} */


.skyUp-leave{
    transform:rotate(0);
}
.skyUp-leave-to{
    top: 0.6rem !important;
    left:17% !important;
    transform:rotateY(1080deg);
}
.fadeUp-leave{
    opacity: 1;
}
.fadeUp-leave-to{
    transform: translateY(-.5rem);
    opacity: 0;
}
</style>