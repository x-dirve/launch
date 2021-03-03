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
    if ( keep === void 0 ) keep = false;

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

const ComponentName = "x-launch-weapp";
/**支持的平台对应的标签 */
const LaunchType = {
    /**微信 */
    "wechat": "wx-open-launch-weapp"
};
/**模版缓存 */
const TPLCache = {};
/**
 * 模版处理函数
 * @param strs 模版静态字符串段落数组
 * @param rest 模版插值数组
 */
function getTypeTpl(strs, ...rest) {
    return strs.reduce((tpl, str, index) => {
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
function getTplStr(type = "wechat") {
    if (TPLCache[type]) {
        return TPLCache[type];
    }
    TPLCache[type] = getTypeTpl `<style>
:host {
    margin: 0;
    padding: 0;
    position: relative;
    display:inline-block;
}
.X-wechat-launch-weapp-slot {
    z-index:0;
    position:relative;
}
.X-wechat-launch-weapp-btn {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    position: absolute;
}
</style>
<div class="X-wechat-launch-weapp">
    <div class="X-wechat-launch-weapp-btn">
        <${type} style="width:100%;height:100%;display:block;" username="{username}" path="{path}">
        <template>
            <div style="{style}"></div>
        </template>
        </${type}>
    </div>
    <div class="X-wechat-launch-weapp-slot">
        <slot></slot>
    </div>
</div>`;
    return TPLCache[type];
}
/**H5 拉起小程序 */
class XWechatLaunchWeapp extends HTMLElement {
    constructor() {
        super();
        /**模块名称 */
        this.name = "x-launch-weapp";
        /**模块初始化状态 */
        this.status = false;
        this.init();
    }
    init() {
        if (this.status) {
            return;
        }
        this.root = this.attachShadow({
            "mode": "open"
        });
        this.status = true;
    }
    connectedCallback() {
        const type = this.getAttribute("type");
        const path = this.getAttribute("path") || "";
        const username = this.getAttribute("username") || "";
        const debug = this.hasAttribute("debug");
        const { width, height } = this.getBoundingClientRect();
        const style = `width:${width}px;height:${height}px;display:block;${debug ? "background:#e92a2a54;" : ""}`;
        this.root.innerHTML = labelReplace(getTplStr(type), {
            username,
            path,
            style
        });
    }
}
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
        if (isFunction(frame.component)) {
            frame.component(ComponentName);
        }
    }
}

export default install;
//# sourceMappingURL=index.esm.js.map
