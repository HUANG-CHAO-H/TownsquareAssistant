import {dispatchClickEvent, sleep} from "../../utils";
import {
    getChatContentDiv,
    getChatDetailDiv, getChatInputDiv, getChatSendButton, getChatTitleDiv,
    getGameStateJsonDiv,
    getGameStateJsonTextarea,
    getSeatDiv,
    getSettingHelp,
    getSettingJSON, getSettingUl
} from "./getDomElement";
import React from "react";

// 打开游戏状态JSON对话框
export function openGameStateDialog() {return gameStateJsonDiv(true)}
// 关闭游戏状态JSON对话框
export function closeGameStateDialog() {return gameStateJsonDiv(false)}
// 读取游戏状态JSON
export function readGameState(dialog = getGameStateJsonDiv()): string {
    if (!dialog) return '';
    const textarea = getGameStateJsonTextarea(dialog);
    return textarea.value;
}

/**
 * 打开某个玩家的聊天窗口
 * @param userIndex 玩家座位号
 * @param seatDiv   玩家作为所在的DIV
 */
export async function openChatWindow(
    userIndex: number,
    seatDiv = getSeatDiv(userIndex)
): Promise<HTMLDivElement | null> {
    let menuUl: HTMLElement | null = seatDiv.querySelector("ul.menu");
    if (!menuUl) {
        dispatchClickEvent(seatDiv.querySelector("div.name"));
        for (let i = 0; i < 10; i++) {
            menuUl = seatDiv.querySelector("ul.menu");
            if (menuUl) break;
            await sleep(50);
        }
        if (!menuUl) throw new Error('openChatWindow Error: 打开玩家菜单失败');
    }
    const li = menuUl.lastChild as HTMLLIElement;
    dispatchClickEvent(li);
    for (let i = 0; i < 10; i++) {
        const chatDiv = getChatDetailDiv();
        if (chatDiv) return chatDiv;
        await sleep(50);
    }
    throw new Error('openChatWindow Error: 打开聊天窗口失败')
}

// 读取聊天窗口的标题
export function readChatTitle(chatContainer = getChatDetailDiv()): string {
    if (!chatContainer) return '';
    return getChatTitleDiv(chatContainer).innerText;
}

// 读取聊天框中的内容(DOM节点克隆)
export function readChatContent(chatContainer = getChatDetailDiv()): NodeListOf<ChildNode> | null {
    if (!chatContainer) return null;
    return getChatContentDiv(chatContainer).cloneNode(true).childNodes;
}

// 读取聊天输入框中的内容
export function readChatInput(chatContainer = getChatDetailDiv()): string | false {
    if (!chatContainer) return false;
    const chatInputDiv = getChatInputDiv(chatContainer);
    return chatInputDiv.innerText;
}
/**
 * 向聊天输入框中写入聊天消息
 * @param message   消息内容
 * @param chatContainer
 */
export function writeChatInput(message: string = "", chatContainer = getChatDetailDiv()): boolean {
    if (!chatContainer) return false;
    const chatInputDiv = getChatInputDiv(chatContainer);
    chatInputDiv.innerHTML = message;
    const event = new InputEvent("input");
    chatInputDiv.dispatchEvent(event);
    return true;
}

/**
 * 触发发送按钮的click事件
 * @param chatContainer
 */
export function clickChatButton(chatContainer = getChatDetailDiv()) {
    if (!chatContainer) return;
    const chatButton = getChatSendButton(chatContainer);
    return dispatchClickEvent(chatButton);
}

/**
 * 控制gameStateJsonDiv的开启关闭状态
 * @param isOpen 是开启还是关闭
 */
async function gameStateJsonDiv(isOpen: false): Promise<null>
async function gameStateJsonDiv(isOpen: true): Promise<HTMLDivElement>
async function gameStateJsonDiv(isOpen: boolean = true): Promise<HTMLDivElement | null> {
    // 判断状态与预期是否一致
    const dialogDiv = getGameStateJsonDiv();
    if ((isOpen && dialogDiv) || (!isOpen && !dialogDiv)) return dialogDiv;
    // 第一步,获取游戏状态JSON按钮
    const settingUl = getSettingUl();
    let gameStateButton: HTMLLIElement | null = getSettingJSON(settingUl);
    if (!gameStateButton) {
        dispatchClickEvent(getSettingHelp(settingUl));
        for (let i = 0; i < 10; i++) {
            gameStateButton = getSettingJSON(settingUl);
            if (gameStateButton) break;
            await sleep(50);
        }
        if (!gameStateButton) throw new Error('未捕捉到JSON按钮');
    }
    // 第二步,点击切换状态
    dispatchClickEvent(gameStateButton);
    // 第三步,检查对话框状态是否与预期一致
    for (let i = 0; i < 10; i++) {
        const div = getGameStateJsonDiv();
        if ((isOpen && div) || (!isOpen && !div)) return div;
        await sleep(50);
    }
    throw new Error('游戏状态对话框切换失败');
}