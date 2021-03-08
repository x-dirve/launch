declare global {
    interface Window {
        wx: any;
    }
}
/**H5 唤起模块 */
declare class XLaunch extends HTMLElement {
    constructor();
    /**模块自增 id */
    private xid;
    /**是否处于调试模式 */
    private isDebug;
    /**模块名称 */
    name: string;
    /**模块根结点 */
    private root;
    /**平台开放标签对象 */
    private openNode;
    /**模块初始化状态 */
    private status;
    /**初始化 */
    private init;
    /**
     * 触发一个事件
     * @param type   事件类型
     * @param detail 事件数据
     */
    private bubbling;
    /**平台开放标签触发响应函数 */
    private onLaunch;
    /**平台开放标签错误响应函数 */
    private onError;
    /**平台开放标签准备完成 */
    private onReady;
    /**模块节点加载 */
    connectedCallback(): void;
    /**模块节点卸载 */
    disconnectedCallback(): void;
}
export { XLaunch };
/**
 * 获取类型名称对应的开放标签名称
 * @param type 开放标签名称
 * @returns    开放标签名称，获取不到时会被过滤
 */
declare function getOpenTagName(...types: Array<"wechat" | "wechatapp">): string[];
export { getOpenTagName };
/**
 * 提供给外部框架挂载用的方法
 * @param frame 框架对象
 * @example
 * ```ts
 * import xLaunch from "[at]x-drive/x-launch";
 * import Vue from "vue";
 * Vue.use(xLaunch);
 * ```
 */
declare function install(frame: any): void;
export default install;
