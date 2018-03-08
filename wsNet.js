const cache = require('./data');
const WebSocket = require('ws');
const parseBlob = require('./parseBlob.js');
const consts = require('consts');
const EventBus = require('EventBus');

let WebSocketNet = class {
    constructor() {
        this.reconnectionNumber = -1;//重连次数
        this.ws = null;//WebSocket
        this.isReconnection = true; //是否继续重连
        this.timer = null;//计时器
    }

    createWebSocket() {
        // 打开一个 web socket
        this.isReconnection = true;
        // this.ws = new webS("ws://localhost:8181");
        this.ws = new WebSocket("ws://localhost:8181");
        let me = this;

        this.ws.onopen = function()
        {// Web Socket 已连接上，使用 send() 方法发送数据
            this._print('连接成功');
            clearInterval(me.timer);//停止正在进行的计时器
            me.timer = null;
            me.reconnectionNumber = -1;//连接成功重置重连次数
        };

        this.ws.onmessage = function (msg)
        {
            this._print("已接收到数据...");
            me._cacheData(msg.data);
        };

        this.ws.onclose = function()
        {
            // 关闭 websocket
            this._print("连接已关闭...");
            me._reconnection(me.ws);
        };
    }

    //关闭连接
    closeWebSocket() {
        this.reconnectionNumber = -1;//客户端主动关闭的时候初始化重连次数
        this.isReconnection = false;//将标志置为false防止再重连
        this.ws.close();
        this._print('手动关闭连接.....');
        clearInterval(this.timer);//停止正在进行的计时器
        this.timer = null;
        this.ws = null;
    }

    //重连前的计时
    _reconnection(ws) {
        let me = this;
        this._print(me.isReconnection);
        if (ws.readyState !== 1) {
            if(me.isReconnection) {
                me.reconnectionNumber = me.reconnectionNumber + 1;//连接关闭的时候增加重连次数
                let time = Math.pow(2, me.reconnectionNumber)*1000;
                ws.close();
                me.timer = setTimeout(function() {
                    this._print('time-->',time);
                    me.createWebSocket();
                }, time);
            }
        }
        else {
            ws.send('发送数据');
        }
    }

    //处理并缓存取到的数据
    _cacheData(data) {
        if ('data instanceof Blob') { // 处理二进制信息
            data = parseBlob.parseBlobData(data);
            this._print(data);
        } else {//处理文本信息
            this._print(data);
        }
        // this._print(data);
        cache.setWsData(data);
        this._print('我是缓存数据:',cache.getWsData())
    }

    //发送信息
    _send() {
        let me = this;
        //字符串
        me.ws.send("Hello server!");

        //json数据
        me.ws.send(JSON.stringify({
            'msg': 'payload'
        }));

        //ArrayBuffer
        let a = new Uint8Array([0,1,2]);
        me.ws.send(a);

        //blob
        // let blob = new Blob(['我是数据'],{
        //     type: "application/json"
        // });
        // me.ws.send(blob);
    }

    //输出
    _print(name, msg) {
        console.log(name, msg);
    }
};

//多个socket连接
// let webs = new WebSocketNet();
// webs.createWebSocket();
module.exports = WebSocketNet;