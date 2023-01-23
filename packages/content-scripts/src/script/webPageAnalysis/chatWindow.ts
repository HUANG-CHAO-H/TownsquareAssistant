// 读取聊天窗口所在的div
import {dispatchClickEvent, TestDropdownElement} from "./utils";
import {sleep} from "../../../../utils";

function getChatDetailContainer(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>("div.df-chat-detail");
}
// 获取聊天窗口title所在的div
function getChatTitleDiv(chatDiv: HTMLDivElement): HTMLDivElement | null {
    return chatDiv.querySelector<HTMLDivElement>('div.title-wrap > div.title');
}
// 获取聊天内容所在的div
function getChatContentDiv(chatDiv: HTMLDivElement): HTMLDivElement | null {
    return chatDiv.querySelector<HTMLDivElement>('div.df-scroll_wrap');
}
// 获取聊天输入框所在的div
function getChatInputDiv(chatDiv: HTMLDivElement): HTMLDivElement | null {
    return chatDiv.querySelector<HTMLDivElement>('div.input-wrap div#content');
}
// 获取发送按钮所在的div
function getChatSendButton(chatDiv: HTMLDivElement): HTMLDivElement | null {
    return chatDiv.querySelector<HTMLDivElement>("div.input-wrap > div > div.btn");
}

// 读取聊天信息
export function readChatInfo() {
    const chatContainer = getChatDetailContainer();
    if (!chatContainer) {
        return {
            title: '',
            content: '',
        }
    }
    const titleDiv = getChatTitleDiv(chatContainer);
    const contentDiv = getChatContentDiv(chatContainer);
    if (!titleDiv || !contentDiv) {
        return {
            title: '',
            content: '',
        }
    }
    return {
        title: titleDiv.innerText || '',
        content: contentDiv.innerText || '',
    }
}
// 读取聊天输入框中的内容
export function readChatInput(): string {
    const chatContainer = getChatDetailContainer();
    if (!chatContainer) return '';
    return getChatInputDiv(chatContainer)?.innerText || '';
}
/**
 * 向聊天输入框中写入聊天消息, 并发送
 * @param message   消息内容(如果为undefined，则不替换输入框中的内容)
 * @param autoSend  是否自动发送信息
 */
export async function writeChatMsg(message: string | undefined = undefined, autoSend: boolean = true): Promise<boolean> {
    const chatContainer = getChatDetailContainer();
    if (!chatContainer) return false;
    if (message !== undefined) {
        const chatInputDiv = getChatInputDiv(chatContainer);
        if (!chatInputDiv) return false;
        chatInputDiv.innerHTML = message;
        const event = new InputEvent("input");
        chatInputDiv.dispatchEvent(event);
        await sleep(50);
    }
    if (autoSend) dispatchClickEvent(getChatSendButton(chatContainer));
    return true;
}

export const ChatWindowTest: TestDropdownElement = {
    title: '聊天窗口',
    childrenNode: [
        {
            title: '读取内容',
            onClick: () => console.info(readChatInfo())
        },
        {
            title: '读取input',
            onClick: () => console.info(readChatInput()),
        },
        {
            title: '写入input',
            onClick: () => writeChatMsg('hello, world', false),
        },
        {
            title: '发送msg',
            onClick: () => writeChatMsg(undefined, true),
        },
        {
            title: '写入并发送',
            onClick: () => writeChatMsg('hello, world', true),
        }
    ]
}
