'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * 数据类型判断
 * @param  subject 待判断的数据
 * @param  type    数据类型名字
 * @return         判断结果
 */
function is(subject, type) {
    return Object.prototype.toString.call(subject).substr(8, type.length).toLowerCase() === type;
}

/**
 * 是否是数组
 * @param  subject 待判断的数据
 */
function isObject(subject) {
    return is(subject, "object");
}

/**
 * 是否 undefined
 * @param  subject 待判断的数据
 */
function isUndefined(subject) {
    return is(subject, "undefined");
}

/**
 * 带花括号标签检测正则
 * @type {RegExp}
 */
var labelReplaceExp = /\{(\w+)\}/g;
/**
 * 批量替换字符串中带花括号标签为指定数据
 * @param  tpl  待处理的字符串
 * @param  data 替换数据
 * @param  keep 是否保留未能解析的标签
 * @return      替换后端字符串
 * @example
 * ```tsx
 * labelReplace('{a}/{b}/c', {a: 1, b: 2}) // 1/2/c
 * labelReplace('{a}/{b}/c', {a: 1}, true) // 1/{b}/c
 * ```
 */
function labelReplace(tpl, data, keep) {
    if ( keep === void 0 ) { keep = false; }

    return tpl.replace(labelReplaceExp, function (_, key) {
        var re = isObject(data) ? data[key] : data;
        if (isUndefined(re) && keep) {
            return _;
        }
        return re;
    });
}

/**
 * 是否是函数
 * @param  subject 待判断的数据
 */
function isFunction(subject) {
    return is(subject, "function");
}

/**
 * 是否是字符串
 * @param  subject 待判断的数据
 */
function isString(subject) {
    return is(subject, "string");
}

var templateObject = Object.freeze(["<style>\n:host {\n    margin: 0;\n    padding: 0;\n    position: relative;\n    display:inline-block;\n}\n.X-wechat-launch-weapp-slot {\n    z-index:0;\n    position:relative;\n}\n.X-wechat-launch-weapp-btn {\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    z-index: 3;\n    position: absolute;\n}\n</style>\n<div class=\"X-wechat-launch-weapp\">\n    <div class=\"X-wechat-launch-weapp-btn\">\n        <", " id=\"COM_{id}\" style=\"width:100%;height:100%;display:block;\" username=\"{username}\" path=\"{path}\">\n        <template>\n            <div style=\"{style}\"></div>\n        </template>\n        </", ">\n    </div>\n    <div class=\"X-wechat-launch-weapp-slot\">\n        <slot></slot>\n    </div>\n</div>"]);
var ComponentName = "x-launch-weapp";
/**支持的平台对应的标签 */
var LaunchType = {
    /**微信 */
    "wechat": "wx-open-launch-weapp"
};
/**模版缓存 */
var TPLCache = {};
/**
 * 模版处理函数
 * @param strs 模版静态字符串段落数组
 * @param rest 模版插值数组
 */
function getTypeTpl(strs) {
    var rest = [], len = arguments.length - 1;
    while ( len-- > 0 ) rest[ len ] = arguments[ len + 1 ];

    return strs.reduce(function (tpl, str, index) {
        tpl += str;
        switch (rest[index]) {
            case "wechat":
                tpl += LaunchType.wechat;
                break;
        }
        return tpl;
    }, "");
}
/**
 * 获取目标平台的模版
 * @param type 模版类型
 */
function getTplStr(type) {
    if ( type === void 0 ) type = "wechat";

    if (TPLCache[type]) {
        return TPLCache[type];
    }
    TPLCache[type] = getTypeTpl(templateObject, type, type);
    return TPLCache[type];
}
var CID = 0;
/**H5 拉起小程序 */
var XWechatLaunchWeapp = /*@__PURE__*/(function (HTMLElement) {
    function XWechatLaunchWeapp() {
        var this$1 = this;

        HTMLElement.call(this);
        /**模块自增 id */
        this.xid = ++CID;
        /**是否处于调试模式 */
        this.isDebug = false;
        /**模块名称 */
        this.name = "x-launch-weapp";
        /**模块初始化状态 */
        this.status = false;
        /**平台开放标签触发响应函数 */
        this.onLaunch = function (e) {
            this$1.bubbling("launch", e.detail);
        };
        /**平台开放标签错误响应函数 */
        this.onError = function (err) {
            this$1.bubbling("error", err);
        };
        /**平台开放标签准备完成 */
        this.onReady = function () {
            this$1.bubbling("ready", true);
        };
        this.init();
    }

    if ( HTMLElement ) XWechatLaunchWeapp.__proto__ = HTMLElement;
    XWechatLaunchWeapp.prototype = Object.create( HTMLElement && HTMLElement.prototype );
    XWechatLaunchWeapp.prototype.constructor = XWechatLaunchWeapp;
    /**初始化 */
    XWechatLaunchWeapp.prototype.init = function init () {
        if (this.status) {
            return;
        }
        this.root = this.attachShadow({
            "mode": "open"
        });
        this.status = true;
    };
    /**
     * 触发一个事件
     * @param type   事件类型
     * @param detail 事件数据
     */
    XWechatLaunchWeapp.prototype.bubbling = function bubbling (type, detail) {
        this.dispatchEvent(new CustomEvent(type, {
            "bubbles": true,
            "composed": true,
            detail: detail
        }));
    };
    /**模块节点加载 */
    XWechatLaunchWeapp.prototype.connectedCallback = function connectedCallback () {
        var type = this.getAttribute("type");
        var path = this.getAttribute("path") || "";
        var username = this.getAttribute("username") || "";
        this.isDebug = this.hasAttribute("debug");
        var ref = this.getBoundingClientRect();
        var width = ref.width;
        var height = ref.height;
        var style = "width:" + width + "px;height:" + height + "px;display:block;" + (this.isDebug ? "background:#e92a2a54;" : "");
        this.root.innerHTML = labelReplace(getTplStr(type), {
            username: username,
            path: path,
            style: style,
            "id": this.xid
        });
        this.openNode = this.querySelector(("#COM_" + (this.xid)));
        if (this.openNode) {
            this.openNode.addEventListener("launch", this.onLaunch);
            this.openNode.addEventListener("error", this.onError);
            this.openNode.addEventListener("ready", this.onReady);
        }
    };
    /**模块节点卸载 */
    XWechatLaunchWeapp.prototype.disconnectedCallback = function disconnectedCallback () {
        if (this.openNode) {
            this.openNode.removeEventListener("launch", this.onLaunch);
            this.openNode.removeEventListener("error", this.onError);
            this.openNode.removeEventListener("ready", this.onReady);
            this.openNode = null;
        }
    };

    return XWechatLaunchWeapp;
}(HTMLElement));
customElements.define(ComponentName, XWechatLaunchWeapp);
/**
 * 提供给外部框架挂载用的方法
 * @param frame 框架对象
 * @example
 * ```ts
 * import Vue from "vue";
 * import launchWeapp from "[at]x-drive/x-launch-weapp;
 * Vue.use(launchWeapp);
 * ```
 */
function install(frame) {
    if (!isUndefined(frame)) {
        if (isString(frame.name) && frame.name.toLowerCase() === "vue" && isFunction(frame.component)) {
            frame.component(ComponentName);
        }
    }
}

exports.default = install;
//# sourceMappingURL=index.js.map
