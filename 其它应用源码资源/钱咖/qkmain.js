define("event.target", [], function() {
    function t() {
        this.handlers = {}
    }
    return console.log("EventTarget Load!"),
    t.prototype = {
        constructor: t,
        addHandle: function(t, e) {
            "undefined" == typeof this.handlers[t] && (this.handlers[t] = []),
            this.handlers[t].push(e)
        },
        fire: function(t) {
            if (t.target || (t.target = this),
            this.handlers[t.type] instanceof Array)
                for (var e = this.handlers[t.type], n = 0, i = e.length; i > n; n++)
                    e[n](t)
        },
        removeHandler: function(t, e) {
            if (this.handlers[t] instanceof Array) {
                for (var n = this.handlers[t], i = 0, s = n.length; s > i && n[i] !== e; i++)
                    ;
                n.splice(i, 1)
            }
        }
    },
    t
}),
define("websocket", ["event.target"], function(t) {
    function e() {
        t.call(this),
        this.on = this.addHandle,
        this.name = "qk-websocket-" + (new Date).getTime(),
        console.info("websocket created => " + this.name)
    }
    function n(t, e) {
        console.log("主动发起 " + t + " =>", e)
    }
    return console.log("Qianka WebSocket Load!"),
    e.prototype = new t,
    e.prototype.constructor = e,
    e.prototype.connect = function(t) {
        this.socket = new WebSocket(t);
        var e = this.socket
          , n = this;
        e.onopen = function(t) {
            console.log("[QkWebSocket] 连接成功", t),
            n.fire({
                type: "open"
            }),
            n.isOpen = !0
        }
        ,
        e.onclose = function(t) {
            console.log("[QkWebSocket] 连接关闭", t),
            n.fire({
                type: "close"
            })
        }
        ,
        e.onmessage = function(t) {
            console.log("socket onmessage =>", t);
            var e = JSON.parse(t.data);
            if (2 == e.type)
                switch (e.action) {
                case "login":
                    n.fire({
                        type: "login",
                        data: e
                    });
                    break;
                case "lppa":
                    n.fire({
                        type: "lppa-" + e.sid,
                        data: e
                    });
                    break;
                case "task_started":
                    n.fire({
                        type: "taskstarted-" + e.sid,
                        data: e
                    });
                    break;
                case "task_verify":
                    n.fire({
                        type: "taskverify-" + e.sid,
                        data: e
                    });
                    break;
                case "task_verify_i9":
                    n.fire({
                        type: "taskverify-" + e.sid,
                        data: e
                    });
                    break;
                case "task_run_time_response":
                    n.fire({
                        type: "taskruntime-" + e.sid,
                        data: e
                    });
                    break;
                case "zs_task_started":
                    n.fire({
                        type: "zstaskstarted-" + e.sid,
                        data: e
                    });
                    break;
                case "zs_task_verify":
                    n.fire({
                        type: "zstaskverify-" + e.sid,
                        data: e
                    });
                    break;
                case "zs_task_verify_i9":
                    n.fire({
                        type: "zstaskverify-" + e.sid,
                        data: e
                    })
                }
            else
                switch (e.action) {
                case "task_result":
                    n.fire({
                        type: "taskresult",
                        data: e
                    });
                    break;
                case "zs_task_verify":
                    n.fire({
                        type: "zstaskverify",
                        data: e
                    });
                    break;
                default:
                    n.fire({
                        type: "notify",
                        data: e
                    })
                }
        }
    }
    ,
    e.prototype.disconnect = function() {
        var t = this.socket;
        t && (t.onclose = function(t) {
            console.log("[QkWebSocket] 主动关闭连接", t)
        }
        ,
        t.close())
    }
    ,
    e.prototype.login = function(t, e) {
        if (1 != this.socket.readyState)
            throw "[QkWebSocket] 错误：连接已关闭";
        var i = {
            action: "login",
            params: {
                session_id: t
            },
            sid: e,
            type: 1,
            sign: ""
        }
          , s = JSON.stringify(i);
        n("login", i),
        this.socket.send(s)
    }
    ,
    e.prototype.lppa = function(t, e) {
        if (1 != this.socket.readyState)
            throw "[QkWebSocket] 错误：连接已关闭";
        var i = {
            action: "lppa",
            params: {
                bid: t
            },
            sid: e,
            type: 1,
            sign: ""
        }
          , s = JSON.stringify(i);
        n("lppa", i),
        this.socket.send(s)
    }
    ,
    e.prototype.taskStarted = function(t, e, i) {
        if (1 != this.socket.readyState)
            throw "[QkWebSocket] 错误：连接已关闭";
        var s = {
            action: "task_started",
            params: {
                tid: t,
                subtimeout: e
            },
            sid: i,
            type: 1,
            sign: ""
        }
          , a = JSON.stringify(s);
        n("task_started", s),
        this.socket.send(a)
    }
    ,
    e.prototype.taskVerify = function(t, e, i) {
        if (1 != this.socket.readyState)
            throw "[QkWebSocket] 错误：连接已关闭";
        var s = {
            action: "task_verify",
            params: {
                session_id: t,
                task_id: e
            },
            sid: i,
            type: 1,
            sign: ""
        };
        console.log("socket params =>", s);
        var a = JSON.stringify(s);
        n("task_verify", s),
        this.socket.send(a)
    }
    ,
    e.prototype.taskVerifyIOS9 = function(t, e, i) {
        if (1 != this.socket.readyState)
            throw "[QkWebSocket] 错误：连接已关闭";
        var s = {
            action: "task_verify_i9",
            params: {
                session_id: t,
                task_id: e
            },
            sid: i,
            type: 1,
            sign: ""
        };
        console.log("socket params =>", s);
        var a = JSON.stringify(s);
        n("task_verify_i9", s),
        this.socket.send(a)
    }
    ,
    e.prototype.taskRunTime = function(t, e, i, s) {
        if (1 != this.socket.readyState)
            throw "[QkWebSocket] 错误：连接已关闭";
        var a = {
            action: "task_run_time",
            params: {
                session_id: t,
                task_id: e,
                type: i
            },
            sid: s,
            type: 1,
            sign: ""
        };
        console.log("socket params =>", a);
        var o = JSON.stringify(a);
        n("task_run_time", a),
        this.socket.send(o)
    }
    ,
    e.prototype.zsTaskStarted = function(t, e, i, s) {
        if (1 != this.socket.readyState)
            throw "[QkWebSocket] 错误：连接已关闭";
        var a = {
            action: "zs_task_started",
            params: {
                session_id: t,
                task_id: e,
                task_info: i
            },
            sid: s,
            type: 1,
            sign: ""
        }
          , o = JSON.stringify(a);
        n("zs_task_started", a),
        this.socket.send(o)
    }
    ,
    e.prototype.zsTaskVerify = function(t, e, i, s) {
        if (1 != this.socket.readyState)
            throw "[QkWebSocket] 错误：连接已关闭";
        var a = {
            action: "zs_task_verify",
            params: {
                session_id: t,
                task_id: e,
                task_info: i
            },
            sid: s,
            type: 1,
            sign: ""
        }
          , o = JSON.stringify(a);
        n("zs_task_verify", a),
        this.socket.send(o)
    }
    ,
    e.prototype.zsTaskVerifyIOS9 = function(t, e, i, s) {
        if (1 != this.socket.readyState)
            throw "[QkWebSocket] 错误：连接已关闭";
        var a = {
            action: "zs_task_verify_i9",
            params: {
                session_id: t,
                task_id: e,
                task_info: i
            },
            sid: s,
            type: 1,
            sign: ""
        }
          , o = JSON.stringify(a);
        n("zs_task_verify_i9", a),
        this.socket.send(o)
    }
    ,
    e
}),
define("clone", [], function() {
    var t = function() {
        function t(e, n, i, s) {
            function o(e, i) {
                if (null  === e)
                    return null ;
                if (0 === i)
                    return e;
                var d, u;
                if ("object" != typeof e)
                    return e;
                if (t.__isArray(e))
                    d = [];
                else if (t.__isRegExp(e))
                    d = new RegExp(e.source,a(e)),
                    e.lastIndex && (d.lastIndex = e.lastIndex);
                else if (t.__isDate(e))
                    d = new Date(e.getTime());
                else {
                    if (c && Buffer.isBuffer(e))
                        return d = new Buffer(e.length),
                        e.copy(d),
                        d;
                    "undefined" == typeof s ? (u = Object.getPrototypeOf(e),
                    d = Object.create(u)) : (d = Object.create(s),
                    u = s)
                }
                if (n) {
                    var p = l.indexOf(e);
                    if (-1 != p)
                        return r[p];
                    l.push(e),
                    r.push(d)
                }
                for (var v in e) {
                    var g;
                    u && (g = Object.getOwnPropertyDescriptor(u, v)),
                    g && null  == g.set || (d[v] = o(e[v], i - 1))
                }
                return d
            }
            var d;
            "object" == typeof n && (i = n.depth,
            s = n.prototype,
            d = n.filter,
            n = n.circular);
            var l = []
              , r = []
              , c = "undefined" != typeof Buffer;
            return "undefined" == typeof n && (n = !0),
            "undefined" == typeof i && (i = 1 / 0),
            o(e, i)
        }
        function e(t) {
            return Object.prototype.toString.call(t)
        }
        function n(t) {
            return "object" == typeof t && "[object Date]" === e(t)
        }
        function i(t) {
            return "object" == typeof t && "[object Array]" === e(t)
        }
        function s(t) {
            return "object" == typeof t && "[object RegExp]" === e(t)
        }
        function a(t) {
            var e = "";
            return t.global && (e += "g"),
            t.ignoreCase && (e += "i"),
            t.multiline && (e += "m"),
            e
        }
        return t.clonePrototype = function(t) {
            if (null  === t)
                return null ;
            var e = function() {}
            ;
            return e.prototype = t,
            new e
        }
        ,
        t.__objToStr = e,
        t.__isDate = n,
        t.__isArray = i,
        t.__isRegExp = s,
        t.__getRegExpFlags = a,
        t
    }();
    window.clone = t
}),
this.JST = {
    alliance_detail: function(obj) {
        obj || (obj = {});
        {
            var __p = "";
            _.escape
        }
        with (obj)
            __p += '<div class="container-fluid novice-task-list">\n    task detail alliance\n</div>\n';
        return __p
    },
    alliance_list: function(obj) {
        obj || (obj = {});
        {
            var __p = "";
            _.escape
        }
        with (obj)
            __p += '<div class="container-fluid novice-task-list">\n    <div class="list-group" ng-repeat="task in taskList">\n        <div class="list-group-item" ui-sref="{{task.state}}">\n            <img class="task-icon" ng-src="{{task.icon}}" alt=""/>\n            <div class="item-content">\n                <div class="title" ng-bind="task.title"></div>\n                <div class="desc" ng-bind="task.desc"></div>\n            </div>\n\n            <div class="task-reward">\n                <span class="plus">+</span>\n                <span class="balance" ng-bind="task.reward"></span>元\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class="container-fluid text-center">\n    <img src="http://m.qkcdn.com/fe/resource/novice_footer.png" alt="" style="width: 160px; margin: 0 auto"/>\n</div>\n';
        return __p
    },
    exclusive_detail: function(obj) {
        obj || (obj = {});
        {
            var __p = "";
            _.escape
        }
        with (obj)
            __p += '<div class="reward-tips animated" ng-class="{\'fadeInDown\': rewardTips}" ng-bind-html="rewardTips"></div>\n\n<div ng-show="isKeyInvalid" class="container-fluid key-inactive">\n    <img src="http://m.qkcdn.com/fe/resource/task_key_inactive.png" alt=""/>\n    <div class="tips">\n        <p>友情提示：钥匙未开启状态下是无法进行任务的哟~ 立即打开钥匙开始赚钱！</p>\n        <p>若未安装钥匙或钥匙被删除，请先 <span style="color: #47a8ef" ng-click="downloadQiankaKey()">下载安装</span></p>\n    </div>\n\n    <button class="btn btn-danger btn-block btn-open-key" ng-click="openQiankaKey()">打开钥匙</button>\n</div>\n\n<div ng-hide="isKeyInvalid" class="list-group list-group-a task-detail-body thin-border-top-bottom" style="margin-top: 10px;">\n    <div class="list-group-item thin-border-bottom">\n        <img class="task-icon" ng-src="{{currentTask.icon}}" alt=""/>\n        <div class="item-content">\n            <div class="zs-title" ng-bind="currentTask.appName"></div>\n        </div>\n    </div>\n    <div class="list-group-item text-center thin-border-bottom" style="padding: 30px 20px 40px 0; height: auto;">\n        <div ng-bind="currentTask.desc" style="color: #aaa; font-size: 12px; line-height: 12px; margin-bottom: 15px"></div>\n        <div style="font-size: 18px; line-height: 12px; color: #ec4949; margin-top: 32px;">\n            +<div class="font-thin" style="font-size: 70px; line-height: 55px; font-weight: 200; display: inline-block; letter-spacing: -1px">\n                {{currentTask.money}}\n            </div>元\n        </div>\n    </div>\n    <div class="list-group-item task-operation" style="padding-top: 15px">\n        <button class="btn btn-block btn-primary"\n                ng-class="{\'btn-primary\': !currentTaskOnGoing, \'btn-grey\': currentTaskOnGoing}"\n                ng-click="startZsTask(currentTask)" style="margin-bottom: 10px;">开始任务</button>\n        <button class="btn btn-block btn-grey"\n                ng-class="{\'btn-danger\': currentTaskOnGoing, \'btn-grey\': !currentTaskOnGoing}"\n                ng-click="verify(currentTask.zstaskId)" style="margin-top: 0; margin-bottom: 0;">任务完成，提交审核</button>\n    </div>\n</div>\n\n<!-- 完成情况 -->\n<div ng-hide="isKeyInvalid" class="container-fluid zs-tasks-status thin-border-top-bottom">\n    <div style="color: #666; font-size: 12px; line-height: 12px; margin-bottom: 12px;">\n        完成情况\n    </div>\n    <!-- tasks的status  0＝未开始；1=已完成；2=进行中；3=已经过期 -->\n    <div class="zs-task-row">\n        <div class="zs-task-col" ng-repeat="t in tasks" ng-class="{\'finished\': t.status == 1, \'missed\': t.status == 3}">\n            <span ng-class="{\'no-text\': t.status==1 || t.status==3}">{{t.theDay}}</span>\n        </div>\n    </div>\n\n    <p ng-repeat="t in tasks" style="margin:0; font-size: 12px; line-height: 18px; width: 100%"\n            ng-class="{\'zs-task-finished-desc\': t.status==1, \'zs-task-unfinished-desc\': t.status!=1}" ng-bind-html="t.desc">\n    </p>\n</div>\n\n<div ng-hide="isKeyInvalid" class="container-fluid text-center" style="padding-top: 40px;">\n    <img src="http://m.qkcdn.com/fe/resource/exclusive_footer.png" style="width: 157px; margin: 0 0 40px 0"/>\n</div>\n\n<!-- 5001 - 5005 申请失败提示框 -->\n<div class="md-modal md-effect-8" id="modal-no-quota">\n    <div class="md-content">\n        <div style="padding-top: 20px">\n            <img ng-src="{{appliedTaskIcon}}" style="width: 45px; margin-bottom: 25px;">\n        </div>\n        <div class="title" style="color: #aaa">{{failReason}}</div>\n    </div>\n</div>\n\n<!-- 无法同时申请两个任务确认框 -->\n<div class="md-modal md-effect-8" id="modal-confirm">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div class="title" style="color: #aaa;">不能同时抢多个任务哦！要放弃上个任务并接取该任务吗？</div>\n        <div class="btn-wrapper">\n            <div class="left">\n                <button class="btn btn-default btn-outline" ng-click="dismiss(0)"\n                        style="font-size: 18px; font-weight: bold">取 消</button>\n            </div>\n            <div class="right">\n                <button class="btn btn-primary" ng-click="dismiss(1)"\n                        style="font-size: 18px; font-weight: bold">确 定</button>\n            </div>\n        </div>\n    </div>\n</div>\n<!-- 任务成功提示 -->\n<div class="md-modal md-effect-8" id="modal-alert2">\n    <div class="md-content">\n        <div style="color: #ec4949;padding-top: 15px;">\n            <div style="font-size: 16px;">{{alert_tip}}</div>\n            <div style="font-size: 13px;padding-top: 10px;color: #aaa">{{alert_title}}</div>\n        </div>\n        <div class="extask-reward">\n            <div class="plus">+</div><div class="reward">{{currentTask.money}}</div><div class="y">元</div>\n        </div>\n        <button class="btn btn-block btn-primary"\n                ng-click="goZSTaskList()" style="color: #fff; height: 55px; font-size: 16px; line-height: 37px; background-color: #ec4949; border-color: #ec4949;">\n            {{alert_name}}\n        </button>\n    </div>\n</div>\n<div class="md-modal md-effect-8" id="modal-alert">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div  class="title">{{tips}}</div>\n        <button class="btn btn-block btn-primary" style="height: 50px;" ng-click="hideAlert()">知道了</button>\n    </div>\n</div>\n<div class="md-overlay"></div>\n\n';
        return __p
    },
    exclusive_detail_ios9: function(obj) {
        obj || (obj = {});
        {
            var __p = "";
            _.escape
        }
        with (obj)
            __p += '<div class="reward-tips animated" ng-class="{\'fadeInDown\': rewardTips}" ng-bind-html="rewardTips"></div>\n\n<div ng-show="isKeyInvalid" class="container-fluid key-inactive">\n    <img src="http://m.qkcdn.com/fe/resource/task_key_inactive.png" alt=""/>\n    <div class="tips">\n        <p>友情提示：钥匙未开启状态下是无法进行任务的哟~ 立即打开钥匙开始赚钱！</p>\n        <p>若未安装钥匙或钥匙被删除，请先 <span style="color: #47a8ef" ng-click="downloadQiankaKey()">下载安装</span></p>\n    </div>\n\n    <button class="btn btn-danger btn-block btn-open-key" ng-click="openQiankaKey()">打开钥匙</button>\n</div>\n\n<div ng-hide="isKeyInvalid" class="list-group list-group-a task-detail-body thin-border-top-bottom" style="margin-top: 10px;">\n    <div class="list-group-item thin-border-bottom">\n        <img class="task-icon" ng-src="{{currentTask.icon}}" alt=""/>\n        <div class="item-content">\n            <div class="zs-title" ng-bind="currentTask.appName"></div>\n        </div>\n    </div>\n    <div class="list-group-item text-center thin-border-bottom" style="padding: 30px 20px 40px 0; height: auto;">\n        <div ng-bind="currentTask.desc" style="color: #aaa; font-size: 12px; line-height: 12px; margin-bottom: 15px"></div>\n        <div style="font-size: 18px; line-height: 12px; color: #ec4949; margin-top: 32px;">\n            +<div class="font-thin" style="font-size: 70px; line-height: 55px; font-weight: 200; display: inline-block; letter-spacing: -1px">\n                {{currentTask.money}}\n            </div>元\n        </div>\n    </div>\n    <div class="list-group-item task-operation" style="padding-top: 15px">\n        <button class="btn btn-block btn-primary"\n                ng-class="{\'btn-primary\': !currentTaskOnGoing, \'btn-grey\': currentTaskOnGoing}"\n                ng-click="startZsTask(currentTask)" style="margin-bottom: 10px;">开始任务</button>\n        <button class="btn btn-block btn-grey"\n                ng-class="{\'btn-danger\': currentTaskOnGoing, \'btn-grey\': !currentTaskOnGoing}"\n                ng-click="verify(currentTask.zstaskId)" style="margin-top: 0; margin-bottom: 0;">任务完成，提交审核</button>\n    </div>\n</div>\n\n<!-- 完成情况 -->\n<div ng-hide="isKeyInvalid" class="container-fluid zs-tasks-status thin-border-top-bottom">\n    <div style="color: #666; font-size: 12px; line-height: 12px; margin-bottom: 12px;">\n        完成情况\n    </div>\n    <!-- tasks的status  0＝未开始；1=已完成；2=进行中；3=已经过期 -->\n    <div class="zs-task-row">\n        <div class="zs-task-col" ng-repeat="t in tasks" ng-class="{\'finished\': t.status == 1, \'missed\': t.status == 3}">\n            <span ng-class="{\'no-text\': t.status==1 || t.status==3}">{{t.theDay}}</span>\n        </div>\n    </div>\n\n    <p ng-repeat="t in tasks" style="margin:0; font-size: 12px; line-height: 18px; width: 100%"\n            ng-class="{\'zs-task-finished-desc\': t.status==1, \'zs-task-unfinished-desc\': t.status!=1}" ng-bind-html="t.desc">\n    </p>\n</div>\n\n<div ng-hide="isKeyInvalid" class="container-fluid text-center" style="padding-top: 40px;">\n    <img src="http://m.qkcdn.com/fe/resource/exclusive_footer.png" style="width: 157px; margin: 0 0 40px 0"/>\n</div>\n\n<!-- 5001 - 5005 申请失败提示框 -->\n<div class="md-modal md-effect-8" id="modal-no-quota">\n    <div class="md-content">\n        <div style="padding-top: 20px">\n            <img ng-src="{{appliedTaskIcon}}" style="width: 45px; margin-bottom: 25px;">\n        </div>\n        <div class="title" style="color: #aaa">{{failReason}}</div>\n    </div>\n</div>\n\n<!-- 无法同时申请两个任务确认框 -->\n<div class="md-modal md-effect-8" id="modal-confirm">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div class="title" style="color: #aaa;">不能同时抢多个任务哦！要放弃上个任务并接取该任务吗？</div>\n        <div class="btn-wrapper">\n            <div class="left">\n                <button class="btn btn-default btn-outline" ng-click="dismiss(0)"\n                        style="font-size: 18px; font-weight: bold">取 消</button>\n            </div>\n            <div class="right">\n                <button class="btn btn-primary" ng-click="dismiss(1)"\n                        style="font-size: 18px; font-weight: bold">确 定</button>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- 启动应用提示 -->\n<div class="md-modal md-effect-8" id="modal-alert-start">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div class="title">请先到App Store中下载<br>再点击“开始任务”按钮来进行任务</div>\n        <button class="btn btn-block btn-primary" style="height: 50px;" ng-click="downloadApp()">确 定</button>\n    </div>\n</div>\n\n<!-- 任务成功提示 -->\n<div class="md-modal md-effect-8" id="modal-alert2">\n    <div class="md-content">\n        <div style="color: #ec4949;padding-top: 15px;">\n            <div style="font-size: 16px;">{{alert_tip}}</div>\n            <div style="font-size: 13px;padding-top: 10px;color: #aaa">{{alert_title}}</div>\n        </div>\n        <div class="extask-reward">\n            <div class="plus">+</div><div class="reward">{{currentTask.money}}</div><div class="y">元</div>\n        </div>\n        <button class="btn btn-block btn-primary"\n                ng-click="goZSTaskList()" style="color: #fff; height: 55px; font-size: 16px; line-height: 37px; background-color: #ec4949; border-color: #ec4949;">\n            {{alert_name}}\n        </button>\n    </div>\n</div>\n<div class="md-modal md-effect-8" id="modal-alert">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div  class="title">{{tips}}</div>\n        <button class="btn btn-block btn-primary" style="height: 50px;" ng-click="hideAlert()">知道了</button>\n    </div>\n</div>\n<div class="md-overlay"></div>\n\n';
        return __p
    },
    exclusive_list: function(obj) {
        obj || (obj = {});
        {
            var __p = "";
            _.escape
        }
        with (obj)
            __p += '<div class="container-fluid timed-task-list" ng-repeat="tl in taskLists">\n    <div class="list-title" ng-bind="tl.title"></div>\n\n    <div class="list-group" ng-repeat="task in tl.list" ng-click="goTaskDetail(task)">\n        <div class="list-group-item" ng-class="{\'ex-mask\': task.status == 2}">\n            <img class="task-icon" ng-src="{{task.icon}}" alt="" style="display: none;" id="task-icon-{{$parent.$index}}-{{$index}}"\n                 onload="this.style.display = \'block\'; document.getElementById(this.id + \'-loading\').style.display = \'none\'"/>\n            <div class="task-icon" style="position: relative" id="task-icon-{{$parent.$index}}-{{$index}}-loading">\n                <div class="task-icon-loading"></div>\n            </div>\n\n            <div class="item-content">\n                <div class="title" ng-bind="task.appName"></div><br>\n                <div class="subtitle" ng-bind="task.desc"></div>\n            </div>\n\n            <!-- 进行中: status==3-->\n            <div ng-show="task.status == 3" class="task-status in-progress">\n                进行中\n            </div>\n\n            <!-- 非进行中显示金额：status==1 || status==2 -->\n            <div ng-show="task.status != 3" class="task-reward">\n                <div class="plus" style="width:10px;">+</div>\n                <div class="reward">\n                    {{task.money}}\n                </div>\n                <div class="y">元</div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class="container-fluid text-center" style="padding-top: 40px;">\n    <img src="http://m.qkcdn.com/fe/resource/exclusive_footer.png" alt="" style="width: 157px; margin: 0 0 40px 0"/>\n</div>';
        return __p
    },
    main: function(obj) {
        obj || (obj = {});
        {
            var __p = "";
            _.escape
        }
        with (obj)
            __p += '<!-- Navbar -->\n<div class="navbar navbar-inverse navbar-fixed-top text-center">\n    <button ng-click="back()" class="btn btn-clear pull-left">\n        <i class="icon icon-arrow-back" ></i>\n    </button>\n    <span class="title" ng-bind="headerTitle" ng-click="headerClicked()"></span>\n    <i class="icon pull-right"></i>\n</div>\n\n<!-- View -->\n<div ui-view></div>\n\n<!-- Toast -->\n<div id="toast" class="md-modal md-effect-12">\n    <div class="md-content">\n        <span ng-bind-html="toastMsg || \' \'"></span>\n    </div>\n</div>\n\n<!-- 无法同时申请两个任务确认框 -->\n<div class="md-modal md-effect-8" id="modal-abandon">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div class="title">确定要放弃当前任务吗？</div>\n        <div class="btn-wrapper">\n            <div class="left">\n                <button class="btn btn-default btn-outline" ng-click="dismiss(0)">取 消</button>\n            </div>\n            <div class="right">\n                <button class="btn btn-primary" ng-click="dismiss(1)">放弃任务</button>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- Modal Overlay -->\n<div class="md-overlay"></div>\n';
        return __p
    },
    timed_detail: function(obj) {
        obj || (obj = {});
        {
            var __p = "";
            _.escape
        }
        with (obj)
            __p += '<div class="reward-tips animated"\n     ng-class="{\'fadeInDown\': rewardTips}" ng-bind-html="rewardTips"></div>\n\n<div ng-show="{{false}}" class="container-fluid key-inactive">\n    <img src="http://m.qkcdn.com/fe/resource/task_key_inactive.png" alt=""/>\n    <div class="tips">\n        <p>友情提示：钥匙未开启状态下是无法进行任务的哟~ 立即打开钥匙开始赚钱！</p>\n        <p>若未安装钥匙或钥匙被删除，请先 <span style="color: #47a8ef" ng-click="downloadQiankaKey()">下载安装</span></p>\n    </div>\n\n    <button class="btn btn-danger btn-block btn-open-key" ng-click="openQiankaKey()">打开钥匙</button>\n</div>\n\n<div ng-hide="isKeyInvalid || !taskDetail.exclusiveReward" class="container-fluid task-detail-header-wrapper">\n    <div class="task-detail-header">\n        <span ng-show="taskDetail.exclusiveReward">\n            任务总金额:\n            <span class="reward" ng-bind="taskDetail.reward"></span>元限时 +\n            <span class="reward" ng-bind="taskDetail.exclusiveReward"></span>元专属 =\n            <span class="reward" ng-bind="taskDetail.totalReward"></span>元\n        </span>\n    </div>\n</div>\n\n<div ng-hide="{{false}}" class="list-group list-group-a task-detail-body thin-border-top-bottom" style="margin-bottom: 10px">\n    <div class="list-group-item thin-border-bottom">\n        <img class="task-icon" ng-src="{{taskDetail.icon}}" alt=""/>\n        <div class="item-content">\n            <div class="title" ng-bind="taskDetail.title"></div>\n            <div class="desc" ng-bind="\'大小\' + taskDetail.appSize"></div>\n        </div>\n\n        <div class="task-reward">\n            <div class="plus">+</div>\n            <div class="reward">\n                {{taskDetail.reward}}\n            </div>\n            <div class="y">元</div>\n        </div>\n    </div>\n    <div class="list-group-item task-steps thin-border-bottom">\n        <div class="task-steps-title">任务步骤\n            <span class="time-limit" ng-bind="deadlineCountDown"></span>\n        </div>\n        \n        <p class="task-steps-body" ng-bind-html="taskDetail.steps"></p>\n\n    </div>\n    <div class="list-group-item task-operation">\n        <div ng-if="taskDetail.keyword" id="keyword-box" class="keyword-box" style="position: relative;text-align: center;">\n            <img ng-show="isNotQKPro" id="copyUseImg" style="-webkit-user-select:none;position: absolute;top: 0px;display:block;z-index: 5;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi/v//PwNAgAEACQsDAUdpTjcAAAAASUVORK5CYII=">\n            <div ng-show="isNotQKPro" id="ios9select" style="position: absolute;top: 0px;display:block;z-index: 99;"></div>\n            <div id="keyword"  class="keyword">\n                <span id="cpoykeywords" ng-bind="taskDetail.keyword"></span>\n            </div>\n        </div>\n        <div ng-if="taskDetail.keyword" class="keyword-up"></div>\n        <p ng-if="taskDetail.keyword" class="copy-hint-ios9">\n            长按复制（必须）<br>\n            自动跳转 App Store\n        </p>\n        <button ng-show="taskDetail.keyword==\'\'" class="btn btn-block btn-primary" ng-click="searchApp()">前往App Store</button>\n        <button class="btn btn-block btn-danger"\n                ng-class="{\'btn-danger\': !isTaskExpired, \'btn-grey\': isTaskExpired }" ng-click="verify()">任务完成，提交审核</button>\n    </div>\n</div>\n\n<!-- 相关专属任务 -->\n<div ng-if="taskDetail.exclusiveTasks && taskDetail.exclusiveTasks.length > 0"\n     ng-hide="isKeyInvalid"\n     class="container-fluid thin-border-top-bottom" style="padding: 15px 20px; background: #fff; margin-bottom: 10px">\n    <p class="extask-title">\n        专属任务\n    </p>\n    <p class="extask-desc"\n            ng-repeat="exTask in taskDetail.exclusiveTasks" ng-bind-html="exTask.desc">\n    </p>\n</div>\n\n<div ng-hide="isKeyInvalid" class="container-fluid text-center">\n    <img src="http://m.qkcdn.com/fe/resource/timed_footer.png" alt="" style="width: 157px; margin: 30px 0 40px 0"/>\n</div>\n\n<!-- 任务成功提示 -->\n<div class="md-modal md-effect-8" id="modal-alert">\n    <div class="md-content">\n        <span class="pull-right" ng-click="hideAlert()"\n              style="color: #ddd; margin-top: -15px; margin-left: 85%; font-size: 24px; font-weight: 300; position: absolute">&times;</span>\n        <div style="color: #ec4949;padding-top: 15px;">\n            <div style="font-size: 16px;">{{alert_tip}}</div>\n            <div style="font-size: 13px;padding-top: 10px;color: #aaa">{{alert_title}}</div>\n        </div>\n        <div class="extask-reward">\n            <div class="plus">+</div><div class="reward">{{alert_price}}</div><div class="y">元</div>\n        </div>\n        <button class="btn btn-block btn-primary"\n                ng-click="goTaskList()" style="color: #fff; height: 55px; font-size: 16px; line-height: 37px; background-color: #ec4949; border-color: #ec4949;">\n            {{alert_name}}\n        </button>\n    </div>\n</div>\n<div class="md-overlay"></div>\n';
        return __p
    },
    timed_detail_ios9: function(obj) {
        obj || (obj = {});
        {
            var __p = "";
            _.escape
        }
        with (obj)
            __p += '<div class="reward-tips animated"\n     ng-class="{\'fadeInDown\': rewardTips}" ng-bind-html="rewardTips"></div>\n\n<div ng-show="isKeyInvalid" class="container-fluid key-inactive">\n    <img src="http://m.qkcdn.com/fe/resource/task_key_inactive.png" alt=""/>\n    <div class="tips">\n        <p>友情提示：钥匙未开启状态下是无法进行任务的哟~ 立即打开钥匙开始赚钱！</p>\n        <p>若未安装钥匙或钥匙被删除，请先 <span style="color: #47a8ef" ng-click="downloadQiankaKey()">下载安装</span></p>\n    </div>\n\n    <button class="btn btn-danger btn-block btn-open-key" ng-click="openQiankaKey()">打开钥匙</button>\n</div>\n\n<div ng-hide="isKeyInvalid || !taskDetail.exclusiveReward" class="container-fluid task-detail-header-wrapper">\n    <div class="task-detail-header">\n        <span ng-show="taskDetail.exclusiveReward">\n            任务总金额:\n            <span class="reward" ng-bind="taskDetail.reward"></span>元限时 +\n            <span class="reward" ng-bind="taskDetail.exclusiveReward"></span>元专属 =\n            <span class="reward" ng-bind="taskDetail.totalReward"></span>元\n        </span>\n    </div>\n</div>\n\n<div ng-hide="isKeyInvalid" class="list-group list-group-a task-detail-body thin-border-top-bottom" style="margin-bottom: 10px">\n    <div class="list-group-item thin-border-bottom">\n        <img class="task-icon" ng-src="{{taskDetail.icon}}" alt=""/>\n        <div class="item-content">\n            <div class="title" ng-bind="taskDetail.title"></div>\n            <div class="desc" ng-bind="\'大小 \' + taskDetail.appSize"></div>\n        </div>\n\n        <div class="task-reward">\n            <div class="plus">+</div>\n            <div class="reward">\n                {{taskDetail.reward}}\n            </div>\n            <div class="y">元</div>\n        </div>\n    </div>\n    <div class="list-group-item task-steps thin-border-bottom">\n        <div class="task-steps-title">任务步骤\n            <span class="time-limit" ng-bind="deadlineCountDown"></span>\n        </div>\n        \n        <p class="task-steps-body" ng-bind-html="taskDetail.steps"></p>\n\n    </div>\n    <div class="list-group-item task-operation">\n        <div ng-if="taskDetail.keyword" id="keyword-box" class="keyword-box" style="position: relative;text-align: center;">\n            <img ng-show="isNotQKPro" id="copyUseImg" alt="{{taskDetail.keyword}}" style="-webkit-user-select:none;position: absolute;top: 0px;display:block;z-index: 5;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi/v//PwNAgAEACQsDAUdpTjcAAAAASUVORK5CYII=">\n            <div ng-show="isNotQKPro" id="ios9select" style="position: absolute;top: 0px;display:block;z-index: 99;"></div>\n            <div id="keyword"  class="keyword">\n                <span id="cpoykeywords" ng-bind="taskDetail.keyword"></span>\n            </div>\n        </div>\n        <div ng-if="taskDetail.keyword" class="keyword-up"></div>\n        <p ng-if="taskDetail.keyword" class="copy-hint-ios9">\n            长按复制（必须）<br>\n            自动跳转 App Store\n        </p>\n        <button ng-show="taskDetail.keyword==\'\'" class="btn btn-block btn-primary"\n                ng-class="{\'btn-primary\': btnSearchEnabled, \'btn-grey\': !btnSearchEnabled}"\n                ng-click="searchApp()">前往App Store</button>\n        <!--<button ng-show="taskDetail.keyword==\'\'" class="btn btn-block btn-grey"-->\n                <!--ng-class="{\'btn-grey\': btnStartAppStatus==0,\'btn-danger\': btnStartAppStatus==1,-->\n                <!--\'btn-task-progress\': btnStartAppStatus==2, \'btn-task-finished\': btnStartAppStatus==3}"-->\n                <!--ng-click="startApp()" ng-bind="btnStartAppText"></button>&lt;!&ndash; 进行中、完成 &ndash;&gt;-->\n        <!--<button ng-show="taskDetail.keyword" class="btn btn-block btn-danger"-->\n                <!--ng-class="{\'btn-danger\': btnStartAppStatus==0,\'btn-danger\': btnStartAppStatus==1,-->\n                <!--\'btn-task-progress\': btnStartAppStatus==2, \'btn-task-finished\': btnStartAppStatus==3}"-->\n                <!--ng-click="startApp()" ng-bind="btnStartAppText"></button> &lt;!&ndash; 有关键词时进行中、完成 &ndash;&gt;-->\n        <button class="btn btn-block btn-danger" ng-class="{\'btn-danger\': !isTaskExpired, \'btn-grey\': isTaskExpired}"\n                ng-click="verify()">任务完成，提交审核</button>\n    </div>\n</div>\n\n<!-- 相关专属任务 -->\n<div ng-if="taskDetail.exclusiveTasks && taskDetail.exclusiveTasks.length > 0"\n     ng-hide="isKeyInvalid"\n     class="container-fluid thin-border-top-bottom" style="padding: 15px 20px; background: #fff; margin-bottom: 10px">\n    <p class="extask-title">\n        专属任务\n    </p>\n    <p class="extask-desc"\n       ng-repeat="exTask in taskDetail.exclusiveTasks" ng-bind-html="exTask.desc">\n    </p>\n</div>\n\n<div ng-hide="isKeyInvalid" class="container-fluid text-center">\n    <img src="http://m.qkcdn.com/fe/resource/timed_footer.png" alt="" style="width: 157px; margin: 20px 0 40px 0"/>\n</div>\n\n<!-- 启动应用提示 -->\n<div class="md-modal md-effect-8" id="modal-alert">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div ng-show="taskDetail.keyword==\'\'" class="title">下载后务必点击<br>“开始任务”按钮来进行任务"</div>\n        <div ng-show="taskDetail.keyword" class="title">请先长按复制关键词<br>在App Store中搜索并下载</div>\n        <button class="btn btn-block btn-primary" style="height: 50px;" ng-click="btnSearchApp()">{{taskDetail.keyword?\'知道了\':\'确 定\'}}</button>\n    </div>\n</div>\n\n<!-- 任务成功提示 -->\n<div class="md-modal md-effect-8" id="modal-alert2">\n    <div class="md-content">\n        <span class="pull-right" ng-click="hideAlert2()"\n              style="color: #ddd; margin-top: -15px; margin-left: 85%; font-size: 24px; font-weight: 300; position: absolute">&times;</span>\n        <div style="color: #ec4949;padding-top: 15px;">\n            <div style="font-size: 16px;">{{alert_tip}}</div>\n            <div style="font-size: 13px;padding-top: 10px;color: #aaa">{{alert_title}}</div>\n        </div>\n        <div class="extask-reward">\n            <div class="plus">+</div><div class="reward">{{alert_price}}</div><div class="y">元</div>\n        </div>\n        <button class="btn btn-block btn-primary"\n                ng-click="goTaskList()" style="color: #fff; height: 55px; font-size: 16px; line-height: 37px; background-color: #ec4949; border-color: #ec4949;">\n            {{alert_name}}\n        </button>\n    </div>\n</div>\n<div class="md-overlay"></div>\n';
        
        return __p
    },
    timed_list: function(obj) {
        obj || (obj = {});
        {
            var __p = "";
            _.escape
        }
        with (obj)
            __p += '<div ng-show="{{false}}" class="container-fluid key-inactive" style="padding-bottom: 0">\n    <img src="http://m.qkcdn.com/fe/resource/task_key_inactive.png" alt=""/>\n    <div class="tips">\n        <p>友情提示：钥匙未开启状态下是无法进行任务的哟~ 立即打开钥匙开始赚钱！</p>\n        <p>若未安装钥匙或钥匙被删除，请先 <span style="color: #47a8ef" ng-click="downloadQiankaKey()">下载安装</span></p>\n    </div>\n\n    <button class="btn btn-danger btn-block btn-open-key" ng-click="openQiankaKey()">打开钥匙</button>\n</div>\n\n<div ng-show="fetched"\n     class="container-fluid timed-task-list"\n     ng-class="{\'mask\': false}"\n     style="padding-top: 15px; margin-bottom: 20px">\n\n    <div class="list-group" ng-repeat="task in taskList">\n\n        <!-- 显示 任务预告 -->\n        <div ng-show="comingTaskTotalReward > 0\n        && $index > 0\n        && taskList[$index].type == 4\n        && (taskList[$index - 1].type == 3 || taskList[$index - 1].type == 1)" class="list-group-item"\n             style="border: 1px dashed #e5e4e3; color: #aaa; border-radius: 4px; font-size: 13px; line-height: 17px;\n             background: none; margin-bottom: 10px; height: auto">\n            任务即将开始，总计 <span ng-bind="comingTaskTotalReward" style="color: #ec4949"></span> 元，准时来抢！\n        </div>\n\n        <div class="list-group-item" ng-class="{\'mask\': task.status==0 || task.status==3}" ng-click="applyTask(task)">\n\n            <img ng-show="task.type==100"\n                 src="http://m.qkcdn.com/fe/resource/qiang.png" style="position: absolute; top: -.265em; right: -.265em; width: 22px; height: 22px;border-top-right-radius: 4px;"/>\n            <img ng-show="task.type==101"\n                 src="http://m.qkcdn.com/fe/resource/buy_orange@3x.png" style="position: absolute; top: -.265em; right: -.265em; width: 22px; height: 22px;border-top-right-radius: 4px;"/>\n\n            <img class="task-icon" ng-src="{{task.icon}}" alt="" style="display: none" id="task-icon-{{$index}}"\n                 onload="this.style.display = \'block\'; document.getElementById(this.id + \'-loading\').style.display = \'none\'"/>\n            <div class="task-icon" style="position: relative" id="task-icon-{{$index}}-loading">\n                <div class="task-icon-loading"></div>\n            </div>\n\n            <div class="item-content">\n                <div ng-if="task.type!=3" class="title" ng-bind="task.title"></div>\n                <div ng-if="task.type==3" class="inline-title">\n                    {{task.title}}&nbsp;<img src="http://m.qkcdn.com/fe/resource/new2.png" style="width: 30px; height: 14px; margin-top: -2px;" />\n                </div>\n                <div ng-if="task.type==3" ng-show="task.activity" class="activity-superscript" ng-bind="task.activity"></div>\n                <div class="task-tags">\n                    <div class="tag" ng-if="task.type==2"><div class="f-10">当期有效</div></div>\n                    <div class="tag" ng-if="task.type==3"><div class="f-10">超高奖励</div></div>\u2028\n                    <div class="tag" ng-if="task.type==3"><div class="f-10">上不封顶</div></div>\n                    <div class="tag" ng-if="task.type==4"><div class="f-10">{{task.start_date}}</div></div>\n                    <div class="tag" ng-show="task.type!=4&&task.tags[0]"><div class="f-10">免费</div></div>\n                    <div class="tag" ng-show="task.type!=4&&task.tags[1]"><div class="f-10">\n                        <sup style="float: left; margin-top: 10px;">+</sup>\n                        购买</div></div>\n                    <div class="tag" ng-show="task.type!=4&&task.tags[2]"><div class="f-10">有专属</div></div>\n                    <!--<div class="tag highlight" ng-show="task.tags[3] && task.status==1"><div class="f-10">快被抢完</div></div>-->\n\n                    <div class="tag" ng-show="task.type!=3 && task.type!=100 && task.type!=101" ng-class="{\'highlight\': task.tags[3]==2 }"><div class="f-10" ng-bind-html="\'剩 \' + task.qty + \' 份\'"></div></div>\n\n                    <!-- DUOBAO -->\n                    <div class="tag" ng-if="task.type==100"><div class="f-10">{{task.issue_no}}期</div></div>\n                    <div class="tag highlight" ng-if="task.type==100"><div class="f-10">开奖进度{{task.percent}}</div></div>\u2028\n\n                    <!-- 返利帮 -->\n                    <div class="tag" ng-if="task.type==101"><div class="f-10">某宝价{{task.price}}元</div></div>\n                    <div class="tag highlight" ng-if="task.type==101"><div class="f-10">返{{task.fanli}}元</div></div>\n\n                </div>\n\n            </div>\n\n            <!-- 任务状态或金额 -->\n            <!--<div ng-class="{\'task-status\': !(task.status == 1 && task.qty > 0),\n            \'task-reward\': task.status == 1 && task.qty > 0,\n            \'no-quota\': task.status == 1 && task.qty == 0,\n            \'in-progress\': task.status == 2 }"\n                 ng-bind-html="task.statusText"></div>-->\n\n            <div ng-class="{\'task-status\': !(task.status == 1 && task.qty >= 0),\n            \'task-reward\': task.status == 1 && task.qty >= 0,\n            \'in-progress\': task.status == 2 }"\n                 ng-bind-html="task.statusText"></div>\n\n        </div>\n    </div>\n</div>\n\n<div ng-show="fetched" class="container-fluid text-center">\n    <img src="http://m.qkcdn.com/fe/resource/timed_footer.png" alt="" style="width: 157px; margin: 0 0 40px 0"/>\n</div>\n\n<div ng-show="!fetched" class="container-fluid text-center">\n    <img src="http://m.qkcdn.com/fe/resource/Sandglass@3x.png" alt="" style="width: 36px; height: 46px; margin: 100px 0 0 0"/>\n    <p style="font-size: 14px; line-height: 22px; margin-top: 16px; color: #ccc; text-align: center">\n        一大波用户正在同时涌入<br>\n        请耐心等待或稍后刷新\n    </p>\n</div>\n\n<!-- 5001 - 5005 申请失败提示框 -->\n<div class="md-modal md-effect-8" id="modal-no-quota">\n    <div class="md-content">\n        <div style="padding-top: 20px">\n            <img ng-src="{{appliedTaskIcon}}" style="width: 45px; margin-bottom: 25px; border-radius: 6px; ">\n        </div>\n        <div class="title">{{failReason}}</div>\n    </div>\n</div>\n\n<!-- 无法同时申请两个任务确认框 -->\n<div class="md-modal md-effect-8" id="modal-confirm">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div class="title">不能同时抢多个任务哦！要放弃上个任务并接取该任务吗？</div>\n        <div class="btn-wrapper">\n            <div class="left">\n                <button class="btn btn-default btn-outline" ng-click="dismiss(0)">取 消</button>\n            </div>\n            <div class="right">\n                <button class="btn btn-primary" ng-click="dismiss(1)">确 定</button>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- 申请失败提示框 -->\n<div class="md-modal md-effect-8" id="modal-alert">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div class="title">{{tips}}</div>\n        <button class="btn btn-block btn-primary" style="height: 50px;" ng-click="hideAlert()">确 定</button>\n    </div>\n</div>\n\n<!-- 申请下注资格成功 -->\n<div class="md-modal md-effect-8" id="modal-bet">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/timed_bet_task_icon.png" style="width: 45px; margin-bottom: 25px;">\n        </div>\n        <div class="title">恭喜！获得每日下注资格</div>\n        <div class="btn-wrapper">\n            <div class="left">\n                <button class="btn btn-default btn-outline" ng-click="dismissBet(0)">再说吧</button>\n            </div>\n            <div class="right">\n                <button class="btn btn-primary" ng-click="dismissBet(1)">去下注</button>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- 提示升级钥匙 -->\n<div class="md-modal md-effect-8" id="modal-upgrade">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div class="title">当前版本的钥匙不支持IOS9设备</div>\n        <button class="btn btn-block btn-primary" style="height: 50px;" ng-click="downloadQiankaKey()">更新钥匙</button>\n    </div>\n</div>\n\n<!-- 钥匙 -->\n<div class="md-modal md-effect-8" id="modal-key-invalid">\n    <div class="md-content">\n        <span class="pull-right" ng-click="hideModal()"\n              style="color: #ddd; margin-top: -15px; margin-left: 85%; font-size: 24px; font-weight: 300; position: absolute">&times;</span>\n        <div style="padding-top: 15px;margin-bottom: 20px;">\n            <img src="http://m.qkcdn.com/fe/resource/qianka_invalid_key@3x.png" style="width: 60px;">\n        </div>\n        <div style="color: #aaa;margin-bottom: 30px;font-size: 16px;">未检测到钥匙，请打开钥匙</div>\n        <button class="btn btn-block btn-primary"\n                ng-click="openQiankaKey()" style="color: #fff; height: 55px; font-size: 16px; line-height: 37px; background-color: #ec4949; border-color: #ec4949;">\n            打开钥匙\n        </button>\n\n        <div style="color: #aaa;font-size: 13px;padding-top: 15px;">如钥匙闪退，请删除后重新<span style="color: #47a8ef" ng-click="downloadQiankaKey()">下载安装钥匙</span></div>\n    </div>\n</div>\n\n<!-- 任务成功提示 -->\n<div class="md-modal md-effect-8" id="modal-alert2">\n    <div class="md-content">\n        <div style="color: #ec4949;padding-top: 15px;">\n            <div style="font-size: 16px;">{{alert_tip}}</div>\n            <div style="font-size: 13px;padding-top: 10px;color: #aaa">{{alert_title}}</div>\n        </div>\n        <div class="extask-reward">\n            <div class="plus">+</div><div class="reward">{{alert_price}}</div><div class="y">元</div>\n        </div>\n        <button class="btn btn-block btn-primary"\n                ng-click="hideAlert2()" style="color: #fff; height: 55px; font-size: 16px; line-height: 37px; background-color: #ec4949; border-color: #ec4949;">\n            {{alert_name}}\n        </button>\n    </div>\n</div>\n\n<!-- 任务预告提示 -->\n<div class="md-modal md-effect-8" id="modal-task-notice">\n    <div class="md-content" style="color: #aaa; padding-top: 30px; padding-bottom: 30px; text-align: center">\n        <img src="http://m.qkcdn.com/fe/resource/clock@3x.png" alt="" style="width: 43px; height: 43px; margin-bottom: 20px;"/>\n        <div style="font-size: 16px; line-height: 16px; margin-bottom: 10px;">大咖别急</div>\n        <div style="font-size: 16px; line-height: 16px; margin-bottom: 15px;">\n            该任务还没开始哦~\n        </div>\n    </div>\n</div>\n<div class="md-overlay"></div>';
        return __p
    },
    timed_list_with_queue: function(obj) {
        obj || (obj = {});
        {
            var __p = "";
            _.escape
        }
        with (obj)
            __p += '<div ng-show="{{false}}" class="container-fluid key-inactive" style="padding-bottom: 0">\n    <img src="http://m.qkcdn.com/fe/resource/task_key_inactive.png" alt=""/>\n    <div class="tips">\n        <p>友情提示：钥匙未开启状态下是无法进行任务的哟~ 立即打开钥匙开始赚钱！</p>\n        <p>若未安装钥匙或钥匙被删除，请先 <span style="color: #47a8ef" ng-click="downloadQiankaKey()">下载安装</span></p>\n    </div>\n\n    <button class="btn btn-danger btn-block btn-open-key" ng-click="openQiankaKey()">打开钥匙</button>\n</div>\n\n<div ng-show="fetched"\n     class="container-fluid timed-task-list"\n     ng-class="{\'mask\': false}"\n     style="padding-top: 15px; margin-bottom: 20px">\n\n    <div class="list-group" ng-repeat="task in taskList">\n\n        <!-- 显示 任务预告 -->\n        <div ng-show="comingTaskTotalReward > 0\n        && $index > 0\n        && taskList[$index].type == 4\n        && (taskList[$index - 1].type == 3 || taskList[$index - 1].type == 1)" class="list-group-item"\n             style="border: 1px dashed #e5e4e3; color: #aaa; border-radius: 4px; font-size: 13px; line-height: 17px;\n             background: none; margin-bottom: 10px; height: auto">\n            任务即将开始，总计 <span ng-bind="comingTaskTotalReward" style="color: #ec4949"></span> 元，准时来抢！\n        </div>\n\n        <div class="list-group-item" ng-class="{\'mask\': task.status==0 || task.status==3}" ng-click="applyTask(task)">\n\n            <img ng-show="task.type==100"\n                 src="http://m.qkcdn.com/fe/resource/qiang.png" style="position: absolute; top: -.265em; right: -.265em; width: 22px; height: 22px;border-top-right-radius: 4px;"/>\n            <img ng-show="task.type==101"\n                 src="http://m.qkcdn.com/fe/resource/buy_orange@3x.png" style="position: absolute; top: -.265em; right: -.265em; width: 22px; height: 22px;border-top-right-radius: 4px;"/>\n\n            <img class="task-icon" ng-src="{{task.icon}}" alt="" style="display: none" id="task-icon-{{$index}}"\n                 onload="this.style.display = \'block\'; document.getElementById(this.id + \'-loading\').style.display = \'none\'"/>\n            <div class="task-icon" style="position: relative" id="task-icon-{{$index}}-loading">\n                <div class="task-icon-loading"></div>\n            </div>\n\n            <div class="item-content">\n                <div ng-if="task.type!=3" class="title" ng-bind="task.title"></div>\n                <div ng-if="task.type==3" class="inline-title">\n                    {{task.title}}&nbsp;<img src="http://m.qkcdn.com/fe/resource/new2.png" style="width: 30px; height: 14px; margin-top: -2px;" />\n                </div>\n                <div ng-if="task.type==3" ng-show="task.activity" class="activity-superscript" ng-bind="task.activity"></div>\n                <div class="task-tags">\n                    <div class="tag" ng-if="task.type==2"><div class="f-10">当期有效</div></div>\n                    <div class="tag" ng-if="task.type==3"><div class="f-10">超高奖励</div></div>\u2028\n                    <div class="tag" ng-if="task.type==3"><div class="f-10">上不封顶</div></div>\n                    <div class="tag" ng-if="task.type==4"><div class="f-10">{{task.start_date}}</div></div>\n                    <div class="tag" ng-show="task.type!=4&&task.tags[0]"><div class="f-10">免费</div></div>\n                    <div class="tag" ng-show="task.type!=4&&task.tags[1]"><div class="f-10">\n                        <sup style="float: left; margin-top: 10px;">+</sup>\n                        购买</div></div>\n                    <div class="tag" ng-show="task.type!=4&&task.tags[2]"><div class="f-10">有专属</div></div>\n                    <!--<div class="tag highlight" ng-show="task.tags[3] && task.status==1"><div class="f-10">快被抢完</div></div>-->\n\n                    <div class="tag" ng-show="task.type!=3 && task.type!=100 && task.type!=101" ng-class="{\'highlight\': task.tags[3]==2 }"><div class="f-10" ng-bind-html="\'剩 \' + task.qty + \' 份\'"></div></div>\n\n                    <!-- DUOBAO -->\n                    <div class="tag" ng-if="task.type==100"><div class="f-10">{{task.issue_no}}期</div></div>\n                    <div class="tag highlight" ng-if="task.type==100"><div class="f-10">开奖进度{{task.percent}}</div></div>\u2028\n\n                    <!-- 返利帮 -->\n                    <div class="tag" ng-if="task.type==101"><div class="f-10">某宝价{{task.price}}元</div></div>\n                    <div class="tag highlight" ng-if="task.type==101"><div class="f-10">返{{task.fanli}}元</div></div>\n\n                </div>\n\n            </div>\n\n            <!-- 任务状态或金额 -->\n            <!--<div ng-class="{\'task-status\': !(task.status == 1 && task.qty > 0),\n            \'task-reward\': task.status == 1 && task.qty > 0,\n            \'no-quota\': task.status == 1 && task.qty == 0,\n            \'in-progress\': task.status == 2 }"\n                 ng-bind-html="task.statusText"></div>-->\n\n            <div ng-class="{\'task-status\': !(task.status == 1 && task.qty >= 0),\n            \'task-reward\': task.status == 1 && task.qty >= 0,\n            \'in-progress\': task.status == 2 }"\n                 ng-bind-html="task.statusText"></div>\n\n        </div>\n    </div>\n</div>\n\n<div ng-show="fetched" class="container-fluid text-center">\n    <img src="http://m.qkcdn.com/fe/resource/timed_footer.png" alt="" style="width: 157px; margin: 0 0 40px 0"/>\n</div>\n\n<div ng-show="!fetched" class="container-fluid text-center">\n    <img src="http://m.qkcdn.com/fe/resource/Sandglass@3x.png" alt="" style="width: 36px; height: 46px; margin: 100px 0 0 0"/>\n    <p style="font-size: 14px; line-height: 22px; margin-top: 16px; color: #ccc; text-align: center">\n        一大波用户正在同时涌入<br>\n        请耐心等待或稍后刷新\n    </p>\n</div>\n\n<!-- 5001 - 5005 申请失败提示框 -->\n<div class="md-modal md-effect-8" id="modal-no-quota">\n    <div class="md-content">\n        <div style="padding-top: 20px">\n            <img ng-src="{{appliedTaskIcon}}" style="width: 45px; margin-bottom: 25px; border-radius: 6px; ">\n        </div>\n        <div class="title">{{failReason}}</div>\n    </div>\n</div>\n\n<!-- 无法同时申请两个任务确认框 -->\n<div class="md-modal md-effect-8" id="modal-confirm">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div class="title">不能同时抢多个任务哦！要放弃上个任务并接取该任务吗？</div>\n        <div class="btn-wrapper">\n            <div class="left">\n                <button class="btn btn-default btn-outline" ng-click="dismiss(0)">取 消</button>\n            </div>\n            <div class="right">\n                <button class="btn btn-primary" ng-click="dismiss(1)">确 定</button>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- 申请失败提示框 -->\n<div class="md-modal md-effect-8" id="modal-alert">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div class="title">{{tips}}</div>\n        <button class="btn btn-block btn-primary" style="height: 50px;" ng-click="hideAlert()">确 定</button>\n    </div>\n</div>\n\n<!-- 申请下注资格成功 -->\n<div class="md-modal md-effect-8" id="modal-bet">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/timed_bet_task_icon.png" style="width: 45px; margin-bottom: 25px;">\n        </div>\n        <div class="title">恭喜！获得每日下注资格</div>\n        <div class="btn-wrapper">\n            <div class="left">\n                <button class="btn btn-default btn-outline" ng-click="dismissBet(0)">再说吧</button>\n            </div>\n            <div class="right">\n                <button class="btn btn-primary" ng-click="dismissBet(1)">去下注</button>\n            </div>\n        </div>\n    </div>\n</div>\n\n<!-- 提示升级钥匙 -->\n<div class="md-modal md-effect-8" id="modal-upgrade">\n    <div class="md-content">\n        <div style="padding-top: 25px">\n            <img src="http://m.qkcdn.com/fe/resource/warning.png" style="width: 48px; margin-bottom: 25px;">\n        </div>\n        <div class="title">当前版本的钥匙不支持IOS9设备</div>\n        <button class="btn btn-block btn-primary" style="height: 50px;" ng-click="downloadQiankaKey()">更新钥匙</button>\n    </div>\n</div>\n\n<!-- 钥匙 -->\n<div class="md-modal md-effect-8" id="modal-key-invalid">\n    <div class="md-content">\n        <span class="pull-right" ng-click="hideModal()"\n              style="color: #ddd; margin-top: -15px; margin-left: 85%; font-size: 24px; font-weight: 300; position: absolute">&times;</span>\n        <div style="padding-top: 15px;margin-bottom: 20px;">\n            <img src="http://m.qkcdn.com/fe/resource/qianka_invalid_key@3x.png" style="width: 60px;">\n        </div>\n        <div style="color: #aaa;margin-bottom: 30px;font-size: 16px;">未检测到钥匙，请打开钥匙</div>\n        <button class="btn btn-block btn-primary"\n                ng-click="openQiankaKey()" style="color: #fff; height: 55px; font-size: 16px; line-height: 37px; background-color: #ec4949; border-color: #ec4949;">\n            打开钥匙\n        </button>\n\n        <div style="color: #aaa;font-size: 13px;padding-top: 15px;">如钥匙闪退，请删除后重新<span style="color: #47a8ef" ng-click="downloadQiankaKey()">下载安装钥匙</span></div>\n    </div>\n</div>\n\n<!-- 任务成功提示 -->\n<div class="md-modal md-effect-8" id="modal-alert2">\n    <div class="md-content">\n        <div style="color: #ec4949;padding-top: 15px;">\n            <div style="font-size: 16px;">{{alert_tip}}</div>\n            <div style="font-size: 13px;padding-top: 10px;color: #aaa">{{alert_title}}</div>\n        </div>\n        <div class="extask-reward">\n            <div class="plus">+</div><div class="reward">{{alert_price}}</div><div class="y">元</div>\n        </div>\n        <button class="btn btn-block btn-primary"\n                ng-click="hideAlert2()" style="color: #fff; height: 55px; font-size: 16px; line-height: 37px; background-color: #ec4949; border-color: #ec4949;">\n            {{alert_name}}\n        </button>\n    </div>\n</div>\n\n<!-- 任务预告提示 -->\n<div class="md-modal md-effect-8" id="modal-task-notice">\n    <div class="md-content" style="color: #aaa; padding-top: 30px; padding-bottom: 30px; text-align: center">\n        <img src="http://m.qkcdn.com/fe/resource/clock@3x.png" alt="" style="width: 43px; height: 43px; margin-bottom: 20px;"/>\n        <div style="font-size: 16px; line-height: 16px; margin-bottom: 10px;">大咖别急</div>\n        <div style="font-size: 16px; line-height: 16px; margin-bottom: 15px;">\n            该任务还没开始哦~\n        </div>\n    </div>\n</div>\n\n<!-- 排队提示 -->\n<div class="md-modal md-effect-8" id="modal-queue">\n    <div class="md-content" style="color: #aaa; padding-top: 30px; padding-bottom: 15px; text-align: center">\n        <img src="http://m.qkcdn.com/fe/resource/clock@3x.png" style="width: 43px; height: 43px; margin-bottom: 20px;"/>\n        <div style="font-size: 14px; line-height: 16px; margin-bottom: 20px;">\n            {{queueTips}}\n        </div>\n\n        <button class="btn btn-block btn-primary"\n                ng-click="exitForQueue()" style="color: #fff; height: 55px; font-size: 16px; line-height: 37px;">\n            不等了，抢其他任务试试\n        </button>\n    </div>\n</div>\n<div class="md-overlay"></div>\n';
        return __p
    }
},
define("render/templates", function() {}),
define("base", [], function() {
    var t = function() {}
    ;
    return t.extend = function(e, n) {
        var i = t.prototype.extend;
        t._prototyping = !0;
        var s = new this;
        i.call(s, e),
        s.base = function() {}
        ,
        delete t._prototyping;
        var a = s.constructor
          , o = s.constructor = function() {
            if (!t._prototyping)
                if (this._constructing || this.constructor == o)
                    this._constructing = !0,
                    a.apply(this, arguments),
                    delete this._constructing;
                else if (null  != arguments[0])
                    return (arguments[0].extend || i).call(arguments[0], s)
        }
        ;
        return o.ancestor = this,
        o.extend = this.extend,
        o.forEach = this.forEach,
        o.implement = this.implement,
        o.prototype = s,
        o.toString = this.toString,
        o.valueOf = function(t) {
            return "object" == t ? o : a.valueOf()
        }
        ,
        i.call(o, n),
        "function" == typeof o.init && o.init(),
        o
    }
    ,
    t.prototype = {
        extend: function(e, n) {
            if (arguments.length > 1) {
                var i = this[e];
                if (i && "function" == typeof n && (!i.valueOf || i.valueOf() != n.valueOf()) && /\bbase\b/.test(n)) {
                    var s = n.valueOf();
                    n = function() {
                        var e = this.base || t.prototype.base;
                        this.base = i;
                        var n = s.apply(this, arguments);
                        return this.base = e,
                        n
                    }
                    ,
                    n.valueOf = function(t) {
                        return "object" == t ? n : s
                    }
                    ,
                    n.toString = t.toString
                }
                this[e] = n
            } else if (e) {
                var a = t.prototype.extend;
                t._prototyping || "function" == typeof this || (a = this.extend || a);
                for (var o = {
                    toSource: null 
                }, d = ["constructor", "toString", "valueOf"], l = t._prototyping ? 0 : 1; r = d[l++]; )
                    e[r] != o[r] && a.call(this, r, e[r]);
                for (var r in e)
                    o[r] || a.call(this, r, e[r])
            }
            return this
        }
    },
    t = t.extend({
        constructor: function() {
            this.extend(arguments[0])
        }
    }, {
        ancestor: Object,
        version: "1.1",
        forEach: function(t, e, n) {
            for (var i in t)
                void 0 === this.prototype[i] && e.call(n, t[i], i, t)
        },
        implement: function() {
            for (var t = 0; t < arguments.length; t++)
                "function" == typeof arguments[t] ? arguments[t](this.prototype) : this.prototype.extend(arguments[t]);
            return this
        },
        toString: function() {
            return String(this.valueOf())
        }
    })
}),
define("device", [], function() {
    return console.log("加载设备类!"),
    {
        isIOS: function() {
            var t = window.navigator.userAgent.toLocaleLowerCase()
              , e = t.match(/\biPhone.*Mobile|\biPod|\biPad/i);
            return e ? !0 : !1
        },
        isQKPro: function() {
            var t = /Qianka-Pro-/i
              , e = t.exec(window.navigator.userAgent);
            return e ? !0 : !1
        },
        isIOS9: function() {
            var t = /OS ((\d{1,2})_\d{1,2}||(\d{1,2})_\d{1,2}_\d{1,2}) like Mac OS X/i
              , e = t.exec(window.navigator.userAgent);
            return 9 == e[1].substr(0, 1)
        }
    }
}),
define("base.api", ["base", "device"], function(t, e) {
    function n() {
        function t(t) {
            t.preventDefault()
        }
        var e = document.createElement("div")
          , n = '<div class="md-content">';
        n += '<div style="padding-top: 15px;margin-bottom: 20px;">',
        n += '<img src="http://m.qkcdn.com/fe/resource/qianka_invalid_key@3x.png" style="width: 60px;"></div>',
        n += '<div style="color: #aaa;margin-bottom: 30px;font-size: 16px;">钥匙太旧了，需立即更新</div>',
        n += '<button id="qk-key-btn-upgrade" class="btn btn-block btn-primary" ',
        n += 'style="color: #fff; height: 55px; font-size: 16px; line-height: 37px; background-color: #ec4949; border-color: #ec4949;">',
        n += "立即更新</button></div>",
        e.id = "qk-modal-key-needupgrade",
        e.className = "md-modal md-effect-8",
        e.innerHTML = n;
        var i = document.getElementsByClassName("md-overlay")
          , s = i[i.length - 1];
        document.getElementById("view-content").insertBefore(e, s);
        var a = angular.element(e)
          , o = document.getElementById("qk-key-btn-upgrade");
        o.onclick = function() {
            setTimeout(function() {
                window.location.replace("../authority/index.html#/install?notAutoWs=1&timestamp=" + (new Date).getTime())
            }, 300),
            a.removeClass("md-show"),
            window.removeEventListener("touchmove", t),
            document.removeChild(e)
        }
        ,
        _.delay(function() {
            a.addClass("md-show"),
            window.addEventListener("touchmove", t)
        }, 500)
    }
    function i(t) {
        function e(t) {
            t.preventDefault()
        }
        var n = "发现您的钥匙有新版本<br>是否需要立即更新？";
        t && (n = "您的钥匙即将失效<br>请删除该钥匙重新下载最新版");
        var i = document.createElement("div")
          , s = '<div class="md-content">';
        s += '<div style="padding-top: 25px"><img src="http://m.qkcdn.com/fe/resource/qianka_invalid_key@3x.png" style="width: 48px; margin-bottom: 25px;"></div>',
        s += '<div class="title" style="margin-bottom: 25px;">' + n + "</div>",
        s += '<div class="btn-wrapper" style="width: 100%;height: 50px;">',
        s += '<div class="left" style="width: 50%;float: left;padding-right: 5px;"><button style="width: 100%;height: 50px;border: 1px solid #e5e4e3;background: none;color: #d5d4d3;" class="btn btn-default btn-outline" id="qk-key-btn-hasupgrade-cancel">下次再说</button></div>',
        s += '<div class="right" style="width: 50%;float: right;padding-left: 5px;"><button style="width: 100%;height: 50px;" class="btn btn-danger" id="qk-key-btn-hasupgrade" >立即更新</button></div>',
        s += "</div></div>",
        i.id = "qk-modal-key-hasupgrade",
        i.className = "md-modal md-effect-8",
        i.innerHTML = s;
        var a = document.getElementsByClassName("md-overlay")
          , o = a[a.length - 1];
        document.getElementById("view-content").insertBefore(i, o);
        var d = angular.element(i)
          , l = document.getElementById("qk-key-btn-hasupgrade");
        l.onclick = function() {
            setTimeout(function() {
                window.location.replace("../authority/index.html#/install?notAutoWs=2&timestamp=" + (new Date).getTime())
            }, 300),
            d.removeClass("md-show"),
            window.removeEventListener("touchmove", e),
            document.removeChild(i)
        }
        ;
        var r = document.getElementById("qk-key-btn-hasupgrade-cancel");
        r.onclick = function() {
            d.removeClass("md-show"),
            window.removeEventListener("touchmove", e),
            document.removeChild(i)
        }
        ,
        _.delay(function() {
            d.addClass("md-show"),
            window.addEventListener("touchmove", e)
        }, 500)
    }
    function s(t, s) {
        return 200 == t.code ? (s.resolve(t),
        this.rootScope && (this.rootScope.loaded = !0),
        t.payload && 1 == t.payload.key_invalid ? i(!0) : t.payload && 1 == t.payload.has_upgrade && i(!1)) : 401 == t.code ? window.location.replace(e.isQKPro() ? "/pro/login?timestamp=" + (new Date).getTime() : "../authority/#/welcome?timestamp=" + (new Date).getTime()) : 403 == t.code ? (this.rootScope && (this.rootScope.loaded = !0),
        this._logout(),
        n()) : 400 == t.code ? window.location.replace("http://m.qianka.com/") : s.reject(t),
        s
    }
    function a(t, e) {
        return e.reject(t),
        e
    }
    return console.log("Base Api Load!"),
    t.extend({
        constructor: function(t, e) {
            this.http = t[0],
            this.q = t[1],
            this.prefix = e,
            this.rootScope = t[2]
        },
        _successCallback: s,
        _failCallback: a,
        _post: function(t) {
            var e = this.prefix
              , n = this.http
              , i = this.q
              , s = {
                url: e + t.uri,
                method: "POST"
            };
            t.data && (s.data = t.data);
            var a = i.defer()
              , o = this;
            return n(s).success(function(t, e) {
                a = o._successCallback(t, a)
            }).error(function(t, e) {
                a = o._failCallback(t, a)
            }),
            a.promise
        },
        _get: function(t, e) {
            var n = this.prefix
              , i = this.http
              , s = this.q
              , a = s.defer()
              , o = this;
            return i.get(n + t, {
                params: e
            }).success(function(t, e) {
                a = o._successCallback(t, a)
            }).error(function(t, e) {
                a = o._failCallback(t, a)
            }),
            a.promise
        },
        _logout: function() {
            var t = this.http;
            t.get("/logout")
        }
    })
}),
define("services/api", ["base.api"], function(t) {
    console.log("Task Api Load!");
    var e = "/api/h5/"
      , n = "qiankakey/setting"
      , i = "subtask/fetch"
      , s = "subtask/get"
      , a = "subtask/stop"
      , o = "zstask/fetch"
      , d = "zstask/get"
      , l = "zstask/start"
      , r = "zstask/stop"
      , c = "betting/rights"
      , u = "subtask/start_v2"
      , p = "subtask/cancel";
    return t.extend({
        constructor: function(t) {
            this.base(t, e)
        },
        _post: function(t) {
            return this.base(t)
        },
        _get: function(t, e) {
            return this.base(t, e)
        },
        getQiankaKeySetting: function() {
            return this._get(n)
        },
        getTimedTaskList: function() {
            return this._get(i)
        },
        getTimedTaskDetail: function(t) {
            var e = {
                task_id: t
            };
            return console.log("params", e),
            this._get(s, e)
        },
        applyForTimedTaskOld: function(t) {
            var e = {
                uri: "subtask/start",
                data: {
                    task_id: t
                }
            };
            return this._post(e)
        },
        applyForTimedTask: function(t) {
            var e = {
                uri: u,
                data: {
                    task_id: t
                }
            };
            return this._post(e)
        },
        exitForQueue: function() {
            var t = {
                uri: p
            };
            return this._post(t)
        },
        abandonTimedTask: function(t) {
            var e = {
                uri: a,
                data: {
                    task_id: t
                }
            };
            return this._post(e)
        },
        getExclusiveTaskList: function() {
            return this._get(o)
        },
        applyForExclusiveTask: function(t) {
            var e = {
                uri: l,
                data: {
                    zs_task_id: t
                }
            };
            return this._post(e)
        },
        getExclusiveTaskDetail: function(t) {
            var e = {
                zs_task_id: t
            };
            return this._get(d, e)
        },
        abandonExclusiveTask: function(t) {
            var e = {
                uri: r,
                data: {
                    zs_task_id: t
                }
            };
            return this._post(e)
        },
        applyForBettingRights: function(t, e) {
            var n = {
                uri: c,
                data: {
                    task_id: t,
                    gaming_id: e
                }
            };
            return this._post(n)
        }
    })
}),
define("services/stub", [], function() {
    function t(t) {
        return t in s ? s[t] : null 
    }
    function e(t, e) {
        return s[t] = e,
        !0
    }
    function n(t) {
        var e = t in s;
        return e ? delete s[t] : !1
    }
    function i() {
        return s = {},
        !0
    }
    console.log("Storage Stub Load!");
    var s = {};
    return {
        getItem: t,
        setItem: e,
        removeItem: n,
        clear: i
    }
}),
define("services/tracking", [], function() {
    function t() {
        s.addEventListener ? s.addEventListener("storage", e, !1) : s.attachEvent ? s.attachEvent("onstorage", e) : s.onstorage = e
    }
    function e(t) {
        function e(e) {
            e(JSON.parse(t.newValue), JSON.parse(t.oldValue), t.url || t.uri)
        }
        t || (t = s.event);
        var n = a[t.key];
        n && n.forEach(e)
    }
    function n(e, n) {
        a[e] ? a[e].push(n) : a[e] = [n],
        o === !1 && t()
    }
    function i(t, e) {
        var n = a[t];
        n.length > 1 ? n.splice(n.indexOf(e), 1) : a[t] = []
    }
    console.log("Storage Listener Load!");
    var s = window
      , a = {}
      , o = !1;
    return {
        on: n,
        off: i
    }
}),
define("services/storage", ["services/stub", "services/tracking"], function(t, e) {
    function n(t, e) {
        return 1 === arguments.length ? i(t) : s(t, e)
    }
    function i(t) {
        return JSON.parse(l.getItem(t))
    }
    function s(t, e) {
        try {
            return l.setItem(t, JSON.stringify(e)),
            !0
        } catch (n) {
            return !1
        }
    }
    function a(t) {
        return l.removeItem(t)
    }
    function o() {
        return l.clear()
    }
    console.log("Storage Load!");
    var d = window
      , l = "localStorage" in d && d.localStorage ? d.localStorage : t;
    return n.set = s,
    n.get = i,
    n.remove = a,
    n.clear = o,
    n.on = e.on,
    n.off = e.off,
    n
}),
define("storage-factory", [], function() {
    function t(t) {
        function e(t) {
            var e = s[t];
            if (e && "localStorage" === t) {
                var n = "__" + Math.round(1e7 * Math.random());
                try {
                    localStorage.setItem(n, n),
                    localStorage.removeItem(n)
                } catch (i) {
                    e = !1
                }
            }
            return e
        }
        function n(t) {
            var n, d, l = e(t) || (a.warn("This browser does not support Web Storage!"),
            {
                setItem: function() {},
                getItem: function() {}
            }), r = {
                $default: function(t) {
                    for (var e in t)
                        angular.isDefined(r[e]) || (r[e] = t[e]);
                    return r
                },
                $reset: function(t) {
                    for (var e in r)
                        "$" === e[0] || delete r[e];
                    return r.$default(t)
                }
            };
            try {
                l = s[t],
                l.length
            } catch (c) {
                a.warn("This browser does not support Web Storage!"),
                l = {}
            }
            for (var u, p = 0, v = l.length; v > p; p++)
                (u = l.key(p)) && "ngStorage-" === u.slice(0, 10) && (r[u.slice(10)] = angular.fromJson(l.getItem(u)));
            return n = angular.copy(r),
            i.$watch(function() {
                var t;
                d || (d = o(function() {
                    if (d = null ,
                    !angular.equals(r, n)) {
                        t = angular.copy(n),
                        angular.forEach(r, function(e, n) {
                            angular.isDefined(e) && "$" !== n[0] && l.setItem("ngStorage-" + n, angular.toJson(e)),
                            delete t[n]
                        });
                        for (var e in t)
                            l.removeItem("ngStorage-" + e);
                        n = angular.copy(r)
                    }
                }, 100, !1))
            }),
            "localStorage" === t && s.addEventListener && s.addEventListener("storage", function(t) {
                "ngStorage-" === t.key.slice(0, 10) && (t.newValue ? r[t.key.slice(10)] = angular.fromJson(t.newValue) : delete r[t.key.slice(10)],
                n = angular.copy(r),
                i.$apply())
            }),
            r
        }
        var i = t[0]
          , s = t[1]
          , a = t[2]
          , o = t[3];
        return {
            instance: n
        }
    }
    return console.log("Storage Load!"),
    t
}),
define("utils", [], function() {
    function t() {
        function t(t) {
            return t ? "" + t.toFixed(2) : "0.00"
        }
        function e(t) {
            var e = Date.parse(t)
              , n = new Date(e);
            if (isNaN(n)) {
                var i = t.split("-");
                n = new Date(i[0],--i[1],i[2])
            }
            return n
        }
        function n(t, e) {
            var n = new Date;
            n.setTime(t);
            var i = n.getFullYear()
              , s = (n.getMonth() + 101 + "").slice(1)
              , a = (n.getDate() + 100 + "").slice(1);
            if ("yyyy-MM-dd" === e)
                return i + "-" + s + "-" + a;
            if ("yyyy-MM-dd hh:mm:ss" === e) {
                var o = (n.getHours() + 100 + "").slice(1)
                  , d = (n.getMinutes() + 100 + "").slice(1)
                  , l = (n.getSeconds() + 100 + "").slice(1);
                return i + "-" + s + "-" + a + " " + o + ":" + d + ":" + l
            }
        }
        return {
            currency: t,
            strToDate: e,
            dateToStr: n
        }
    }
    return console.log("Utils Load!"),
    t
}),
define("toast", [], function() {
    function t(t) {
        t.preventDefault()
    }
    function e(e) {
        function n(e, n) {
            l.toastMsg = e,
            r(function() {
                d.addClass("md-show")
            }, 300),
            window.addEventListener("touchmove", t),
            r(i, n || 1500)
        }
        function i() {
            d.removeClass("md-show"),
            window.removeEventListener("touchmove", t)
        }
        function s(t) {
            t.message && n(t.message)
        }
        function a(t) {
            var e = t && t.message || "无法连接，请检查网络";
            n(e)
        }
        var o = document.getElementById("toast")
          , d = angular.element(o)
          , l = e[0]
          , r = e[1];
        return {
            show: n,
            hide: i,
            success: s,
            error: a
        }
    }
    return console.log("Global Toast Load!"),
    e
}),
define("dialog", [], function() {
    function t(t) {
        t.preventDefault()
    }
    function e(e) {
        function n(e) {
            var n = {};
            n.title = e.title,
            n.message = e.message,
            n.btnText = e.btnText,
            s.alertBody = n,
            i.addClass("md-show"),
            window.addEventListener("touchmove", t)
        }
        var i = angular.element(document.getElementById("alert"))
          , s = (angular.element(document.getElementById("confirm")),
        e[0])
          , a = (e[1],
        document.getElementById("btn-close-alert"));
        return a.onclick = function() {
            i.removeClass("md-show"),
            window.removeEventListener("touchmove", t)
        }
        ,
        {
            alert: n
        }
    }
    return console.log("Global Dialog Load!"),
    e
}),
define("common-services", ["angular", "storage-factory", "utils", "toast", "device", "dialog"], function(t, e, n, i, s, a) {
    return console.log("Common Services Load!"),
    angular.module("common.services", ["ngAnimate", "ngSanitize", "ui.router"]).factory("$localStorage", ["$rootScope", "$window", "$log", "$timeout", function(t, n, i, s) {
        return new e([t, n, i, s]).instance("localStorage")
    }
    ]).factory("$sessionStorage", ["$rootScope", "$window", "$log", "$timeout", function(t, n, i, s) {
        return new e([t, n, i, s]).instance("sessionStorage")
    }
    ]).factory("$utils", [function() {
        return new n
    }
    ]).factory("$toast", ["$rootScope", "$timeout", function(t, e) {
        var n = [t, e];
        return new i(n)
    }
    ]).factory("$dialog", ["$rootScope", "$q", function(t, e) {
        var n = [t, e];
        return new a(n)
    }
    ]).factory("$device", [function() {
        return s
    }
    ])
}),
define("task.services", ["services/api", "services/storage", "common-services"], function(t, e) {
    return console.log("Task Services Load!"),
    window.cache = e,
    angular.module("task.services", ["common.services"]).factory("$api", ["$http", "$q", "$rootScope", function(e, n, i) {
        return new t([e, n, i])
    }
    ])
}),
define("task.controllers", ["task.services"], function() {
    return console.log("Task Controllers Load!"),
    angular.module("task.controllers", ["task.services"])
}),
define("controllers/main", ["task.controllers"], function(t) {
    console.log("Main Controller Load!"),
    t.controller("MainCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "$q", "$api", "$toast", function(t, e, n, i, s, a, o) {
        function d() {
            if (!p)
                return u("timed.list"),
                !1;
            console.log(p);
            var e = angular.element(document.getElementById("modal-abandon"))
              , n = s.defer()
              , i = n.promise;
            e.addClass("md-show"),
            window.addEventListener("touchmove", r),
            t.dismiss = function(e) {
                n.resolve(e),
                window.removeEventListener("touchmove", r),
                t.applying = -1
            }
            ,
            i.then(function(t) {
                t && a.abandonTimedTask(p).then(function(t) {
                    console.log(t),
                    u(1 == v ? "timed.listWithQueue" : "timed.list")
                }, function(t) {
                    console.log(t),
                    o.error(t)
                }),
                e.removeClass("md-show"),
                window.removeEventListener("touchmove", r)
            })
        }
        function l() {
            if (!m)
                return u("exclusive.list"),
                !1;
            console.log(p);
            var e = angular.element(document.getElementById("modal-abandon"))
              , n = s.defer()
              , i = n.promise;
            e.addClass("md-show"),
            window.addEventListener("touchmove", r),
            t.dismiss = function(e) {
                n.resolve(e),
                window.removeEventListener("touchmove", r),
                t.applying = -1
            }
            ,
            i.then(function(t) {
                t && a.abandonExclusiveTask(p).then(function(t) {
                    console.log(t),
                    m = !1,
                    u("exclusive.list")
                }, function(t) {
                    console.log(t),
                    o.error(t)
                }),
                e.removeClass("md-show"),
                window.removeEventListener("touchmove", r)
            })
        }
        function r(t) {
            t.preventDefault()
        }
        function c() {
            clearInterval(e.taskTimer),
            window.socket && (socket.disconnect(),
            socket = void 0),
            window.location.replace("../dashboard/index.html?timestamp=" + (new Date).getTime())
        }
        function u(t) {
            clearInterval(e.taskTimer),
            window.socket && (socket.disconnect(),
            socket = void 0),
            n.go(t)
        }
        var p, v, g = n.current.name;
        t.$on("headerTitleChanged", function(e, i) {
            t.headerTitle = i.headerTitle,
            i.taskId && (p = i.taskId),
            i.from && (v = i.from),
            g = n.current.name
        }),
        t.back = function() {
            switch (g) {
            case "timed.list":
                c();
                break;
            case "timed.listWithQueue":
                c();
                break;
            case "exclusive.list":
                c();
                break;
            case "alliance.list":
                c();
                break;
            case "timed.detail":
                d();
                break;
            case "timed.detailIOS9":
                d();
                break;
            case "exclusive.detail":
                l();
                break;
            case "exclusive.detailIOS9":
                l();
                break;
            case "alliance.detail":
                u("alliance.list")
            }
        }
        ,
        t.headerClicked = function() {
            window.scroll(0, 0)
        }
        ;
        var m = !1;
        t.$on("zsTaskStarted", function() {
            m = !0
        })
    }
    ])
}),
define("controllers/timed", ["task.controllers", "websocket"], function(t, e) {
    console.log("Timed Task List Controller Load!"),
    t.controller("TimedTaskListCtrl", ["$scope", "$rootScope", "$state", "$api", "$toast", "$timeout", "$q", "$device", "$http", function(t, n, i, s, a, o, d, l, r) {
        function c() {
            s.getTimedTaskList().then(function(e) {
                t.fetched = !0;
                var n = (new Date).getTime();
                !z || T > z.version || n - z.time > 3e5 || !_.isEqual(z.data, e.data) ? (u(e.data),
                window.cache.set(x, {
                    data: e.data,
                    version: T,
                    time: n
                })) : console.log("no re-rendering")
            }, function(t) {
                a.error(t)
            })
        }
        function u(e) {
            D = !1;
            var n = window.clone(e);
            _.each(n, function(t) {
                if (1 == t.type || 4 == t.type) {
                    2 == t.status && (D = !0),
                    t.tags.push(t.qty >= 0 && t.qty < 200 ? 2 : 1),
                    t.reward = (parseFloat(t.reward) + parseFloat(t.exclusive_reward)).toFixed(1);
                    {
                        var e = t.status;
                        t.qty
                    }
                    0 == e ? t.statusText = "已错过" : 1 == e ? t.statusText = '<div class="plus">+</div><div class="reward">' + t.reward + '</div><div class="y">元</div>' : 2 == e ? t.statusText = "进行中" : 3 == e && (t.statusText = "已完成")
                } else
                    2 == t.type ? (t.icon = "http://m.qkcdn.com/fe/resource/timed_bet_task_icon.png",
                    t.statusText = "试试手气") : 3 == t.type ? (t.reward = t.reward + t.exclusive_reward,
                    t.statusText = '<div class="plus">+</div><div class="reward" style="margin-right: 2px;">100</div><div class="y">%</div>',
                    t.icon = "http://m.qkcdn.com/fe/resource/invite@3x.png") : 100 == t.type ? t.statusText = '<div class="reward" style="margin-right: 2px;">1</div><div class="y">元</div>' : 101 == t.type && (t.statusText = '<div class="reward" style="margin-right: 2px;">' + t.discount + '</div><div class="y">折</div>')
            }),
            console.log("taskList", n);
            var i = 0;
            _.each(_.filter(n, function(t) {
                return 4 == t.type
            }), function(t) {
                i += parseFloat(t.reward) + parseFloat(t.exclusive_reward)
            }),
            console.log("即将上线任务总金额", i),
            t.comingTaskTotalReward = parseFloat(i).toFixed(1),
            t.taskList = n,
            o(function() {
                console.log("render()" + (new Date).getTime()),
                t.$digest()
            })
        }
        function p(t) {
            if (E)
                return a.show("频率过高，10秒后重试"),
                !1;
            E = !0,
            _.delay(function() {
                E = !1
            }, $),
            a.show("争抢任务中..", 31536e6),
            A = d.defer(),
            C = A.promise,
            C.then(function() {}, function(t) {
                "" != t && a.show(t)
            });
            var e = (new Date).getTime();
            socket.on("lppa-" + e, function(e) {
                console.log("lppa", e);
                var n = e.data;
                0 == n.code ? v(t) : A.reject(n.msg)
            }),
            socket.lppa(t.bid, e)
        }
        function v(e) {
            s.applyForTimedTaskOld(e.id).then(function(t) {
                var i = t.data;
                return 1 == i.is_finish ? (a.success(t),
                o(function() {
                    n.loaded = !1,
                    c()
                }, 1500),
                !1) : (e.timeout = i.timeout,
                void g(e))
            }, function(n) {
                A.reject(""),
                5001 == n.code ? o(function() {
                    a.hide(),
                    t.bindMobileFlag = 1,
                    f(n.message)
                }, 500) : _.indexOf([5002, 5003, 5004, 5005], n.code) > -1 ? o(function() {
                    a.hide(),
                    t.failReason = n.message,
                    t.appliedTaskIcon = e.icon;
                    var i = document.getElementById("modal-no-quota")
                      , s = angular.element(i);
                    s.addClass("md-show"),
                    o(function() {
                        s.removeClass("md-show")
                    }, 1500)
                }, 500) : o(function() {
                    a.error(n)
                }, 500)
            })
        }
        function g(t) {
            var e = (new Date).getTime();
            socket.on("taskstarted-" + e, function(e) {
                console.log(e),
                socket.disconnect(),
                socket = void 0;
                var n = 1500;
                a.show("成功抢得任务，正在跳转", n),
                o(function() {
                    y(t.id)
                }, n)
            }),
            socket.taskStarted(t.id, t.timeout, e)
        }
        function m(e) {
            if (l.isIOS9() && 0 == window.canSupportIOS9) {
                var n = angular.element(document.getElementById("modal-upgrade"));
                return n.addClass("md-show"),
                window.addEventListener("touchmove", w),
                !1
            }
            if (1 == e.type) {
                if (0 == e.status || 3 == e.status)
                    return !1;
                if (2 == e.status)
                    return socket.disconnect(),
                    socket = void 0,
                    y(e.id),
                    !1;
                if (D) {
                    var i = angular.element(document.getElementById("modal-confirm"))
                      , r = d.defer()
                      , c = r.promise;
                    i.addClass("md-show"),
                    window.addEventListener("touchmove", w),
                    t.dismiss = function(t) {
                        r.resolve(t),
                        window.removeEventListener("touchmove", w)
                    }
                    ,
                    c.then(function(t) {
                        t && p(e),
                        i.removeClass("md-show")
                    })
                } else
                    p(e)
            } else if (3 == e.type)
                b();
            else {
                var u = e.id
                  , v = e.gaming_id;
                s.applyForBettingRights(u, v).then(function(e) {
                    var n = angular.element(document.getElementById("modal-bet"))
                      , i = d.defer()
                      , s = i.promise;
                    n.addClass("md-show"),
                    window.addEventListener("touchmove", w),
                    t.dismissBet = function(t) {
                        i.resolve(t),
                        window.removeEventListener("touchmove", w)
                    }
                    ,
                    s.then(function(t) {
                        n.removeClass("md-show"),
                        t && window.location.replace("../bet")
                    })
                }, function(n) {
                    if (_.indexOf([5001, 5002, 5003, 5004, 5005], n.code) > -1) {
                        t.failReason = n.message,
                        t.appliedTaskIcon = e.icon;
                        var i = document.getElementById("modal-no-quota")
                          , s = angular.element(i);
                        s.addClass("md-show"),
                        o(function() {
                            s.removeClass("md-show")
                        }, 1500)
                    } else
                        a.error(n)
                })
            }
        }
        function f(e) {
            t.tips = e,
            O.addClass("md-show"),
            window.addEventListener("touchmove", w)
        }
        function k() {
            var t = document.getElementById("modal-key-invalid")
              , e = angular.element(t);
            e.removeClass("md-show"),
            window.removeEventListener("touchmove", w)
        }
        function h(e) {
            var n = angular.element(document.getElementById("modal-alert2"));
            e || (e = {}),
            t.alert_tip = e.tip || "恭喜！任务完成！",
            t.alert_title = e.title || "",
            t.alert_price = e.price || "",
            t.alert_name = e.name || "很好，继续",
            o(function() {
                t.$digest(),
                n.addClass("md-show"),
                window.addEventListener("touchmove", w)
            })
        }
        function w(t) {
            t.preventDefault()
        }
        function y(t) {
            l.isIOS9() ? i.go("timed.detailIOS9", {
                taskId: t
            }) : i.go("timed.detail", {
                taskId: t
            })
        }
        function b() {
            window.location.replace("../prentice/index.html#/task/list/2")
        }
        var x = "QK_TIMEDTASKLIST"
          , T = 1
          , I = (new Date).getTime()
          , S = !1
          , E = !1
          , $ = 1e4;
        window.socket && (socket.disconnect(),
        socket = void 0),
        t.$emit("headerTitleChanged", {
            headerTitle: "限时任务"
        }),
        window.scroll(0, 0),
        n.loaded = !1,
        t.isKeyInvalid = !0;
        var L = !1;
        window.socket = new e,
        s.getQiankaKeySetting().then(function(e) {
            var i = e.data
              , s = i.websocket_url;
            window.sessionId = i.session_id,
            window.plist = i.plist,
            window.releaseVersion = i.release_version,
            window.localVersion = i.version,
            window.schemeLoginUrl = i.scheme_login_url,
            window.canSupportIOS9 = i.can_support_ios9,
            socket.on("open", function(e) {
                console.log("钥匙已打开"),
                t.isKeyInvalid = !1,
                L = !1,
                S && (S = !1,
                k()),
                o(function() {
                    t.$digest()
                })
            }),
            socket.on("close", function(e) {
                var i = 1;
                console.log(i + "秒后重新连接"),
                t.isKeyInvalid = !0,
                L = !0,
                n.loaded = !0,
                o(function() {
                    t.$digest()
                }),
                _.delay(function() {
                    socket.connect(s)
                }, 1e3 * i)
            }),
            socket.on("taskresult", function(t) {
                var e = t.data;
                if (0 == e.code) {
                    var n = e.data.task_info;
                    h({
                        title: "限时任务《" + n.subtitle + "》",
                        price: n.subcurrency,
                        name: "很好，继续赚钱"
                    })
                }
            }),
            socket.connect(s)
        }),
        t.openQiankaKey = function() {
            S = !0,
            window.location.href = window.schemeLoginUrl
        }
        ,
        t.downloadQiankaKey = function() {
            var t = document.getElementById("modal-upgrade")
              , e = angular.element(t);
            e.removeClass("md-show"),
            window.removeEventListener("touchmove", w),
            l.isIOS9() ? window.location.replace("../authority/#/install") : window.location.href = window.plist
        }
        ,
        t.taskList = [];
        var A, C, D = !1, z = window.cache.get(x);
        console.log("cache", z),
        z && I - z.time < 3e5 && (console.log("默认渲染"),
        u(z.data)),
        c();
        var B = angular.element(document.getElementById("modal-task-notice"));
        t.applyTask = function(e) {
            return 100 == e.type ? (window.location.href = e.duobao_url,
            !1) : 101 == e.type ? (window.location.href = e.url,
            !1) : 4 == e.type ? (B.addClass("md-show"),
            window.addEventListener("touchmove", w),
            o(function() {
                t.closeNotice()
            }, 2e3),
            !1) : L ? (a.show("钥匙检测中...", 3e3),
            o(function() {
                if (L) {
                    var t = document.getElementById("modal-key-invalid")
                      , n = angular.element(t);
                    n.addClass("md-show"),
                    window.addEventListener("touchmove", w)
                } else
                    m(e)
            }, 3e3),
            !1) : void m(e)
        }
        ;
        var O = angular.element(document.getElementById("modal-alert"));
        t.hideAlert = function() {
            O.removeClass("md-show"),
            window.removeEventListener("touchmove", w),
            1 == t.bindMobileFlag && o(function() {
                window.location.replace("../user/index.html#/main/bind_mobile/2")
            }, 100)
        }
        ,
        t.hideModal = function() {
            k()
        }
        ,
        t.hideAlert2 = function() {
            var t = angular.element(document.getElementById("modal-alert2"));
            t.removeClass("md-show"),
            window.removeEventListener("touchmove", w)
        }
        ,
        t.closeNotice = function() {
            B.removeClass("md-show"),
            window.removeEventListener("touchmove", w)
        }
    }
    ])
}),
define("controllers/timed.queue", ["task.controllers", "websocket"], function(t, e) {
    console.log("Timed Task List With Queue Controller Load!"),
    t.controller("TimedTaskListWithQueueCtrl", ["$scope", "$rootScope", "$state", "$api", "$toast", "$timeout", "$q", "$device", "$http", function(t, n, i, s, a, o, d, l, r) {
        function c() {
            s.getTimedTaskList().then(function(e) {
                t.fetched = !0;
                var n = (new Date).getTime();
                !Q || S > Q.version || n - Q.time > 3e5 || !_.isEqual(Q.data, e.data) ? (u(e.data),
                console.log(K),
                window.cache.set(I, {
                    data: e.data,
                    version: S,
                    time: n
                })) : console.log("no re-rendering")
            }, function(t) {
                a.error(t)
            })
        }
        function u(e) {
            K = !1;
            var n = window.clone(e)
              , i = _.find(e, function(t) {
                return t.status = 2
            });
            console.log("检测是否有状态为2的任务 => ", i),
            _.each(n, function(t) {
                if (1 == t.type || 4 == t.type) {
                    2 == t.status && (K = !0),
                    t.tags.push(t.qty >= 0 && t.qty < 200 ? 2 : 1),
                    t.reward = (parseFloat(t.reward) + parseFloat(t.exclusive_reward)).toFixed(1);
                    {
                        var e = t.status;
                        t.qty
                    }
                    0 == e ? t.statusText = "已错过" : 1 == e ? t.statusText = '<div class="plus">+</div><div class="reward">' + t.reward + '</div><div class="y">元</div>' : 2 == e ? t.statusText = "进行中" : 3 == e && (t.statusText = "已完成")
                } else
                    2 == t.type ? (t.icon = "http://m.qkcdn.com/fe/resource/timed_bet_task_icon.png",
                    t.statusText = "试试手气") : 3 == t.type ? (t.reward = t.reward + t.exclusive_reward,
                    t.statusText = '<div class="plus">+</div><div class="reward" style="margin-right: 2px;">100</div><div class="y">%</div>',
                    t.icon = "http://m.qkcdn.com/fe/resource/invite@3x.png") : 100 == t.type ? t.statusText = '<div class="reward" style="margin-right: 2px;">1</div><div class="y">元</div>' : 101 == t.type && (t.statusText = '<div class="reward" style="margin-right: 2px;">' + t.discount + '</div><div class="y">折</div>')
            }),
            console.log("taskList", n);
            var s = 0;
            _.each(_.filter(n, function(t) {
                return 4 == t.type
            }), function(t) {
                s += parseFloat(t.reward) + parseFloat(t.exclusive_reward)
            }),
            console.log("即将上线任务总金额", s),
            t.comingTaskTotalReward = parseFloat(s).toFixed(1),
            t.taskList = n,
            o(function() {
                console.log("render()" + (new Date).getTime()),
                t.$digest()
            })
        }
        function p(t) {
            B = d.defer(),
            O = B.promise,
            O.then(function() {}, function(t) {
                "" != t && a.show(t)
            });
            var e = (new Date).getTime();
            socket.on("lppa-" + e, function(e) {
                console.log("lppa", e);
                var n = e.data;
                0 == n.code ? (A = !1,
                C = !1,
                D = 0,
                z = 0,
                v(t)) : B.reject(n.msg)
            }),
            socket.lppa(t.bid, e)
        }
        function v(t) {
            return console.log("APPLY_COUNT=>" + z + ", STOP_QUEUING=>" + A),
            z++,
            A ? !1 : (1 == z && (console.log("toast => 争抢任务中.."),
            a.show("争抢任务中..", 31536e6)),
            C = !0,
            void s.applyForTimedTask(t.id).then(function(e) {
                C = !1;
                var n = e.data
                  , i = n.type
                  , s = n.msg
                  , d = 2e3;
                void 0 != n.delay && (d = n.delay),
                1 == i ? (D = 0,
                2 == z ? (o(function() {
                    a.hide()
                }, 1300),
                o(function() {
                    h(s),
                    o(function() {
                        o(function() {
                            v(t)
                        }, d)
                    }, 300)
                }, 1300)) : o(function() {
                    v(t)
                }, d)) : 2 == i ? (D = 1,
                t.timeout = n.timeout,
                y(),
                g(t)) : 3 == i && (D = 0,
                a.show(s),
                o(function() {
                    c()
                }, 1500))
            }))
        }
        function g(t) {
            var e = (new Date).getTime();
            socket.on("taskstarted-" + e, function(e) {
                console.log(e),
                socket.disconnect(),
                socket = void 0;
                var n = 1500;
                a.show("成功抢得任务，正在跳转", n),
                o(function() {
                    x(t.id)
                }, n + 300)
            }),
            socket.taskStarted(t.id, t.timeout, e)
        }
        function m(e) {
            if (l.isIOS9() && 0 == window.canSupportIOS9) {
                var n = angular.element(document.getElementById("modal-upgrade"));
                return n.addClass("md-show"),
                window.addEventListener("touchmove", b),
                !1
            }
            if (1 == e.type) {
                if (0 == e.status || 3 == e.status)
                    return !1;
                if (2 == e.status)
                    return g(e),
                    !1;
                if (K) {
                    var i = angular.element(document.getElementById("modal-confirm"))
                      , r = d.defer()
                      , c = r.promise;
                    i.addClass("md-show"),
                    window.addEventListener("touchmove", b),
                    t.dismiss = function(t) {
                        r.resolve(t),
                        window.removeEventListener("touchmove", b)
                    }
                    ,
                    c.then(function(t) {
                        t && p(e),
                        i.removeClass("md-show")
                    })
                } else
                    p(e)
            } else if (3 == e.type)
                T();
            else {
                var u = e.id
                  , v = e.gaming_id;
                s.applyForBettingRights(u, v).then(function(e) {
                    var n = angular.element(document.getElementById("modal-bet"))
                      , i = d.defer()
                      , s = i.promise;
                    n.addClass("md-show"),
                    window.addEventListener("touchmove", b),
                    t.dismissBet = function(t) {
                        i.resolve(t),
                        window.removeEventListener("touchmove", b)
                    }
                    ,
                    s.then(function(t) {
                        n.removeClass("md-show"),
                        t && window.location.replace("../bet")
                    })
                }, function(n) {
                    if (_.indexOf([5001, 5002, 5003, 5004, 5005], n.code) > -1) {
                        t.failReason = n.message,
                        t.appliedTaskIcon = e.icon;
                        var i = document.getElementById("modal-no-quota")
                          , s = angular.element(i);
                        s.addClass("md-show"),
                        o(function() {
                            s.removeClass("md-show")
                        }, 1500)
                    } else
                        a.error(n)
                })
            }
        }
        function f() {
            var t = document.getElementById("modal-key-invalid")
              , e = angular.element(t);
            e.removeClass("md-show"),
            window.removeEventListener("touchmove", b)
        }
        function k(e) {
            var n = angular.element(document.getElementById("modal-alert2"));
            e || (e = {}),
            t.alert_tip = e.tip || "恭喜！任务完成！",
            t.alert_title = e.title || "",
            t.alert_price = e.price || "",
            t.alert_name = e.name || "很好，继续",
            o(function() {
                t.$digest(),
                n.addClass("md-show"),
                window.addEventListener("touchmove", b)
            })
        }
        function h(e) {
            t.queueTips = e,
            R.addClass("md-show"),
            window.addEventListener("touchmove", b)
        }
        function w() {
            R.removeClass("md-show"),
            window.removeEventListener("touchmove", b),
            o(function() {
                A = !0,
                C ? w() : 1 == D ? o(function() {
                    a.show("您已抢到该任务，列表正在刷新"),
                    o(function() {
                        c()
                    }, 1500)
                }, 300) : (o(function() {
                    A = !0
                }, 6e4),
                s.exitForQueue().then(function(t) {
                    o(function() {
                        c()
                    }, 1500)
                }))
            }, 50)
        }
        function y() {
            R.removeClass("md-show"),
            window.removeEventListener("touchmove", b)
        }
        function b(t) {
            t.preventDefault()
        }
        function x(t) {
            l.isIOS9() ? i.go("timed.detailIOS9", {
                taskId: t,
                from: 1
            }) : i.go("timed.detail", {
                taskId: t,
                from: 1
            })
        }
        function T() {
            window.location.replace("../prentice/index.html#/task/list/3")
        }
        var I = "QK_TIMEDTASKLIST"
          , S = 1
          , E = (new Date).getTime()
          , $ = !1;
        window.socket && (socket.disconnect(),
        socket = void 0),
        t.$emit("headerTitleChanged", {
            headerTitle: "限时任务"
        }),
        window.scroll(0, 0),
        n.loaded = !1,
        t.isKeyInvalid = !0;
        var L = !1
          , A = !1
          , C = !1
          , D = 0
          , z = 0;
        window.socket = new e,
        s.getQiankaKeySetting().then(function(e) {
            var i = e.data
              , s = i.websocket_url;
            window.sessionId = i.session_id,
            window.plist = i.plist,
            window.releaseVersion = i.release_version,
            window.localVersion = i.version,
            window.schemeLoginUrl = i.scheme_login_url,
            window.canSupportIOS9 = i.can_support_ios9,
            socket.on("open", function(e) {
                console.log("钥匙已打开"),
                t.isKeyInvalid = !1,
                L = !1,
                $ && ($ = !1,
                f()),
                o(function() {
                    t.$digest()
                })
            }),
            socket.on("close", function(e) {
                var i = 1;
                console.log(i + "秒后重新连接"),
                t.isKeyInvalid = !0,
                L = !0,
                n.loaded = !0,
                o(function() {
                    t.$digest()
                }),
                _.delay(function() {
                    socket.connect(s)
                }, 1e3 * i)
            }),
            socket.on("taskresult", function(t) {
                var e = t.data;
                if (0 == e.code) {
                    var n = e.data.task_info;
                    k({
                        title: "限时任务《" + n.subtitle + "》",
                        price: n.subcurrency,
                        name: "很好，继续赚钱"
                    })
                }
            }),
            socket.connect(s)
        }),
        t.openQiankaKey = function() {
            $ = !0,
            window.location.href = window.schemeLoginUrl
        }
        ,
        t.downloadQiankaKey = function() {
            var t = document.getElementById("modal-upgrade")
              , e = angular.element(t);
            e.removeClass("md-show"),
            window.removeEventListener("touchmove", b),
            l.isIOS9() ? window.location.replace("../authority/#/install") : window.location.href = window.plist
        }
        ,
        t.taskList = [];
        var B, O, K = !1, Q = window.cache.get(I);
        console.log("cache", Q),
        Q && E - Q.time < 3e5 && (console.log("默认渲染"),
        u(Q.data),
        console.log(K)),
        c();
        var q = angular.element(document.getElementById("modal-task-notice"));
        t.applyTask = function(e) {
            return 100 == e.type ? (window.location.href = e.duobao_url,
            !1) : 101 == e.type ? (window.location.href = e.url,
            !1) : 4 == e.type ? (q.addClass("md-show"),
            window.addEventListener("touchmove", b),
            o(function() {
                t.closeNotice()
            }, 2e3),
            !1) : L ? (a.show("钥匙检测中...", 3e3),
            o(function() {
                if (L) {
                    var t = document.getElementById("modal-key-invalid")
                      , n = angular.element(t);
                    n.addClass("md-show"),
                    window.addEventListener("touchmove", b)
                } else
                    m(e)
            }, 3e3),
            !1) : void m(e)
        }
        ;
        var j = angular.element(document.getElementById("modal-alert"));
        t.hideAlert = function() {
            j.removeClass("md-show"),
            window.removeEventListener("touchmove", b),
            1 == t.bindMobileFlag && o(function() {
                window.location.replace("../user/index.html#/main/bind_mobile/3")
            }, 100)
        }
        ,
        t.hideModal = function() {
            f()
        }
        ,
        t.hideAlert2 = function() {
            var t = angular.element(document.getElementById("modal-alert2"));
            t.removeClass("md-show"),
            window.removeEventListener("touchmove", b)
        }
        ,
        t.closeNotice = function() {
            q.removeClass("md-show"),
            window.removeEventListener("touchmove", b)
        }
        ;
        var R = angular.element(document.getElementById("modal-queue"));
        t.exitForQueue = function() {
            w()
        }
    }
    ])
}),
define("controllers/timed.detail", ["task.controllers", "websocket"], function(t, e) {
    console.log("Timed Task Detail Controller Load!"),
    t.controller("TimedTaskDetailCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "$api", "$utils", "$timeout", "$toast", "$location", "$device", function(t, n, i, s, a, o, d, l, r, c) {
        function u(e) {
            a.getTimedTaskDetail(e).then(function(e) {
                n.loaded = !0,
                console.log(e.data);
                var i = e.data;
                if (h = {},
                h.reward = parseFloat(i.reward).toFixed(1),
                h.exclusiveReward = i.exclusive_reward,
                h.exclusiveReward && (h.totalReward = (i.reward + i.exclusive_reward).toFixed(2)),
                h.icon = i.icon,
                h.title = i.title,
                h.appUrl = i.app_url,
                h.appSize = i.app_size,
                h.deadline = i.deadline,
                h.steps = i.steps,
                h.keyword = i.keyword,
                h.exclusiveTasks = i.exclusive_tasks,
                h.bid = i.bid,
                h.status = i.status,
                2 != h.status) {
                    var s = 2e3;
                    if (3 == h.status)
                        d(function() {
                            socket.disconnect(),
                            socket = void 0,
                            g()
                        }, s);
                    else {
                        var a = "请先领取任务";
                        l.show(a, s),
                        d(function() {
                            socket.disconnect(),
                            socket = void 0,
                            g()
                        }, s)
                    }
                }
                t.taskDetail = {},
                _.extend(t.taskDetail, h),
                n.taskTimer = setInterval(function() {
                    var e = t.taskDetail.deadline - (new Date).getTime() / 1e3;
                    if (e > 0) {
                        var n = parseInt(e / 60)
                          , i = ("" + (parseInt(e % 60) + 100)).substr(1);
                        t.deadlineCountDown = "( 剩余时间" + n + ":" + i + " )",
                        d(function() {
                            t.$digest()
                        })
                    } else
                        t.isTaskExpired = !0,
                        t.deadlineCountDown = "-"
                }, 1e3)
            }, function(t) {
                l.error(t),
                d(function() {
                    socket.disconnect(),
                    socket = void 0,
                    g()
                }, 2e3)
            })
        }
        function p() {
            if (c.isQKPro())
                return console.log("isQKPro ..."),
                !1;
            var t = setInterval(function() {
                var e = document.getElementById("keyword");
                if (e) {
                    clearInterval(t);
                    var n = document.getElementById("copyUseImg");
                    n.style.width = e.offsetWidth + "px",
                    n.style.height = e.offsetHeight + "px",
                    n.style.left = (280 - e.offsetWidth) / 2 + "px";
                    var i = document.getElementById("ios9select");
                    i.style.width = e.offsetWidth + "px",
                    i.style.height = e.offsetHeight + "px",
                    i.style.left = (280 - e.offsetWidth) / 2 + "px"
                }
            }, 20)
        }
        function v(e) {
            var n = angular.element(document.getElementById("modal-alert"));
            e || (e = {}),
            t.alert_tip = e.tip || "恭喜！任务完成！",
            t.alert_title = e.title || "",
            t.alert_price = e.price || "",
            t.alert_name = e.name || "很好，继续",
            n.addClass("md-show"),
            window.addEventListener("touchmove", m)
        }
        function g() {
            var t = s.from;
            return 1 == t ? (i.go("timed.listWithQueue"),
            !1) : void i.go("timed.list")
        }
        function m(t) {
            t.preventDefault()
        }
        window.socket && (socket.disconnect(),
        socket = void 0);
        var f = parseInt(s.taskId)
          , k = s.from;
        t.$emit("headerTitleChanged", {
            headerTitle: "限时任务详情",
            taskId: f,
            from: k
        }),
        window.scroll(0, 0);
        var h;
        t.isTaskExpired = !1,
        n.loaded = !1,
        t.isNotQKPro = c.isQKPro() ? !1 : !0,
        t.isKeyInvalid = !1,
        t.rewardTips = "",
        window.socket = new e,
        a.getQiankaKeySetting().then(function(e) {
            var n = e.data
              , i = n.websocket_url;
            window.sessionId = n.session_id,
            window.plist = n.plist,
            window.releaseVersion = n.release_version,
            window.localVersion = n.version,
            window.schemeLoginUrl = n.scheme_login_url,
            socket.on("open", function(e) {
                console.log("钥匙已打开"),
                u(f),
                t.isKeyInvalid = !1,
                d(function() {
                    t.$digest(),
                    p()
                })
            }),
            socket.on("close", function(e) {
                var n = 2;
                console.log(n + "秒后重新连接"),
                t.isKeyInvalid = !0,
                d(function() {
                    t.$digest()
                }),
                _.delay(function() {
                    socket.connect(i)
                }, 1e3 * n)
            }),
            socket.on("login", function() {}),
            socket.on("taskresult", function(t) {
                var e = t.data;
                if (0 == e.code) {
                    var n = e.data.task_info;
                    v({
                        title: "限时任务《" + n.subtitle + "》",
                        price: n.subcurrency,
                        name: "很好，继续赚钱"
                    })
                }
            }),
            socket.connect(i)
        }),
        t.openQiankaKey = function() {
            window.location.href = window.schemeLoginUrl
        }
        ,
        t.downloadQiankaKey = function() {
            window.location.href = window.plist
        }
        ,
        t.searchApp = function() {
            var t = "&return_url=" + encodeURIComponent(r.absUrl());
            window.location.href = h.appUrl + t
        }
        ,
        window.addEventListener("copy", function(e) {
            "copyUseImg" == e.target.id ? t.searchApp() : ("cpoykeywords" == e.target.id || "keyword" == e.target.id) && t.searchApp()
        }),
        t.verify = function() {
            if (t.isTaskExpired)
                return l.show("任务已超时，返回任务列表"),
                d(function() {
                    socket.disconnect(),
                    socket = void 0,
                    g()
                }, 1500),
                !1;
            var e = (new Date).getTime();
            socket.on("taskverify-" + e, function(t) {
                var e = t.data
                  , n = 2e3;
                if (0 == e.code) {
                    var i = e.data.task_info;
                    v({
                        title: "限时任务《" + i.subtitle + "》",
                        price: i.subcurrency,
                        name: "很好，继续赚钱"
                    })
                } else
                    l.show(e.msg, n)
            }),
            socket.taskVerify(sessionId, f, e)
        }
        ,
        t.hideAlert = function() {
            var t = angular.element(document.getElementById("modal-alert"));
            t.removeClass("md-show"),
            window.removeEventListener("touchmove", m)
        }
        ,
        t.goTaskList = function() {
            t.hideAlert(),
            g()
        }
    }
    ])
}),
define("controllers/timed.detail.ios9", ["task.controllers", "websocket"], function(t, e) {
    console.log("Timed Task Detail IOS9 Controller Load!"),
    t.controller("TimedTaskDetailIOS9Ctrl", ["$scope", "$rootScope", "$state", "$stateParams", "$api", "$utils", "$timeout", "$toast", "$location", "$device", function(t, n, i, s, a, o, d, l, r, c) {
        function u(e) {
            a.getTimedTaskDetail(e).then(function(e) {
                n.loaded = !0,
                console.log(e.data);
                var i = e.data;
                if (w = {},
                w.reward = parseFloat(i.reward).toFixed(1),
                w.exclusiveReward = i.exclusive_reward,
                w.exclusiveReward && (w.totalReward = (i.reward + i.exclusive_reward).toFixed(2)),
                w.icon = i.icon,
                w.title = i.title,
                w.appUrl = i.app_url,
                w.appSize = i.app_size,
                w.deadline = i.deadline,
                w.steps = i.steps,
                w.keyword = i.keyword,
                w.exclusiveTasks = i.exclusive_tasks,
                w.bid = i.bid,
                w.status = i.status,
                w.openUrl = i.open_url,
                2 != w.status) {
                    var s = 2e3
                      , a = "请先领取任务";
                    3 != w.status && l.show(a, s),
                    d(function() {
                        socket.disconnect(),
                        socket = void 0,
                        f()
                    }, s)
                }
                t.taskDetail = {},
                _.extend(t.taskDetail, w),
                n.taskTimer = setInterval(function() {
                    var e = t.taskDetail.deadline - (new Date).getTime() / 1e3;
                    if (e > 0) {
                        var n = parseInt(e / 60)
                          , i = ("" + (parseInt(e % 60) + 100)).substr(1);
                        t.deadlineCountDown = "( 剩余时间" + n + ":" + i + " )",
                        d(function() {
                            t.$digest()
                        })
                    } else
                        t.isTaskExpired = !0,
                        t.deadlineCountDown = ""
                }, 1e3),
                t.btnSearchEnabled = !0,
                t.btnVerifyTaskEnabled = !1,
                t.btnStartAppStatus = 0,
                t.btnStartAppText = "开始任务"
            }, function(t) {
                l.error(t),
                d(function() {
                    socket.disconnect(),
                    socket = void 0,
                    f()
                }, 2e3)
            })
        }
        function p() {
            y.removeClass("md-show"),
            window.removeEventListener("touchmove", v)
        }
        function v(t) {
            t.preventDefault()
        }
        function g() {
            if (c.isQKPro())
                return console.log("isQKPro ..."),
                !1;
            var t = setInterval(function() {
                var e = document.getElementById("keyword");
                if (e) {
                    clearInterval(t);
                    var n = document.getElementById("copyUseImg");
                    n.style.width = e.offsetWidth + "px",
                    n.style.height = e.offsetHeight + "px",
                    n.style.left = (280 - e.offsetWidth) / 2 + "px";
                    var i = document.getElementById("ios9select");
                    i.style.width = e.offsetWidth + "px",
                    i.style.height = e.offsetHeight + "px",
                    i.style.left = (280 - e.offsetWidth) / 2 + "px"
                }
            }, 20)
        }
        function m(e) {
            var n = angular.element(document.getElementById("modal-alert2"));
            e || (e = {}),
            t.alert_tip = e.tip || "恭喜！任务完成！",
            t.alert_title = e.title || "",
            t.alert_price = e.price || "",
            t.alert_name = e.name || "很好，继续",
            n.addClass("md-show"),
            window.addEventListener("touchmove", v)
        }
        function f() {
            var t = s.from;
            return 1 == t ? (i.go("timed.listWithQueue"),
            !1) : void i.go("timed.list")
        }
        window.socket && (socket.disconnect(),
        socket = void 0);
        var k = parseInt(s.taskId)
          , h = s.from;
        t.$emit("headerTitleChanged", {
            headerTitle: "限时任务详情",
            taskId: k,
            from: h
        }),
        window.scroll(0, 0);
        var w;
        t.isTaskExpired = !1,
        n.loaded = !1,
        t.isNotQKPro = c.isQKPro() ? !1 : !0,
        t.isKeyInvalid = !1,
        t.rewardTips = "",
        window.socket = new e,
        a.getQiankaKeySetting().then(function(e) {
            var i = e.data
              , s = i.websocket_url;
            window.sessionId = i.session_id,
            window.plist = i.plist,
            window.releaseVersion = i.release_version,
            window.localVersion = i.version,
            window.schemeLoginUrl = i.scheme_login_url,
            socket.on("open", function(e) {
                console.log("钥匙已打开"),
                u(k),
                t.isKeyInvalid = !1,
                d(function() {
                    t.$digest(),
                    g()
                })
            }),
            socket.on("close", function(e) {
                n.loaded = !0;
                var i = 2;
                console.log(i + "秒后重新连接"),
                t.isKeyInvalid = !0,
                d(function() {
                    t.$digest()
                }),
                _.delay(function() {
                    socket.connect(s)
                }, 1e3 * i)
            }),
            socket.on("login", function() {}),
            socket.on("taskresult", function(t) {
                var e = t.data;
                if (0 == e.code) {
                    var n = e.data.task_info;
                    m({
                        title: "限时任务《" + n.subtitle + "》",
                        price: n.subcurrency,
                        name: "很好，继续赚钱"
                    })
                }
            }),
            socket.connect(s)
        }),
        t.openQiankaKey = function() {
            window.location.href = window.schemeLoginUrl
        }
        ,
        t.downloadQiankaKey = function() {
            window.location.href = window.plist
        }
        ,
        t.searchApp = function() {
            p();
            var t = "&return_url=" + encodeURIComponent(r.absUrl());
            window.location.href = w.appUrl + t
        }
        ,
        t.btnSearchApp = function() {
            return p(),
            w.keyword && 1 != t.btnStartAppStatus ? !1 : void t.searchApp()
        }
        ,
        t.verify = function() {
            if (t.isTaskExpired)
                return l.show("任务已超时，返回任务列表"),
                d(function() {
                    socket.disconnect(),
                    socket = void 0,
                    f()
                }, 1500),
                !1;
            var e = (new Date).getTime();
            socket.on("taskverify-" + e, function(t) {
                var e = t.data
                  , n = 2e3;
                if (0 == e.code) {
                    var i = e.data.task_info;
                    m({
                        title: "限时任务《" + i.subtitle + "》",
                        price: i.subcurrency,
                        name: "很好，继续赚钱"
                    })
                } else
                    l.show(e.msg, n)
            }),
            socket.taskVerifyIOS9(sessionId, k, e)
        }
        ,
        t.startApp = function() {
            if (1 != t.btnStartAppStatus)
                return w.keyword && t.showAlert(),
                !1;
            var e = (new Date).getTime()
              , n = w.bid
              , i = w.openUrl;
            socket.on("lppa-" + e, function(e) {
                console.log("lppa", e);
                var s = e.data;
                0 == s.code ? s.data.bid == n ? window.location.href = i : (t.tips = "请先去App Store下载！",
                y.addClass("md-show"),
                window.addEventListener("touchmove", v)) : console.log("lppa 失败")
            }),
            socket.lppa(n, e)
        }
        ;
        var y = angular.element(document.getElementById("modal-alert"));
        t.showAlert = function() {
            y.addClass("md-show"),
            window.addEventListener("touchmove", v)
        }
        ,
        window.addEventListener("copy", function(e) {
            "copyUseImg" == e.target.id ? t.searchApp() : ("cpoykeywords" == e.target.id || "keyword" == e.target.id) && t.searchApp()
        }),
        t.hideAlert2 = function() {
            var t = angular.element(document.getElementById("modal-alert2"));
            t.removeClass("md-show"),
            window.removeEventListener("touchmove", v)
        }
        ,
        t.goTaskList = function() {
            t.hideAlert2(),
            f()
        }
    }
    ])
}),
define("controllers/exclusive", ["task.controllers", "websocket"], function(t, e) {
    console.log("Exclusive Task List Controller Load!"),
    t.controller("ExclusiveTaskListCtrl", ["$scope", "$rootScope", "$state", "$api", "$toast", "$device", function(t, e, n, i, s, a) {
        function o() {
            i.getExclusiveTaskList().then(function(n) {
                e.loaded = !0;
                var i = []
                  , s = n.data;
                _.each(s, function(t, e) {
                    var n = {
                        title: e
                    };
                    _.each(t, function(t) {
                        3 == t.status && (d = !0);
                        var e = t.appName;
                        e.length > 11 && (t.appName = e.substr(0, 10) + "..");
                        var n = t.desc;
                        n.length > 11 && (t.desc = n.substr(0, 10) + "..")
                    }),
                    n.list = t,
                    i.push(n)
                }),
                t.taskLists = i
            }, function(t) {
                s.error(t)
            })
        }
        t.$emit("headerTitleChanged", {
            headerTitle: "专属任务"
        }),
        window.scroll(0, 0),
        e.loaded = !1,
        o(),
        t.taskLists = [];
        var d = !1;
        t.goTaskDetail = function(t) {
            if (2 == t.status)
                return !1;
            var e = t.zstaskId;
            a.isIOS9() ? n.go("exclusive.detailIOS9", {
                taskId: e
            }) : n.go("exclusive.detail", {
                taskId: e
            })
        }
    }
    ])
}),
define("controllers/exclusive.detail", ["task.controllers", "websocket"], function(t, e) {
    console.log("Exclusive Task Detail Controller Load!"),
    t.controller("ExclusiveTaskDetailCtrl", ["$scope", "$rootScope", "$state", "$stateParams", "$api", "$utils", "$timeout", "$toast", "$q", "$location", "$device", function(t, n, i, s, a, o, d, l, r, c, u) {
        function p(e) {
            a.getExclusiveTaskDetail(e).then(function(e) {
                var i = e.data
                  , s = i.info;
                return t.currentTask = s,
                console.log("专属任务状态：" + s.status),
                2 == s.status ? (d(function() {
                    console.log("跳转到专属任务列表"),
                    window.location.href = "../task/#/exclusive/list"
                }, 1e3),
                !1) : (n.loaded = !0,
                3 == s.status && f(),
                t.tasks = i.tasks,
                b.tid = s.zstaskId,
                b.time = s.open_time,
                b.bid = s.bid,
                b.scheme = s.schema,
                b.prog = s.prog,
                b.adname = s.zsname,
                x = s.bid,
                I = s.url,
                S = s.assist_scheme,
                void (E = s.has_task_ongoing))
            }, function(t) {
                console.log(t)
            })
        }
        function v(t) {
            var e = (new Date).getTime();
            socket.on("lppa-" + e, function(e) {
                console.log("lppa", e);
                var n = e.data;
                T = n.data.bid,
                0 == n.code ? (g(t),
                m()) : l.show(n.msg)
            }),
            socket.lppa(t.bid, e)
        }
        function g(e) {
            a.applyForExclusiveTask(e.zstaskId).then(function(t) {
                if (console.log(200 == t.code),
                f(),
                T == x)
                    S && (window.location.href = S);
                else {
                    var e = "&return_url=" + encodeURIComponent(c.absUrl());
                    I && (window.location.href = I + e)
                }
            }, function(n) {
                if (5001 == n.code)
                    k(n.message);
                else if (_.indexOf([5002, 5003, 5004, 5005], n.code) > -1) {
                    t.failReason = n.message,
                    t.appliedTaskIcon = e.icon;
                    var i = document.getElementById("modal-no-quota")
                      , s = angular.element(i);
                    s.addClass("md-show"),
                    d(function() {
                        s.removeClass("md-show")
                    }, 1500)
                } else
                    l.error(n)
            })
        }
        function m() {
            var t = (new Date).getTime();
            socket.on("zstaskstarted-" + t, function(t) {
                var e = t.data;
                
                0 == e.code || l.show(e.msg)
            }),
            socket.zsTaskStarted(sessionId, y, b, t)
        }
        function f() {
            t.currentTaskOnGoing = !0,
            t.$emit("zsTaskStarted")
        }
        function k(e) {
            t.tips = e,
            $.addClass("md-show"),
            window.addEventListener("touchmove", h)
        }
        function h(t) {
            t.preventDefault()
        }
        function w(e) {
            var n = angular.element(document.getElementById("modal-alert2"));
            e || (e = {}),
            t.alert_tip = e.tip || "恭喜！任务完成！",
            t.alert_title = e.title || "",
            t.alert_price = e.price || "",
            t.alert_name = e.name || "很好，继续",
            d(function() {
                t.$digest(),
                n.addClass("md-show"),
                window.addEventListener("touchmove", h)
            })
        }
        window.socket && (socket.disconnect(),
        socket = void 0);
        var y = parseInt(s.taskId);
        t.$emit("headerTitleChanged", {
            headerTitle: "专属任务详情",
            taskId: y
        }),
        n.loaded = !1,
        t.isKeyInvalid = !1,
        window.socket = new e,
        a.getQiankaKeySetting().then(function(e) {
            var i = e.data
              , s = i.websocket_url;
            window.sessionId = i.session_id,
            console.log("session id => " + sessionId),
            window.plist = i.plist,
            window.releaseVersion = i.release_version,
            window.localVersion = i.version,
            window.schemeLoginUrl = i.scheme_login_url,
            socket.on("open", function(e) {
                p(y),
                t.isKeyInvalid = !1,
                d(function() {
                    t.$digest()
                })
            }),
            socket.on("close", function(e) {
                var i = 1;
                console.log(i + "秒后重新连接"),
                t.isKeyInvalid = !0,
                n.loaded = !0,
                d(function() {
                    t.$digest()
                }),
                _.delay(function() {
                    socket.connect(s)
                }, 1e3 * i)
            }),
            socket.on("login", function() {}),
            socket.on("zstaskverify", function(t) {
                var e = t.data;
                if (0 == e.code) {
                    var n = e.data;
                    w({
                        title: "专属任务" + (n && n.adname ? "《" + n.adname + "》" : ""),
                        name: "很好，继续赚钱"
                    })
                } else
                    l.show(e.msg)
            }),
            socket.connect(s)
        }),
        t.openQiankaKey = function() {
            window.location.href = window.schemeLoginUrl
        }
        ,
        t.downloadQiankaKey = function() {
            window.location.href = window.plist
        }
        ;
        var b = {}
          , x = ""
          , T = ""
          , I = ""
          , S = ""
          , E = !1;
        t.currentTaskOnGoing = !1,
        t.startZsTask = function(e) {
            if (t.currentTaskOnGoing)
                return !1;
            if (E) {
                var n = angular.element(document.getElementById("modal-confirm"))
                  , i = r.defer()
                  , s = i.promise;
                n.addClass("md-show"),
                window.addEventListener("touchmove", h),
                t.dismiss = function(t) {
                    i.resolve(t),
                    window.removeEventListener("touchmove", h)
                }
                ,
                s.then(function(t) {
                    t && v(e),
                    n.removeClass("md-show")
                })
            } else
                v(e)
        }
        ,
        t.verify = function() {
            if (!t.currentTaskOnGoing)
                return !1;
            var e = (new Date).getTime();
            socket.on("zstaskverify-" + e, function(t) {
                console.log(t);
                var e = t.data;
                0 == e.code ? w({
                    title: "专属任务" + (b.adname ? "《" + b.adname + "》" : ""),
                    name: "很好，继续赚钱"
                }) : l.show(e.msg)
            }),
            u.isIOS9() ? socket.zsTaskVerifyIOS9(sessionId, y, b, e) : socket.zsTaskVerify(sessionId, y, b, e)
        }
        ;
        var $ = angular.element(document.getElementById("modal-alert"));
        t.hideAlert = function() {
            $.removeClass("md-show"),
            window.removeEventListener("touchmove", h)
        }
        ,
        t.hideAlert2 = function() {
            var t = angular.element(document.getElementById("modal-alert2"));
            t.removeClass("md-show"),
            window.removeEventListener("touchmove", h)
        }
        ,
        t.goZSTaskList = function() {
            t.hideAlert2(),
            i.go("exclusive.list")
        }
    }
    ])
}),
define("controllers/exclusive.detail.ios9", ["task.controllers", "websocket"], function(t, e) {
    console.log("Exclusive Task Detail Controller Load!"),
    t.controller("ExclusiveTaskDetailIOS9Ctrl", ["$scope", "$rootScope", "$state", "$stateParams", "$api", "$utils", "$timeout", "$toast", "$q", "$location", "$device", function(t, n, i, s, a, o, d, l, r, c, u) {
        function p(e) {
            a.getExclusiveTaskDetail(e).then(function(e) {
                function i(e) {
                    console.log("轮询钥匙：确认应用是否安装"),
                    d(function() {
                        var n = (new Date).getTime();
                        socket.on("lppa-" + n, function(n) {
                            console.log("lppa", n);
                            var s = n.data;
                            0 == s.code ? s.data.bid == e ? (t.btnStartAppStatus = 1,
                            d(function() {
                                t.$digest()
                            })) : i(e) : console.log("lppa 失败")
                        }),
                        socket.lppa(e, n)
                    }, 1e3)
                }
                var s = e.data
                  , a = s.info;
                return t.currentTask = a,
                console.log("专属任务状态：" + a.status),
                2 == a.status ? (d(function() {
                    console.log("跳转到专属任务列表"),
                    window.location.href = "../task/#/exclusive/list"
                }, 1e3),
                !1) : (n.loaded = !0,
                3 == a.status && f(),
                t.tasks = s.tasks,
                x.tid = a.zstaskId,
                x.time = a.open_time,
                x.bid = a.bid,
                x.scheme = a.schema,
                x.prog = a.prog,
                x.adname = a.zsname,
                T = a.bid,
                S = a.url,
                E = a.assist_scheme,
                $ = a.has_task_ongoing,
                void i(T))
            }, function(t) {
                console.log(t)
            })
        }
        function v(t) {
            var e = (new Date).getTime();
            socket.on("lppa-" + e, function(e) {
                console.log("lppa", e);
                var n = e.data;
                I = n.data.bid,
                0 == n.code ? (g(t),
                m()) : l.show(n.msg)
            }),
            socket.lppa(t.bid, e)
        }
        function g(e) {
            a.applyForExclusiveTask(e.zstaskId).then(function(t) {
                if (console.log(200 == t.code),
                f(),
                I == T)
                    E && (window.location.href = E);
                else {
                    var e = "&return_url=" + encodeURIComponent(c.absUrl());
                    S && (window.location.href = S + e)
                }
            }, function(n) {
                if (5001 == n.code)
                    k(n.message);
                else if (_.indexOf([5002, 5003, 5004, 5005], n.code) > -1) {
                    t.failReason = n.message,
                    t.appliedTaskIcon = e.icon;
                    var i = document.getElementById("modal-no-quota")
                      , s = angular.element(i);
                    s.addClass("md-show"),
                    d(function() {
                        s.removeClass("md-show")
                    }, 1500)
                } else
                    l.error(n)
            })
        }
        function m() {
            var t = (new Date).getTime();
            socket.on("zstaskstarted-" + t, function(t) {
                var e = t.data;
                0 == e.code || l.show(e.msg)
            }),
            socket.zsTaskStarted(sessionId, b, x, t)
        }
        function f() {
            t.currentTaskOnGoing = !0,
            t.$emit("zsTaskStarted")
        }
        function k(e) {
            t.tips = e,
            L.addClass("md-show"),
            window.addEventListener("touchmove", h)
        }
        function h(t) {
            t.preventDefault()
        }
        function w() {
            A.removeClass("md-show"),
            window.removeEventListener("touchmove", h)
        }
        function y(e) {
            var n = angular.element(document.getElementById("modal-alert2"));
            e || (e = {}),
            t.alert_tip = e.tip || "恭喜！任务完成！",
            t.alert_title = e.title || "",
            t.alert_price = e.price || "",
            t.alert_name = e.name || "很好，继续",
            d(function() {
                t.$digest(),
                n.addClass("md-show"),
                window.addEventListener("touchmove", h)
            })
        }
        window.socket && (socket.disconnect(),
        socket = void 0);
        var b = parseInt(s.taskId);
        t.$emit("headerTitleChanged", {
            headerTitle: "专属任务详情",
            taskId: b
        }),
        n.loaded = !1,
        t.isKeyInvalid = !1,
        window.socket = new e,
        a.getQiankaKeySetting().then(function(e) {
            var i = e.data
              , s = i.websocket_url;
            window.sessionId = i.session_id,
            console.log("session id => " + sessionId),
            window.plist = i.plist,
            window.releaseVersion = i.release_version,
            window.localVersion = i.version,
            window.schemeLoginUrl = i.scheme_login_url,
            socket.on("open", function(e) {
                p(b),
                t.isKeyInvalid = !1,
                d(function() {
                    t.$digest()
                })
            }),
            socket.on("close", function(e) {
                var i = 1;
                console.log(i + "秒后重新连接"),
                t.isKeyInvalid = !0,
                n.loaded = !0,
                d(function() {
                    t.$digest()
                }),
                _.delay(function() {
                    socket.connect(s)
                }, 1e3 * i)
            }),
            socket.on("login", function() {}),
            socket.on("zstaskverify", function(t) {
                var e = t.data;
                if (0 == e.code) {
                    var n = e.data;
                    y({
                        title: "专属任务" + (n && n.adname ? "《" + n.adname + "》" : ""),
                        name: "很好，继续赚钱"
                    })
                } else
                    l.show(e.msg)
            }),
            socket.connect(s)
        }),
        t.openQiankaKey = function() {
            window.location.href = window.schemeLoginUrl
        }
        ,
        t.downloadQiankaKey = function() {
            window.location.href = window.plist
        }
        ;
        var x = {}
          , T = ""
          , I = ""
          , S = ""
          , E = ""
          , $ = !1;
        t.currentTaskOnGoing = !1,
        t.btnStartAppStatus = 0,
        t.startZsTask = function(e) {
            if (t.currentTaskOnGoing)
                return !1;
            if (1 != t.btnStartAppStatus)
                return t.showAlertStart(),
                !1;
            if ($) {
                var n = angular.element(document.getElementById("modal-confirm"))
                  , i = r.defer()
                  , s = i.promise;
                n.addClass("md-show"),
                window.addEventListener("touchmove", h),
                t.dismiss = function(t) {
                    i.resolve(t),
                    window.removeEventListener("touchmove", h)
                }
                ,
                s.then(function(t) {
                    t && v(e),
                    n.removeClass("md-show")
                })
            } else
                v(e)
        }
        ,
        t.verify = function() {
            if (!t.currentTaskOnGoing)
                return !1;
            var e = (new Date).getTime();
            socket.on("zstaskverify-" + e, function(t) {
                console.log(t);
                var e = t.data;
                0 == e.code ? y({
                    title: "专属任务" + (x.adname ? "《" + x.adname + "》" : ""),
                    name: "很好，继续赚钱"
                }) : l.show(e.msg)
            }),
            u.isIOS9() ? socket.zsTaskVerifyIOS9(sessionId, b, x, e) : socket.zsTaskVerify(sessionId, b, x, e)
        }
        ,
        t.downloadApp = function() {
            w();
            var t = "&return_url=" + encodeURIComponent(c.absUrl());
            S && (window.location.href = S + t)
        }
        ;
        var L = angular.element(document.getElementById("modal-alert"));
        t.hideAlert = function() {
            L.removeClass("md-show"),
            window.removeEventListener("touchmove", h)
        }
        ;
        var A = angular.element(document.getElementById("modal-alert-start"));
        t.showAlertStart = function() {
            A.addClass("md-show"),
            window.addEventListener("touchmove", h)
        }
        ,
        t.hideAlert2 = function() {
            var t = angular.element(document.getElementById("modal-alert2"));
            t.removeClass("md-show"),
            window.removeEventListener("touchmove", h)
        }
        ,
        t.goZSTaskList = function() {
            t.hideAlert2(),
            i.go("exclusive.list")
        }
    }
    ])
}),
define("task", ["websocket", "clone", "render/templates", "controllers/main", "controllers/timed", "controllers/timed.queue", "controllers/timed.detail", "controllers/timed.detail.ios9", "controllers/exclusive", "controllers/exclusive.detail", "controllers/exclusive.detail.ios9"], function() {
    console.log("Qianka Task Load!");
    var t = angular.module("qianka.task", ["task.controllers", "task.services", "common.services"]);
    return t.config(["$urlRouterProvider", "$stateProvider", "$locationProvider", function(t, e, n) {
        t.otherwise("/timed/list"),
        e.state("timed", {
            "abstract": !0,
            url: "/timed",
            template: JST.main,
            controller: "MainCtrl"
        }).state("timed.list", {
            url: "/list",
            template: JST.timed_list,
            controller: "TimedTaskListCtrl"
        }).state("timed.listWithQueue", {
            url: "/list_with_queue",
            template: JST.timed_list_with_queue,
            controller: "TimedTaskListWithQueueCtrl"
        }).state("timed.detail", {
            url: "/detail/{taskId}/{from}",
            template: JST.timed_detail,
            controller: "TimedTaskDetailCtrl"
        }).state("timed.detailIOS9", {
            url: "/detail_ios9/{taskId}/{from}",
            template: JST.timed_detail_ios9,
            controller: "TimedTaskDetailIOS9Ctrl"
        }).state("exclusive", {
            "abstract": !0,
            url: "/exclusive",
            template: JST.main,
            controller: "MainCtrl"
        }).state("exclusive.list", {
            url: "/list",
            template: JST.exclusive_list,
            controller: "ExclusiveTaskListCtrl"
        }).state("exclusive.detail", {
            url: "/detail/{taskId}",
            template: JST.exclusive_detail,
            controller: "ExclusiveTaskDetailCtrl"
        }).state("exclusive.detailIOS9", {
            url: "/detail_ios9/{taskId}",
            template: JST.exclusive_detail_ios9,
            controller: "ExclusiveTaskDetailIOS9Ctrl"
        }).state("alliance", {
            "abstract": !0,
            url: "/alliance",
            template: JST.main
        }).state("alliance.list", {
            url: "/alliance/list",
            template: JST.alliance_list
        }).state("alliance.detail", {
            url: "/alliance/detail",
            template: JST.alliance_detail
        }),
        n.html5Mode(!0)
    }
    ]),
    t.run(["$rootScope", "$state", function(t, e) {
        t.loaded = !0,
        console.log("Qianka Task Module Start!")
    }
    ]),
    t
});
var libBase = "../../lib/"
  , commonBase = "../../common/js/"
  , libPaths = {
    underscore: libBase + "underscore-min",
    angular: libBase + "angular.min",
    "angular-animate": libBase + "angular-animate.min",
    "angular-sanitize": libBase + "angular-sanitize.min",
    "angular-touch": libBase + "angular-touch.min",
    "ui-router": libBase + "angular-ui-router.min",
    base: libBase + "base",
    "storage-factory": commonBase + "storage.factory",
    utils: commonBase + "utils",
    toast: commonBase + "toast",
    device: commonBase + "device",
    dialog: commonBase + "dialog",
    "base.api": commonBase + "base.api",
    "common-services": commonBase + "commons",
    "event.target": commonBase + "event.target",
    websocket: commonBase + "websocket",
    clone: commonBase + "clone"
}
  , styleSheets = ["css!" + libBase + "bootstrap-qianka/css/bootstrap.min.css", "css!" + libBase + "animate.min.css", "css!" + libBase + "fa/css/font-awesome.min.css", "css!../css/task-20151231175315.min.css"];
require.config({
    paths: libPaths,
    map: {
        "*": {
            css: "../lib/require-css.js"
        }
    },
    shim: {
        underscore: {
            deps: styleSheets,
            exports: "_"
        },
        angular: {
            exports: "angular"
        },
        "angular-animate": {
            deps: ["angular"],
            exports: "angular-animate"
        },
        "angular-sanitize": {
            deps: ["angular"],
            exports: "angular-sanitize"
        },
        "angular-touch": {
            deps: ["angular"],
            exports: "angular-touch"
        },
        "ui-router": {
            deps: ["angular"],
            exports: "ui-router"
        },
        "common-services": {
            deps: ["angular-animate", "angular-sanitize", "angular-touch", "ui-router"],
            exports: "common-services"
        },
        task: {
            deps: ["common-services"],
            exports: "task"
        }
    }
}),
require(["underscore", "task", "angular", "angular-animate", "angular-sanitize", "angular-touch", "ui-router"], function(t, e, n) {
    n.bootstrap(window.document, ["qianka.task"])
}),
define("main", function() {});
