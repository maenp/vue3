let eventList = {}

const $on = (eventName,callback)=>{
    if(!eventList[eventName]){
        eventList[eventName] = [];
    }
    eventList[eventName].push(callback);
}
const $once = (eventName,callback)=>{//只绑定一次
    if(eventList[eventName])return;
    eventList[eventName] = [callback];
}

const $emit = (eventName,...params)=>{
    if(eventList[eventName]){
        let arr = eventList[eventName];
        arr.forEach(item => {
            item(...params);
        });
    }
}

const $off = (eventName,callback)=>{
    if(eventList[eventName]){
        if(callback){
            let index = eventList[eventName].indexOf(callback);
            eventList[eventName].splice(index,1);
        }else{
            eventList[eventName].length = 0;
        }
    }
} 
export default {
    $on,
    $once,
    $emit,
    $off
}