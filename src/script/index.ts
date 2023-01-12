import { sleep } from '../utils'
import {closeGameStateDialog, controlGameState, readChatInfo} from './webPageAnalysis';
import {globalContext} from "./globalContext";

export * from './webPageAnalysis';
export * from './globalContext';
export * from './townsquare';

export function getIconUrl(iconId: string, type = 'png'): string {
    return globalContext.data.baseUrl + `assets/icons/${iconId}.${type}`;
}

// 游戏状态JSON轮询
async function gameStateLoop() {
    while (true) {
        // 等待轮询开始
        await globalContext.wait('statePolling', value => Boolean(value));
        while (true) {
            await controlGameState(json => {
                globalContext.data.gameStateString = json
            });
            await sleep(globalContext.data.statePollTime);
            if (!globalContext.data.statePolling) break;
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
            const { title, content } = readChatInfo();
            globalContext.data.chatTitle = title;
            globalContext.data.chatContent = content;
            await sleep(globalContext.data.chatPollTime);
            if (!globalContext.data.chatPolling) break;
        }
    }
}
chatLoop().catch(error => console.error('chatLoop轮询被中断', error));
