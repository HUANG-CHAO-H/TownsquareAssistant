import path from 'path';

const manifest: chrome.runtime.ManifestV3 = {
    manifest_version: 3,
    // 插件名称
    name: "渲染钟楼助手",
    // 插件版本
    version: "0.0.1",
    // 描述内容
    description: "向 https://www.imdodo.com/tools/clocktower/ 页面注入一些JavaScript代码，来帮助说书人完成一些自动化操作，让说书人能够更加高效的工作",
    // 后台运行的脚本
    background: {
        // 文件路径
        service_worker: "background.js",
        // 可选项，支持esm，让你可以在脚本里import其他代码
        type: "module",
    },
    // 插件的设置，配置页面，比如说当用户在工具栏右键点击插件图标，或者导航到扩展的管理页面，并点击【详细】按钮
    options_page: '',
}

console.info(manifest);
