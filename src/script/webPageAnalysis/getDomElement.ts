
/* ****************************** 设置界面 ****************************** */

// 获取设置界面中的ul元素
export function getSettingUl(): HTMLElement {
    const ul = document.querySelector("div.menu > ul");
    if (!ul) throw new Error('getSettingUl: 设置列表的 ul 元素失败');
    return ul as HTMLElement;
}
// 获取设置 - 帮助按钮
export function getSettingHelp(settingUl = getSettingUl()): HTMLElement {
    const helpSvg = settingUl.querySelector('li.tabs > svg.fa-question');
    if (!helpSvg) throw new Error('getSettingHelp: 未捕捉到help按钮');
    return helpSvg as HTMLElement;
}
// 获取 设置 - 游戏状态JSON 按钮
export function getSettingJSON(settingUl = getSettingUl()): HTMLLIElement | null {
    const liArray = settingUl.querySelectorAll('li') as NodeListOf<HTMLLIElement>;
    if (!liArray || !liArray.length) throw new Error('getSettingJSON: 未捕获到li数组');
    if (liArray.length === 9 && liArray[4].innerText.includes('JSON')) {
        return liArray[4];
    } else return null;
}

/* ****************************** 游戏状态弹窗 ****************************** */

// 获取当前游戏状态弹窗所在的div
export function getGameStateJsonDiv(): HTMLDivElement | null {
    const div = document.querySelector("div.modal-backdrop.game-state");
    if (!div) {
        console.warn('getGameStateJsonDiv: 未捕获到游戏状态弹窗所在的DIV');
        return null;
    }
    return div.firstChild as HTMLDivElement;
}

// 获取游戏状态弹窗中的那个textarea
export function getGameStateJsonTextarea(): HTMLTextAreaElement | null;
export function getGameStateJsonTextarea(div: HTMLDivElement): HTMLTextAreaElement;
export function getGameStateJsonTextarea(div = getGameStateJsonDiv()): HTMLTextAreaElement | null {
    if (!div) return null;
    const textarea = div.querySelector("div.slot > textarea");
    if (!textarea) throw new Error('getGameStateJsonTextarea: 未捕获到textarea 节点');
    return textarea as HTMLTextAreaElement;
}

/* ****************************** 玩家座位 ****************************** */

// 获取玩家座位所在的DIV
export function getSeatDiv(seatNumber: number): HTMLDivElement {
    const allUser = document.querySelectorAll("#townsquare > ul.circle > li");
    if (seatNumber < 1 || seatNumber > allUser.length) {
        throw new Error('getSeatDiv: seatNumber 超出了预定范围: ' + seatNumber);
    }
    const seatDiv = allUser[seatNumber - 1].querySelector("div.player");
    if (!seatDiv) {
        throw new Error('getSeatDiv: 未捕捉到用户座位所在的div');
    }
    return seatDiv as HTMLDivElement;
}

/* ****************************** 聊天窗口 ****************************** */

// 读取聊天窗口所在的div
export function getChatDetailDiv(): HTMLDivElement | null {
    const div: HTMLDivElement | null = document.querySelector("div.df-chat-detail");
    if (!div) console.warn('getChatDetailDiv: 未捕获到聊天窗口所在的DIV');
    return div;
}
// 获取聊天窗口title所在的div
export function getChatTitleDiv(): HTMLDivElement | null;
export function getChatTitleDiv(chatDiv: HTMLDivElement): HTMLDivElement;
export function getChatTitleDiv(chatDiv = getChatDetailDiv()): HTMLDivElement | null {
    if (!chatDiv) return null;
    const titleDiv: HTMLDivElement | null = chatDiv.querySelector('div.title-wrap > div.title');
    if (!titleDiv) throw new Error('getChatTitleDiv 未捕获到title所在的div');
    return titleDiv;
}
// 获取聊天内容所在的div
export function getChatContentDiv(): HTMLDivElement | null;
export function getChatContentDiv(chatDiv: HTMLDivElement): HTMLDivElement;
export function getChatContentDiv(chatDiv = getChatDetailDiv()): HTMLDivElement | null {
    if (!chatDiv) return null;
    const contentDiv: HTMLDivElement | null = chatDiv.querySelector('div.df-scroll_wrap');
    if (!contentDiv) throw new Error('getChatContentDiv 未捕获到content所在的div');
    return contentDiv;
}
// 获取聊天输入框所在的div
export function getChatInputDiv(): HTMLDivElement | null;
export function getChatInputDiv(chatDiv: HTMLDivElement): HTMLDivElement;
export function getChatInputDiv(chatDiv = getChatDetailDiv()): HTMLDivElement | null {
    if (!chatDiv) return null;
    const inputDiv: HTMLDivElement | null = chatDiv.querySelector('div.input-wrap div#content');
    if (!inputDiv) throw new Error('getChatContentDiv 未捕获到输入框所在的div');
    return inputDiv;
}
// 获取发送按钮所在的div
export function getChatSendButton(): HTMLDivElement | null;
export function getChatSendButton(chatDiv: HTMLDivElement): HTMLDivElement;
export function getChatSendButton(chatDiv = getChatDetailDiv()): HTMLDivElement | null {
    if (!chatDiv) return null;
    const buttonDiv: HTMLDivElement | null = chatDiv.querySelector("div.input-wrap > div > div.btn");
    if (!buttonDiv) throw new Error('getChatContentDiv 未捕获到发送按钮所在的div');
    return buttonDiv;
}