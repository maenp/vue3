import { createStore } from 'vuex'

const shop = createStore({
    namespaced: true,
    state: {
        target: 'xxx',
        bRate:'111'
    },
    
    mutations: {
        updateTarget(state, newTarget){
            state.target = newTarget
        }
    }
})
export default shop