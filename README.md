公众号中拉起平台小程序
================================

封装了 html 页面中拉起平台小程序的开放标签的 web component 模块。

### 已支持平台
- 微信

## 使用

- 直接使用
    1. 引入模块
        ```ts
        import xLaunch from "@x-drive/x-launch";
        ```
    1. 在 `html` 上使用
        ```html
        <x-launch
            type="wechat"
            path="/pages/custom/custom-page"
            username="gh_xxxxx"
            class="testWc"
        >
            <img src="../luckdraw/imgs/win/btn.png" />
        </x-launch>
        ```
    1. 参数
        - `type` 平台类型，目前只有微信一个渠道，且默认即为微信，可不填。支持取值：
            - `wechat`，微信平台
        - `path` 小程序落地页地址，必填
        - `username` 小程序原始 `id`，必填
        - `debug` 显示调试用的半透明浮层
    1. 事件
        事件返回值都在回传参数的 `detail` 字段中，可通过 `addEventListener` 监听事件或框架如果 `Vue` 的事件绑定方式监听。
        | 名称  | 返回值   | 备注                |
        | ----- | ------ | ------------------- |
        | ready | true   | 标签初始化完毕，可以进行点击操作 |
        | launch |       | 用户点击跳转按钮并对确认弹窗进行操作后触发 |
        | error | { errMsg: string } | 用户点击跳转按钮后出现错误 |
    1. 注意事项
        - 微信开放标签需要有一定内容才能正常使用，目前由于实现的问题暂时没能支持标签尺寸自动处理，因此需要在使用的时候 **`给标签设置合适的尺寸`**
- Vue 中使用与直接使用类似。由于是自定义标签，直接使用的话 Vue 会有警告抛出来，可以有以下两种方式解决：
    - 在 `Vue.config.ignoredElements` 中加入 `x-launch-weapp`
        ```ts
        Vue.config.ignoredElements = ["x-launch"];
        ```
    - 使用 `Vue.use`
        ```ts
        import xLaunch from "@x-drive/x-launch";
        import Vue from "vue";
        Vue.use(xLaunch);
        ```
## TODO
    1. 增加平台检测