import {dispatchClickEvent, TestDropdownElement} from './utils';
import {sleep} from "../../../../utils";

// 获取玩家座位所在的DIV容器
function getSeatContainer(seatNumber: number): HTMLLIElement {
    const allUser = document.querySelectorAll<HTMLLIElement>("#townsquare > ul.circle > li");
    if (seatNumber < 1 || seatNumber > allUser.length) {
        throw new Error('getSeatContainer: seatNumber 超出了预定范围: ' + seatNumber);
    }
    return allUser[seatNumber - 1];
}

/**
 * 获取该座位下面的自定义标记
 * @param seatNumber    玩家的座位号
 * @param reminderIndex 自定义标记的index，如果不传，则返回的是 add 按钮
 * @param container     玩家数据的容器
 */
function getSeatReminder(seatNumber: number, reminderIndex?: number, container = getSeatContainer(seatNumber)) {
    const reminders = container.querySelectorAll<HTMLDivElement>('div.reminder');
    if (reminders.length < 1) throw new Error('getSeatReminder: 未捕捉到reminders集合');
    if (reminderIndex === undefined) {
        reminderIndex = reminders.length - 1;
    } else if (reminderIndex < 0 || reminderIndex >= reminders.length - 1) {
        console.error('getSeatReminder: reminderIndex数值越界');
        return null;
    }
    return reminders[reminderIndex] as HTMLDivElement;
}
// 移除自定义标记
export function removeReminder(seatNumber: number, reminderIndex: number) {
    return dispatchClickEvent(getSeatReminder(seatNumber, reminderIndex));
}
// 点击新增自定义标记的按钮
export function clickAddReminder(seatNumber: number) {
    return dispatchClickEvent(getSeatReminder(seatNumber));
}

// 获取座位Container中的玩家div
function getSeatPlayer(seatNumber: number, container = getSeatContainer(seatNumber)) {
    const seatPlayer = container.querySelector<HTMLDivElement>("div.player");
    if (!seatPlayer) throw new Error('getSeatPlayer: 未捕捉到 div.player"');
    return seatPlayer as HTMLDivElement;
}
// 切换存活 & 死亡状态
export function changeSurvivalStatus(seatNumber: number) {
    const player = getSeatPlayer(seatNumber);
    const shroud = player.querySelector<HTMLDivElement>('div.shroud');
    if (!shroud) throw new Error('changeSurvivalStatus: 未捕捉到目标 div.shroud');
    return dispatchClickEvent(shroud);
}

const menuList = [
    '改人称代词',
    '改名',
    '移动玩家',
    '换座',
    '移除该座位',
    '踢出玩家',
    '提名',
    '私聊',
] as const;
const emptyMenuList = [
    '改人称代词',
    '改名',
    '移动玩家',
    '换座',
    '移除该座位',
    '提名',
    '私聊',
] as const;
export type PlayerMenuOption = (typeof menuList)[number];
// 切换玩家菜单的出现与消失
function changePlayerMenu(player: HTMLDivElement) {
    const name = player.querySelector<HTMLDivElement>('div.name');
    if (!name) throw new Error('clickPlayerName: 未捕捉到 div.name');
    return dispatchClickEvent(name);
}
// 点击玩家菜单中的某个选项
export async function clickPlayerMenu<O extends PlayerMenuOption>(seatNumber: number, option: O) {
    let optionIndex = menuList.findIndex(o => o === option);
    if (optionIndex === -1) throw new Error('clickPlayerMenu: 菜单选项不符合预期: ' + option);
    const player = getSeatPlayer(seatNumber);
    for (let i = 0; i < 3; i++) {
        const menuUl = player.querySelector<HTMLUListElement>("ul.menu");
        if (!menuUl) {
            changePlayerMenu(player);
            await sleep(50);
            continue;
        }
        if (menuUl.children.length === menuList.length) {
        } else if (menuUl.children.length === emptyMenuList.length) {
            optionIndex = emptyMenuList.findIndex(o => o === option);
        } else {
            console.warn('clickPlayerMenu: 未找到目标菜单选项');
            return;
        }
        const li = menuUl.children[optionIndex] as HTMLLIElement;
        dispatchClickEvent(li);
        await sleep(100);
        if (player.querySelector<HTMLUListElement>("ul.menu")) {
            changePlayerMenu(player);
        }
        return;
    }
    console.error('clickPlayerMenu: 未能正确打开玩家交互菜单');
}

export const GameSeatTest: TestDropdownElement = {
    title: '1号玩家',
    childrenNode: [
        {
            title: '存活状态',
            onClick: () => changeSurvivalStatus(1),
        },
        {
            title: '新增Reminder',
            onClick: () => clickAddReminder(1)
        },
        {
            title: '移除Reminder(0)',
            onClick: () => removeReminder(1, 0),
        },
        {
            title: '玩家菜单',
            childrenNode: menuList.map(key => ({
                title: key,
                onClick: () => clickPlayerMenu(1, key),
            }))
        }
    ]
}
