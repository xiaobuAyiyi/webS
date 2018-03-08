const consts = require('consts');
const EventBus = require('EventBus');

let cacheData = class {
    constructor(){
        this.wsData = null;
    }

    setWsData(data) {
        //缓存多条消息
        if(this.wsData = null) {
            this.wsData = [];
        }
        this.wsData.push(data);
        EventBus.emit(consts.Event.showWSData);//发送事件
    }
};

let cache = new cacheData();
module.exports = cache;

//侦听派发模式,观察者模式