import {sleep} from "../../../../utils";
import {dispatchClickEvent, TestDropdownElement} from "./utils";


const SettingOptionMap = {
    魔典: [
        '隐藏',
        '切换至夜晚',
        '倒计时设置',
        '夜间顺序',
        '缩放',
        '背景图',
        '关闭动画',
        '静音',
    ] as const,
    说书人: [
        '复制房间号',
        '发送角色',
        '投票记录',
        '解散房间',
    ] as const,
    玩家: [
        '隐藏玩家位置编号',
        '添加座位',
        '随机座位',
        '移除全部',
    ] as const,
    角色: [
        '选择剧本',
        '配置角色',
        '添加传奇角色',
        '移除全部',
    ] as const,
    帮助: [
        '角色技能表',
        '夜间顺序表',
        '游戏状态JSON',
        '源代码',
        '组局找人',
        '问题反馈',
        '下载DoDo',
    ] as const,
} as const;

type TSettingOptionMap = typeof SettingOptionMap;

const tabButtonMap: Record<keyof TSettingOptionMap, string> = {
    '魔典': '.fa-book-open',
    '说书人': '.fa-broadcast-tower',
    '玩家': '.fa-users',
    '角色': '.fa-theater-masks',
    '帮助': '.fa-question',
}

export async function clickSettingButton<K extends keyof TSettingOptionMap>(type: K, option: TSettingOptionMap[K][number]) {
    if (!type || !option) throw new Error(`clickSettingButton: type 或 option为空, type = ${type}, option = ${option}`);
    const index = SettingOptionMap[type]?.findIndex(o => o === option) ?? -1;
    if (index < 0) throw new Error(`clickSettingButton: 未找到目标设置选项, type = ${type}, option = ${option}`);
    const ul = document.querySelector("div.menu > ul");
    if (!ul) throw new Error('clickSettingButton: 捕获列表的 ul 元素失败');
    for (let i = 0; i < 3; i++) {
        // 判断当前的子菜单是否正确
        if (ul.children[1].innerHTML.includes(type)) {
            break;
        }
        // 不正确，则模拟点击事件，切换tab
        dispatchClickEvent(ul.querySelector(tabButtonMap[type]));
        await sleep(100);
    }
    if (!ul.children[1].innerHTML.includes(type)) throw new Error(`clickSettingButton: 切换tab页失败, type = ${type}, option = ${option}`);
    if (ul.children.length !== SettingOptionMap[type].length + 2) throw new Error(`clickSettingButton: children数量不符合预期, type = ${type}, option = ${option}`);
    dispatchClickEvent(ul.children[index + 2] as HTMLElement);
}


export const SettingTest: TestDropdownElement = {
    title: '设置',
    childrenNode: Object.keys(SettingOptionMap).map(type => ({
        title: type,
        childrenNode: SettingOptionMap[type].map(option => ({
            title: option,
            onClick: () => clickSettingButton(type as any, option),
        }))
    })),
}
