import React from 'react'
import ReactDOM from 'react-dom/client'
import {AssistantIndex} from "./pages/AssistantIndex";
// import {insertCssLink} from "./utils";

// 插入DOM元素(根节点)
const rootDiv = document.createElement('div');
rootDiv.id = 'assist-root';
rootDiv.style.position = 'absolute';
rootDiv.style.top = '0';
rootDiv.style.width = '100%';
document.body.appendChild(rootDiv);
// 添加CSS样式文件
// insertCssLink('https://unpkg.com/@douyinfe/semi-ui@2.17.1/dist/css/semi.css');
// insertCssLink('https://unpkg.com/@douyinfe/semi-icons@2.17.1/dist/css/semi-icons.css');

ReactDOM.createRoot(rootDiv).render(
    <React.StrictMode><AssistantIndex/></React.StrictMode>
);
