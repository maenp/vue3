<template>
  <div class='tabsList' ref="tabsList">
    <div class="tabsBox">
    <div :class="[{ tabsFixed: isFixed }, 'tabs']" ref="tabs">
      <ul>
        <li
          v-for="(t,i) in tabs"
          :key="t.name"
          :class="activeTab === i ? 'activeTab' : ''"
          @click="clickTabHandler($event,i)"
        >
          {{ t.name }}
        </li>
      </ul>
    </div>
    </div>

    <div class="list" @touchstart="touchStartHandler" @touchmove="touchMoveHandler">
      <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <li v-for="(t) in list" :key="t.item_id">
            <TabsItem :item="t.item"/>
        </li>
      </ul>
    </div>
    <ListLoading/>
  </div>
</template>
<script>
import { getTabsApi, getGoodsListApi } from "./../../api/shop";
import ListLoading from "./listLoading";
import TabsItem from './tabsItem'
export default {
  components: { TabsItem ,ListLoading},
  mounted() {
    this.getTabsHandelr();
    this.tabs_offsetTop=this.$refs.tabs.offsetTop
    this.scrollDom = document.getElementById('shop');
    this.scrollDom.addEventListener("scroll", this.scrollHandler);
    this.time=0
  },
  data() {
    return {
      tabs: [],
      list: [],
      activeTab: 0,
      page_no: 1,
      busy:true,
      isFixed:false
    };
  },
  methods: {
    touchStartHandler(e) {
      this.startClientX = e.changedTouches[0].clientX
      this.startClientY = e.changedTouches[0].clientY
    },
    touchMoveHandler(e){
        if (!this.startClientX) return
        let clientX = e.changedTouches[0].clientX
        let clientY = e.changedTouches[0].clientY
        if(Math.abs(clientY-this.startClientY)>100)return
        if (clientX - this.startClientX > 100) {
            this.touchEndHandler(-1)
        } else if (clientX - this.startClientX < -100) {
          this.touchEndHandler(1)
        }
    },
    touchEndHandler(num){
        let activeTab=this.activeTab+num
        if(activeTab<0||activeTab>this.tabs.length-1)return
        this.activeTab=activeTab
        this.startClientX = 0
        this.getTabsListHandler('tabs');
        let targetTab=this.$refs.tabs.firstChild.children[activeTab]
        this.tabScrollCenter(targetTab);
    },

    scrollHandler(e) {
      let scrollTop = e.target.scrollTop;
      let time=new Date().getTime()
      if(time-this.time<50)return
      this.time=time
      if(scrollTop>this.tabs_offsetTop){
          this.isFixed=true
      }else{
          this.isFixed=false
      }
    },
    toTopHandler(){
        if(!this.scrollDom)this.scrollDom=document.getElementById('shop')
        this.scrollDom.scrollTop=this.tabs_offsetTop
    },
    loadMore() {
      this.busy = true
      this.page_no+=1
      this.getTabsListHandler('load');
    },
    getTabsHandelr() {//获取标题列表
      getTabsApi().then(({ data }) => {
        if (data.code === 0) {
          this.tabs = data.data;
          this.getTabsListHandler()
        }
      });
    },
    tabScrollCenter(e){//tab定位
      let srcElement=e.srcElement||e
      let tab_offsetLeft=srcElement.offsetLeft
      let tab_width=srcElement.clientWidth
      let tabBox_width=this.$refs.tabs.clientWidth
      let distance
      // if(tab_offsetLeft<tabBox_width / 2){
      //   distance=0
      // }else{
        distance = tab_offsetLeft - tabBox_width / 2 + tab_width / 2;
      // }
      // console.log(tab_offsetLeft,tabBox_width,tab_width);
      // console.dir(distance);
      this.$refs.tabs.scrollLeft=distance
    },
    clickTabHandler(e,index) {//点击标题
      this.busy = false
      this.toTopHandler()
      this.tabScrollCenter(e)
      this.activeTab = index;
      this.page_no=1
      this.getTabsListHandler('tabs');
    },
    getTabsListHandler(source) {//获取列表
    let tab=this.tabs[this.activeTab]
    let page=this.tabs[this.activeTab].page||'index'
    if(source==='tabs')this.buttonEvent(tab)
      getGoodsListApi({
        cat_lv1_id:tab.cid,
        page,
        page_no: this.page_no
      }).then(({ data }) => {
        if (data.code === 0) {
            if(source==='tabs'){
                this.list=data.data.data
            }else{
                if(this.busy)this.busy = false
                this.list=this.list.concat(data.data.data)
            }
            // console.log(data);
        }
      });
    },
    buttonEvent(tab){
      this.$button_click('prodtab','','','',tab.cid,tab.name);

    }
  }
};
</script>
<style lang="scss" scoped>
.tabsList {
    min-height: 100vh;
    background: #fff;
    .tabsBox{
        height: .8rem;
    }
  .tabs {
    overflow: scroll;
    background: #fff;
    position: relative;
    scroll-behavior:smooth;
    /* position: sticky; */
    z-index: 10;
    top: 0;
    height: .8rem;
    width: 100%;
    box-sizing: border-box;
    ul {
      color: #008f00;
      font-size: 0.32rem;
      width: max-content;
      padding: 0 0.15rem;
      line-height: .8rem;
      height: 100%;
      li {
        float: left;
        padding: 0 0.15rem;
        font-weight: 400;
      }
      .activeTab {
        font-weight: 700;
        position: relative;
      }
      .activeTab::after {
        content: "";
        position: absolute;
        width: 0.4rem;
        height: 0.06rem;
        background: #008f00;
        border-radius: 0.05rem;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .tabsFixed{
      position: fixed;
  }
  .list{
/* height: 100vh;
overflow: scroll; */
          padding: 0.2rem .2rem 0;
      ul{
          li{
              display: flex;
              justify-content: center;
              margin-bottom: .2rem;
          }
      }
  }
}
</style>
