import { sleep } from '@/utils'
import {closeGameStateDialog, controlGameState, readChatInfo} from './webPageAnalysis';
import globalState from "../globalState";
import globalEvent from "../globalEvent";

export * from './webPageAnalysis';

export function getIconUrl(iconId: string, type = 'png'): string {
    return globalState.data.baseUrl + `assets/icons/${iconId}.${type}`;
}

// 游戏状态JSON轮询
async function gameStateLoop() {
    while (true) {
        // 等待轮询开始
        await globalState.wait('statePolling', value => Boolean(value));
        let number = 0;
        while (true) {
            await controlGameState(json => {
                globalState.data.gameStateString = json
            });
            if (number < 3) {
                number++;
                await sleep(300);
                continue;
            }
            await Promise.race([
                sleep(3000),
                new Promise(resolve => void globalEvent.addListener('ws_clockTower_msg', resolve, { once: true })),
            ]);
            if (!globalState.data.statePolling) break;
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
        await globalState.wait('chatPolling', value => Boolean(value));
        while (true) {
            const { title, content } = readChatInfo();
            globalState.data.chatTitle = title;
            globalState.data.chatContent = content;
            await sleep(3000);
            if (!globalState.data.chatPolling) break;
        }
    }
}
chatLoop().catch(error => console.error('chatLoop轮询被中断', error));
