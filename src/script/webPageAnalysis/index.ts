import {sleep} from "../../utils";

import {
    closeGameStateDialog,
    openGameStateDialog,
    readChatContent,
    readChatInput,
    readChatTitle,
    readGameState, writeChatInput
} from "./controls";
import {globalContext} from "../globalContext";
import {getChatDetailDiv} from "./getDomElement";

export * from './controls';
export * from './getDomElement';

globalContext.observe('chatInput', value => writeChatInput(value));
// 游戏状态JSON轮询
async function gameStateLoop() {
    while (true) {
        // 等待轮询开始
        await globalContext.wait('statePolling', value => Boolean(value));
        // 打开对话框
        const dialog = await openGameStateDialog();
        while (true) {
            globalContext.gameStateString = readGameState(dialog);
            await sleep(globalContext.statePollTime);
            if (!globalContext.statePolling) break;
        }
        // 关闭对话框
        await closeGameStateDialog();
    }
}
gameStateLoop().catch(error => console.error('gameStateLoop轮询被中断', error));

// 聊天框内容轮询
async function chatLoop() {
    while (true) {
        // 等待轮询开始
        await globalContext.wait('chatPolling', value => Boolean(value));
        while (true) {
            const chatContainer = getChatDetailDiv();
            if (chatContainer) {
                globalContext.chatTitle = readChatTitle(chatContainer);
                globalContext.chatContent = readChatContent(chatContainer);
            }
            await sleep(globalContext.chatPollTime);
            if (!globalContext.chatPolling) break;
        }
    }
}
chatLoop().catch(error => console.error('chatLoop轮询被中断', error));