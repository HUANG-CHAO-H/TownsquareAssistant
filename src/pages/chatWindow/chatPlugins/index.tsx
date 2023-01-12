import {Button} from "@douyinfe/semi-ui";
import React from "react";

export interface ChatPluginProps {
    // 处于当前聊天框的玩家信息
    chatPlayer: GamePlayerInfo | undefined
    // 当前聊天玩家的角色
    chatRole: GameRoleInfo | undefined
    // 当前聊天玩家的座位号(没有玩家时值为0)
    chatPlayerSeat: number
}

// 自定义功能列表
const customFunctions: Array<(props: ChatPluginProps) => JSX.Element> = [];
// 生成首夜信息按钮
// customFunctions.push((props: ChatPluginProps) => {
//     const { chatContext, setChatInput } = props;
//     const onClick = () => {
//         if (!chatContext) return;
//         const content = chatContext.chatRole?.firstNightReminder || '';
//         setChatInput(content);
//     }
//     return (
//         <Button size={'small'} onClick={onClick}>
//             生成首夜信息
//         </Button>
//     );
// })
// // 生成非首夜信息按钮
// customFunctions.push((props: ChatPluginProps) => {
//     const { chatContext, setChatInput } = props;
//     const onClick = () => {
//         if (!chatContext) return;
//         const content = chatContext.chatRole?.otherNightReminder || '';
//         setChatInput(content);
//     }
//     return (
//         <Button size={'small'} onClick={onClick}>
//             生成非首夜信息
//         </Button>
//     );
// })
