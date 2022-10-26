// @ts-ignore
const fs = require('fs');
const path = require('path');

const manifest: chrome.runtime.ManifestV3 = {
    manifest_version: 3,
    // 插件名称
    name: "血染钟楼助手",
    // 插件版本
    version: "0.0.1",
    // 描述内容
    description: "向 https://www.imdodo.com/tools/clocktower/ 页面注入一些JavaScript代码，来帮助说书人完成一些自动化操作，让说书人能够更加高效的工作",
    // 后台运行的脚本
    // background: {
    //     // 文件路径
    //     service_worker: "background.js",
    //     // 可选项，支持esm，让你可以在脚本里import其他代码
    //     type: "module",
    // },

    // （插件图标的）交互动作
    action: {
        // 插件图标
        default_icon: {
            16: 'assets/townsquare_icon/townsquare-16x16.png',
            32: 'assets/townsquare_icon/townsquare-32x32.png',
            70: 'assets/townsquare_icon/townsquare-70x70.png',
            96: 'assets/townsquare_icon/townsquare-96x96.png',
            144: 'assets/townsquare_icon/townsquare-144x144.png',
            310: 'assets/townsquare_icon/townsquare-310x310.png',
        },
        // 插件标题（hover提示文本）
        default_title: '渲染钟楼助手',
        // 图标弹窗（点击图标按钮后出现的弹窗）
        default_popup: 'src/popup.html',
    },

    // 插件的设置，配置页面，比如说当用户在工具栏右键点击插件图标，或者导航到扩展的管理页面，并点击【详细】按钮
    // options_page: '',
    // options_ui: {},

    // 覆盖特定页面
    // chrome_settings_overrides: {},
    // chrome_ui_overrides: {},
    // chrome_url_overrides: {},

    // 向页面中注入JavaScript / CSS
    content_scripts: [
        {
            // 网址匹配
            matches: ['https://www.imdodo.com/tools/clocktower/'],
            // 反向匹配
            exclude_matches: undefined,
            // 要插入的JavaScript文件
            js: ['contentScript-inject.js'],
            // 要插入的css文件
            css: ['assets/css/contentScript.css'],
        }
    ],
    content_security_policy: {
        extension_pages:  "script-src 'self'; object-src 'self'"
    },
    web_accessible_resources: [
        {
            resources: [
                'assets/*',
                'js/*',
            ],
            // URL匹配，哪些URL可以访问这些资源
            matches: ['<all_urls>'],
        }
    ]
}

const manifestString = JSON.stringify(manifest);
fs.writeFileSync(path.resolve(__dirname, '../static/manifest.json'), manifestString);
fs.writeFileSync(path.resolve(__dirname, '../dist/manifest.json'), manifestString);

const script = `
'use strict';
const script = document.createElement('script');
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL('js/contentScript.js'));
const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
head.insertBefore(script, head.lastChild);
`;
fs.writeFileSync(path.resolve(__dirname, '../static/contentScript-inject.js'), script);
fs.writeFileSync(path.resolve(__dirname, '../dist/contentScript-inject.js'), script);
