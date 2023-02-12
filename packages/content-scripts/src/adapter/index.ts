import { sleep } from '../../../utils'
import {closeGameStateDialog, controlGameState, controlGameStateDialog, readChatInfo} from './webPageAnalysis';
import { chatMsgStore, adapterState, adapterEvent } from './context';
import './network';
import './chatMessage';

export * from './webPageAnalysis';
export { chatMsgStore, adapterState }

export function getIconUrl(iconId: string, type = 'png'): string {
    return adapterState.get('baseUrl') + `assets/icons/${iconId}.${type}`;
}

// 游戏状态JSON轮询
async function gameStateLoop() {
    while (true) {
        // 等待轮询开始
        await adapterState.wait('statePolling', value => Boolean(value));
        let sleepTime: number;
        while (true) {
            await controlGameState(json => adapterState.set('gameStateString', json));
            sleepTime = adapterState.get('gameStateString') ? 3000 : 300;
            await Promise.race([
                sleep(sleepTime),
                new Promise(resolve => void adapterEvent.addListener('clockTower_msg', resolve, { once: true })),
            ]);
            if (!adapterState.data.statePolling) break;
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
        await adapterState.wait('statePolling', value => Boolean(value));
        let sleepTime: number;
        while (true) {
            refreshChatInfo();
            sleepTime = adapterState.get('gameStateString') ? 3000 : 300;
            await Promise.race([
                sleep(sleepTime),
                new Promise(resolve => void adapterEvent.addListener('chat_msg', resolve, { once: true })),
            ]);
            if (!adapterState.data.statePolling) break;
        }
    }
}
chatLoop().catch(error => console.error('chatLoop轮询被中断', error));

adapterState.observe('statePolling', value => void controlGameStateDialog(value));

export function refreshChatInfo() {
    const { title, content, input } = readChatInfo();
    adapterState.set('chatTitle', title);
    adapterState.set('chatContent', content);
    adapterState.set('chatInput', input);
}
