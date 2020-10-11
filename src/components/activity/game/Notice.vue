<template>
  <div class="pop_bg" v-if='showFlag' @touchmove.stop>
    <div class="pop_container">
      <div class="close" @click='close'></div>
      <ul class="nav">
        <li v-for='(item,index) in nav' :key='index' @click='toggle(item)'>
          <img :class='"img"+index' v-show='item.type==cur' :src="item.img" alt="">
        </li>
      </ul>
      <ul class="list">
        <li v-for='(item,index) in list' :key='index'>
          <div class="img_c">
            <div class="img_i">
              <img :src="item.headUrl" alt="">
            </div>
          </div>
          <div class="right">
            <!-- ios审核，红包券改为'金币' -->
            <div  v-if='$nativeBridge.iosCheck' class="msg">
                {{item.content.replace('红包券','金币')}}
            </div>
            <div v-else class="msg">{{item.content}}</div>
            <div class="time">{{item.strTime}}</div>
          </div>
        </li>
      </ul>
      <!-- 没有列表数据 -->
      <div class="noData" v-if='list.length==0'>-暂无数据-</div>
    </div>

  </div>
</template>

<script>
import Qs from "qs";
export default {
  data() {
    return {
      showFlag: false,
      token: "",
      cur: 1,
      nav: [
        {
          name: "情报",
          img: "/static/img/activity/game/notice_qingbao.png",
          type: 1
        },
        {
          name: "我的",
          img: "/static/img/activity/game/notice_mine.png",
          type: 2
        }
      ],
      list: [
        {
          headUrl:
            "http://cbdmcn.oss-cn-beijing.aliyuncs.com/user/user_default_head.png",
          content: "小白趁你不在时摘走田园大量作物，损失100金币！",
          strTime: "10分钟之前"
        },
        {},
        {},
        {},
        {},
        {},
        {},
        {}
      ],
      MessageObj: {} //信息对象
    };
  },

  created() {},
  mounted() {},
  methods: {
    show(token) {
      this.showFlag = true;
      this.token = token;
      this.list = [];
      this.getData()
    },
    getData(){
      this.$http
        .post("/gameDynamicMess/getMessage?token=" + this.token)
        .then(res => {
          if (res.data.resultCode == 0) {
            var MessageObj = res.data.obj;
            this.MessageObj=MessageObj
            //先显示有数据的列表
              if (MessageObj.information.length == 0 && MessageObj.mine.length > 0) {
                this.cur = 2;
                this.list = MessageObj.mine;
              } else {
                this.cur = 1;
                this.list = MessageObj.information;
              }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    close() {
      this.$com.bottonAudioPlay();
      this.showFlag = false;
      this.$emit("notice_flag_fn");
      this.cur = 1;
    },
    toggle(obj) {
      this.list=[]
      document.getElementsByClassName("list")[0].scrollTop = 0;
      this.$com.bottonAudioPlay();
      this.cur = obj.type;
      //重新设置list
      if (obj.type == 1) {
        this.list = this.MessageObj.information;
      } else {
        this.list = this.MessageObj.mine;
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" type="stylesheet/scss">
.pop_container {
  width: 7.46rem;
  height: 9.89rem;
  background: url("/static/img/activity/game/notice_bg.png") no-repeat;
  background-size: cover;
  .close {
    position: absolute;
    top: 0;
    right: 0.5rem;
    width: 0.6rem;
    height: 0.6rem;
  }
}
.nav {
  position: relative;
  margin-left: 1.37rem;
  display: flex;
  width: 4.76rem;
  height: 0.59rem;
  justify-content: space-around;
  li {
    width: 2.38rem;
    img {
      position: absolute;
      top: 0.1rem;
      width: 2.46rem;
      height: 0.59rem;
    }
    .img0 {
      left: 0;
    }
    .img1 {
      right: 0;
    }
  }
}

.list {
  width: 6.24rem;
  margin: 0.5rem auto 0;
  max-height: 8.06rem;
  overflow-y: scroll;
  li {
    display: flex;
    margin-top: 0.14rem;
    width: 6.24rem;
    height: 1.44rem;
    padding: 0.17rem 0.16rem;
    box-sizing: border-box;
    background: linear-gradient(
      0deg,
      rgba(255, 215, 172, 1),
      rgba(255, 248, 236, 1)
    );
    box-shadow: 0px 0.02rem 0.04rem 0 rgba(255, 204, 163, 1);
    border-radius: 0.16rem;
    font-size: 0.28rem;
    font-weight: bold;
    color: #673922;
    .img_c {
      flex-shrink: 0;
      position: relative;
      margin-right: 0.16rem;
      width: 1.08rem;
      height: 1.08rem;
      border-radius: 50%;
      background: linear-gradient(
        0deg,
        rgba(251, 86, 38, 1) 0%,
        rgba(247, 142, 57, 1) 100%
      );
      box-shadow: 0 0.01rem 0.01rem 0 rgba(250, 196, 128, 1),
        0 0.01rem 0.02rem 0 rgba(167, 91, 22, 1);
    }
    .img_i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0.98rem;
      height: 0.98rem;
      background: rgba(255, 217, 175, 1);
      box-shadow: 0 0 0.02rem 0.02rem rgba(255, 237, 201, 1);
      border-radius: 50%;
      overflow: hidden;
    }
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0.9rem;
      height: 0.9rem;
      border-radius: 50%;
      overflow: hidden;
    }
    .time {
      font-size: 0.24rem;
      color: #fa5a28;
      text-align: right;
      font-weight: normal;
    }
  }
}
.noData{
  margin-top: 1rem;
  text-align: center;
  color: #E4B17D;
  font-size: .36rem;
}
</style>
