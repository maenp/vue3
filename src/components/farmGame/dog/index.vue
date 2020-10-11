<template>
  <div id="dog" ref='dog'></div>
</template>
<script>
import {res,weizhi} from './gou'
export default {
    data(){
        return{

        }
    },
    methods:{
      dogMoveHandler(){
        let dog=this.$refs.dog
        let next_left = 170;
        let next_top = 240;
        let count=0
        setTimeout(function () {
            
            dog.style.backgroundSize = "10.24rem 10.24rem";
            dog.style.width = res[weizhi[count]['res']]['w'] * 0.01 + "rem";
            dog.style.height = res[weizhi[count]['res']]['h'] * 0.01 + "rem";
            dog.style.backgroundPositionX = (1024 - res[weizhi[count]['res']]['x']) * 0.01 + "rem";
            dog.style.backgroundPositionY = (1024 - res[weizhi[count]['res']]['y']) * 0.01 + "rem";

            if (count >= 36 && count <= 71) {
                next_left = next_left + 5;
                next_top = next_top + 2.5;

            } else if (count >= 72 && count <= 109) {
                next_left = next_left - 4.75;
                next_top = next_top - 2.375;
            }
            dog.style.left = next_left/50 + "rem";
            dog.style.top = next_top/50 + "rem";

            count++;
            if (count == 140) {
                count = 0;
            }
        }, 120);
      }
    },
    mounted(){
      this.dogMoveHandler()
    }
};
</script>
<style lang="scss" scoped>
#dog {
  background-image: url("~@/static/img/farmGame/dog.png");
  position: fixed;
  z-index: 9;
}
</style>
