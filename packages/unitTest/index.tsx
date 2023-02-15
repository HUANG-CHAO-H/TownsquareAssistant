import React from "react";
import ReactDOM from "react-dom/client";
import type {} from '../models';
import Style from './index.module.less';

import { ChatWindow } from '../content-scripts/src/pages/ChatPage/ChatWindow';
// import { createChatTooltip } from '../content-scripts/src/pages/ChatPage';
const App = () => (
    <ChatWindow onClickSend={value => console.info(value)} chatContent={[
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'left', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'right', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'left', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'right', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'left', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'right', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'left', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'right', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'left', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'right', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'left', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'right', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'left', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'right', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'left', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'right', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'left', timeStamp: Date.now()},
        {avatarUrl: '', name: 'Hchao', content: 'hello world', direction: 'right', timeStamp: Date.now()},
    ]} getChatTooltip={() => [
            {itemKey: '001', itemType: 'single', label: '0011111', value: '001'},
            {itemKey: '002', itemType: 'group', label: '0022', value: '002', childItem: [
                            {itemKey: '001', itemType: 'single', label: '001', value: '001'},
                            {itemKey: '003', itemType: 'single', label: '0033333', value: '003'},
                            {itemKey: '004', itemType: 'single', label: '004', value: '004'},
                    ]},
            {itemKey: '003', itemType: 'single', label: '003', value: '003'},
            {itemKey: '004', itemType: 'single', label: '004', value: '004'},
    ]}/>
)

// import { CascadeSelect } from '../content-scripts/src/components/CascadeSelect';
// const App = () => (
//     <CascadeSelect listItem={[
//         {itemKey: '001', itemType: 'single', label: '001'},
//         {itemKey: '002', itemType: 'group', label: '002', childItem: [
//                 {itemKey: '001', itemType: 'single', label: '001'},
//                 {itemKey: '003', itemType: 'single', label: '003'},
//                 {itemKey: '004', itemType: 'single', label: '004'},
//             ]},
//         {itemKey: '003', itemType: 'single', label: '003'},
//         {itemKey: '004', itemType: 'single', label: '004'},
//     ]}/>
// )


ReactDOM.createRoot(document.querySelector('#root')!).render(
    <React.StrictMode><div className={Style.divStyle}><App/></div></React.StrictMode>
);
