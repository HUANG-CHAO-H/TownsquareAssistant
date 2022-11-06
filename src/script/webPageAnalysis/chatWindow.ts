// 读取聊天窗口所在的div
import {dispatchClickEvent, TestDropdownElement} from "./utils";
import {sleep} from "../../utils";

function getChatDetailContainer(): HTMLDivElement | null {
    const div = document.querySelector<HTMLDivElement>("div.df-chat-detail");
    if (!div) console.warn('getChatDetailDiv: 未捕获到聊天窗口所在的DIV');
    return div;
}
// 获取聊天窗口title所在的div
function getChatTitleDiv(chatDiv: HTMLDivElement): HTMLDivElement {
    const titleDiv = chatDiv.querySelector<HTMLDivElement>('div.title-wrap > div.title');
    if (!titleDiv) throw new Error('getChatTitleDiv 未捕获到title所在的div');
    return titleDiv;
}
// 获取聊天内容所在的div
function getChatContentDiv(chatDiv: HTMLDivElement): HTMLDivElement {
    const contentDiv = chatDiv.querySelector<HTMLDivElement>('div.df-scroll_wrap');
    if (!contentDiv) throw new Error('getChatContentDiv 未捕获到content所在的div');
    return contentDiv;
}
// 获取聊天输入框所在的div
function getChatInputDiv(chatDiv: HTMLDivElement): HTMLDivElement {
    const inputDiv = chatDiv.querySelector<HTMLDivElement>('div.input-wrap div#content');
    if (!inputDiv) throw new Error('getChatInputDiv 未捕获到输入框所在的div');
    return inputDiv;
}
// 获取发送按钮所在的div
function getChatSendButton(chatDiv: HTMLDivElement): HTMLDivElement {
    const buttonDiv = chatDiv.querySelector<HTMLDivElement>("div.input-wrap > div > div.btn");
    if (!buttonDiv) throw new Error('getChatSendButton 未捕获到发送按钮所在的div');
    return buttonDiv;
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
    return {
        title: getChatTitleDiv(chatContainer).innerText,
        content: getChatContentDiv(chatContainer).innerText,
    }
}
// 读取聊天输入框中的内容
export function readChatInput(): string | false {
    const chatContainer = getChatDetailContainer();
    if (!chatContainer) return false;
    const chatInputDiv = getChatInputDiv(chatContainer);
    return chatInputDiv.innerText;
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
