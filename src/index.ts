import { isFunction, isUndefined, labelReplace } from "@x-drive/utils";
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
function getTplStr(type: string = "wechat") {
    if (TPLCache[type]) {
        return TPLCache[type];
    }
    TPLCache[type] = getTypeTpl`<style>
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
        this.init();
    }

    /**模块名称 */
    name: string = "x-launch-weapp";

    /**模块根结点 */
    root: ShadowRoot;

    /**模块初始化状态 */
    private status = false;

    private init() {
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

        const { width, height } = this.getBoundingClientRect();
        const style = `width:${width}px;height:${height}px;display:block;background:#e92a2a54;`;

        this.root.innerHTML = labelReplace(
            getTplStr(type)
            , {
                username
                , path
                , style
            }
        );
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