<template>
    <div class="audio">
        <!-- 狗叫声 -->
        <audio preload="auto" ref="bark_audio" :src="require('@/static/music/farmGame/bark.mp3')" type="audio/mpeg"></audio>
        <!-- 按钮音效 -->
        <audio preload="auto" ref="but_audio" id="butAudio" :src="require('@/static/music/farmGame/button_audio.mp3')" type="audio/mpeg"></audio>
        <!-- 转盘转到金币音效 -->
        <audio preload="auto" ref="turn_gold_audio" :src="require('@/static/music/farmGame/turn_gold.mp3')" type="audio/mpeg"></audio>
        <!-- 转盘转到其他音效 -->
        <audio preload="auto" ref="turn_else_audio" :src="require('@/static/music/farmGame/turn_else.mp3')" type="audio/mpeg"></audio>
        <!-- 背景音乐 -->
        <audio preload="auto" loop id="plough_audio" ref="plough_audio" :src="require('@/static/music/farmGame/plough_bg.mp3')" type="audio/mpeg" />
        <!-- 偷菜背景音乐 -->
        <audio preload="auto" loop id="else_plough_audio" ref="else_plough_audio" :src="require('@/static/music/farmGame/else_ploufh_bg.mp3')" type="audio/mpeg"></audio>
    </div>
</template>
<script>
export default {
    created(){
        window.changeBgAudio = this.changeBgAudioHandler; //关闭背景音乐 1播放 0关闭
        this.Observer.$on('changeAudio',this.changeAudio)
    },
    methods:{
        changeAudio(id){

        }
    }
}
</script>
