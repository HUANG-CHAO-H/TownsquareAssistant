// 获取当前游戏状态弹窗所在的div
import {sleep} from "../../../../utils";
import {dispatchClickEvent, dispatchInputEvent, TestDropdownElement} from "./utils";
import {clickSettingButton} from "./setting";
import {json} from "stream/consumers";

// 获取当前游戏状态的弹窗
function getGameStateJsonDiv(): HTMLDivElement | null {
    const div = document.querySelector("div.modal-backdrop.game-state");
    if (!div) {
        console.warn('getGameStateJsonDiv: 未捕获到游戏状态弹窗所在的DIV');
        return null;
    }
    return div.firstChild as HTMLDivElement;
}

// 获取游戏状态弹窗中的那个textarea
function getGameStateJsonTextarea(): HTMLTextAreaElement | null;
function getGameStateJsonTextarea(div: HTMLDivElement): HTMLTextAreaElement;
function getGameStateJsonTextarea(div = getGameStateJsonDiv()): HTMLTextAreaElement | null {
    if (!div) return null;
    const textarea = div.querySelector("div.slot > textarea");
    if (!textarea) throw new Error('getGameStateJsonTextarea: 未捕获到textarea 节点');
    return textarea as HTMLTextAreaElement;
}

// 获取 复制JSON 按钮
function getButtonCopy(): HTMLDivElement | null;
function getButtonCopy(div: HTMLDivElement): HTMLDivElement;
function getButtonCopy(div = getGameStateJsonDiv()): HTMLDivElement | null {
    if (!div) return null;
    const buttonGroup = div.querySelector("div.button-group");
    if (!buttonGroup) {
        console.warn('getButtonCopy: 未捕获到游戏状态弹窗中的button-group');
        return null;
    }
    return buttonGroup.querySelector('div.townsfolk');
}

// 获取 加载状态 按钮
function getButtonLoad(): HTMLDivElement | null;
function getButtonLoad(div: HTMLDivElement): HTMLDivElement;
function getButtonLoad(div = getGameStateJsonDiv()): HTMLDivElement | null {
    if (!div) return null;
    const buttonGroup = div.querySelector("div.button-group");
    if (!buttonGroup) {
        console.warn('getButtonLoad: 未捕获到游戏状态弹窗中的button-group');
        return null;
    }
    return buttonGroup.querySelector('div.demon');
}

/**
 * 控制gameStateJson对话框的开启关闭状态
 * @param isOpen 是开启还是关闭
 */
export async function controlGameStateDialog(isOpen: false): Promise<null>
export async function controlGameStateDialog(isOpen: true): Promise<HTMLDivElement>
export async function controlGameStateDialog(isOpen: boolean = true): Promise<HTMLDivElement | null> {
    // 判断状态与预期是否一致
    const dialogDiv = getGameStateJsonDiv();
    if ((isOpen && dialogDiv) || (!isOpen && !dialogDiv)) return dialogDiv;
    // 第一步,点击 游戏状态JSON按钮 切换状态
    await clickSettingButton('帮助', '游戏状态JSON')
    // 第二步,检查对话框状态是否与预期一致
    for (let i = 0; i < 10; i++) {
        const div = getGameStateJsonDiv();
        if ((isOpen && div) || (!isOpen && !div)) return div;
        await sleep(50);
    }
    throw new Error('游戏状态对话框切换失败');
}
// 打开游戏状态JSON对话框
export function openGameStateDialog() {return controlGameStateDialog(true)}
// 关闭游戏状态JSON对话框
export function closeGameStateDialog() {return controlGameStateDialog(false)}

export type GameStateCallback<T = string> = (json: T) => Promise<string | undefined | void> | string | undefined | void
/**
 * 读写游戏状态stateJson
 * @param callback 如果返回值不为空，则表示要覆盖state
 * @param format    (可选)json的format函数
 */
export async function controlGameState<T = string>(callback: GameStateCallback<T>, format?: (json: string) => T) {
    const dialog = await controlGameStateDialog(true);
    const textArea = getGameStateJsonTextarea(dialog);
    let textAreaValue: any = textArea.value;
    if (format) {
        textAreaValue = format(textAreaValue);
    }
    const value = await callback(textAreaValue);
    if (value) {
        textArea.value = value;
        dispatchInputEvent(textArea);
        await sleep(50);
        dispatchClickEvent(getButtonLoad(dialog));
    }
}

export const GameStateJsonTest: TestDropdownElement = {
    title: '游戏状态对话框',
    childrenNode: [
        {
            title: '打开对话框',
            onClick: openGameStateDialog,
        },
        {
            title: '关闭对话框',
            onClick: closeGameStateDialog,
        },
        {
            title: '复制JSON按钮',
            onClick: () => console.log(getButtonCopy())
        },
        {
            title: '加载状态按钮',
            onClick: () => console.log(getButtonLoad())
        },
        {
            title: '读取JSON',
            onClick: () => controlGameState(console.log),
        },
    ]
}
