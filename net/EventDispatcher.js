/**
 * Created by apple on 16/8/3.
 */

var EventDispatcher = function () {
    this.listenersByEvent = {};
    this.onceListenersByEvent = {};
};
//判断是否有此侦听器
EventDispatcher.prototype.hasEvent = function (event) {
    return this.listenersByEvent[event] != null;
};

//判断是否有此侦听器
EventDispatcher.prototype.hasOnceEvent = function (event) {
    return this.onceListenersByEvent[event] != null;
};

//添加事件侦听器
EventDispatcher.prototype.addEventListener = function (event, listener, listenerContext) {
    null == this.listenersByEvent[event] && (this.listenersByEvent[event] = []);
    this.listenersByEvent[event].push({listener: listener, scope: listenerContext})
};

//添加一次性侦听事件
EventDispatcher.prototype.addOnceEventListener = function (event, listener, listenerContext) {
    null == this.onceListenersByEvent[event] && (this.onceListenersByEvent[event] = []);
    this.onceListenersByEvent[event].push({listener: listener, scope: listenerContext})
};

//移除事件侦听器
EventDispatcher.prototype.removeEventListener = function (event, listener) {
    var c = this.listenersByEvent[event];
    if (null != c) {
        var len = c.length;
        for (var d = 0; d < len; d++)
            if (c[d].listener === listener) {
                c.splice(d, 1);
                break
            }
    }
};

//移除所有监听事件
EventDispatcher.prototype.removeAllEventListener = function () {
    this.listenersByEvent = null;
    this.listenersByEvent = {};
    this.onceListenersByEvent = null;
    this.onceListenersByEvent = {};

};

//派发事件
EventDispatcher.prototype.dispatchEvent = function (event, eventData) {
    //持久事件
    var c = this.listenersByEvent[event];
    if (c && 0 < c.length) {
        var len = c.length;
        for (var d = 0; d < len; d++) {
            if (c[d] && c[d].listener)
                c[d].listener.call(c[d].scope, eventData);
            else
                cc.log("没有注册处理事件", event, eventData);
        }
    }
    //一次性事件
    var oc = this.onceListenersByEvent[event];
    if (oc && 0 < oc.length) {
        var olen = oc.length;
        for (var od = 0; od < olen; od++) {
            oc[od].listener.call(oc[od].scope, eventData);
        }
        oc.splice(0, olen);
    }

};

EventDispatcher.prototype.emit = function (event, eventData) {
    this.dispatchEvent(event, eventData);
};

EventDispatcher.prototype.on = function (event, listener, listenerContext) {
    this.addEventListener(event, listener, listenerContext);
};


EventDispatcher.prototype.off = function (event, listener) {
    this.removeEventListener(event, listener);
};

//监听事件所有监听事件
EventDispatcher.prototype.getListeners = function (event) {
    return this.listenersByEvent[event];
};

module.exports = EventDispatcher;