import Loading from "./index.vue";
import { createApp } from 'vue'

class LoadingComponent{
    constructor(){
        this.init()
    }
    init(){
        this.vm = createApp(Loading)
        this.loadingBox=document.createElement("div")
        this.loadingBox.setAttribute('id','app2')
        document.body.appendChild(this.loadingBox)
    }
    open(){
        this.vm.mount('#app2')
    }
    close(){
        this.vm.unmount('#app2')
        this.loadingBox.remove()
    }
}

export default new LoadingComponent()
