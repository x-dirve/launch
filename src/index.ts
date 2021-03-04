import { isFunction, isString, isUndefined, labelReplace } from "@x-drive/utils";
const ComponentName = "x-launch";

// @ts-ignore
function noop(e) { }

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
.X-launch-slot {
    z-index:0;
    position:relative;
}
.X-launch-btn {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    position: absolute;
}
</style>
<div class="X-launch">
    <div class="X-launch-btn">
        <${type} id="X_LAUNCH_COM_{id}" style="width:100%;height:100%;display:block;" username="{username}" path="{path}">
        <template>
            <div style="{style}"></div>
        </template>
        </${type}>
    </div>
    <div class="X-launch-slot">
        <slot></slot>
    </div>
</div>`;
    return TPLCache[type];
}

var CID = 0;

/**H5 拉起小程序 */
class XWechatLaunchWeapp extends HTMLElement {
    constructor() {
        super();
        this.init();
    }

    /**模块自增 id */
    private xid = ++CID;

    /**是否处于调试模式 */
    private isDebug = false;

    /**模块名称 */
    name: string = "x-launch-weapp";

    /**模块根结点 */
    private root: ShadowRoot;

    /**平台开放标签对象 */
    private openNode: Element;

    /**模块初始化状态 */
    private status = false;

    /**初始化 */
    private init() {
        if (this.status) {
            return;
        }
        this.root = this.attachShadow({
            "mode": "open"
        });
        this.status = true;
    }

    /**
     * 触发一个事件
     * @param type   事件类型
     * @param detail 事件数据
     */
    private bubbling(type: string, detail: any) {
        this.dispatchEvent(
            new CustomEvent(
                type
                , {
                    "bubbles": true
                    , "composed": true
                    , detail
                }
            )
        );
    }

    /**平台开放标签触发响应函数 */
    private onLaunch = (e) => {
        this.bubbling("launch", e.detail);
    }

    /**平台开放标签错误响应函数 */
    private onError = (err) => {
        this.bubbling("error", err);
    }

    /**平台开放标签准备完成 */
    private onReady = () => {
        this.bubbling("ready", true);
    }

    /**模块节点加载 */
    connectedCallback() {
        const type = this.getAttribute("type");
        const path = this.getAttribute("path") || "";
        const username = this.getAttribute("username") || "";
        this.isDebug = this.hasAttribute("debug");

        const { width, height } = this.getBoundingClientRect();
        const style = `width:${width}px;height:${height}px;display:block;${this.isDebug ? "background:#e92a2a54;" : ""}`;

        this.root.innerHTML = labelReplace(
            getTplStr(type)
            , {
                username
                , path
                , style
                , "id": this.xid
            }
        );

        this.openNode = this.querySelector(`#X_LAUNCH_COM_${this.xid}`);

        if (this.openNode) {
            this.openNode.addEventListener("launch", this.onLaunch);
            this.openNode.addEventListener("error", this.onError);
            this.openNode.addEventListener("ready", this.onReady);
        }
    }

    /**模块节点卸载 */
    disconnectedCallback() {
        if (this.openNode) {
            this.openNode.removeEventListener("launch", this.onLaunch);
            this.openNode.removeEventListener("error", this.onError);
            this.openNode.removeEventListener("ready", this.onReady);
            this.openNode = null;
        }
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
        if (isString(frame.name) && frame.name.toLowerCase() === "vue" && isFunction(frame.component)) {
            frame.component(ComponentName);
        }
    }
}

export default install;