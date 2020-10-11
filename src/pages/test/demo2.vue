<template>
  <div>Demo2</div>
  <p @click="addHandle">{{ state.target }}</p>
  <p @click="addHandle">{{ state.count }}</p>
</template>
<script>
import { useStore,mapMutations } from "vuex";
import {getPlantInfoApi} from './../../api';
import {getToken,isTourist} from './../../util/common'
import shop from './../../store/shop'
export default {
  setup() {
    const store = useStore();
    function addHandle() {
      store.commit("add",'2');
    }
    console.log(store.state.shop.target);
    console.log(shop.commit('updateTarget','更新了'));
    return {
      state: store.state.shop,
      addHandle,
    };
  },
  mounted(){
    this.getToken()
  },
  methods:{
    async getToken(){
      let token=await getToken()
      let data=await isTourist(token)
      console.log(data);
    }
  }
};
</script>
