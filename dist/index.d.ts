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
declare function install(frame: any): void;
export default install;
