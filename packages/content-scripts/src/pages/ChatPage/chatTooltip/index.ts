import type {CascaderData} from "@douyinfe/semi-ui/cascader/item";
import type {GameHelper} from "../../../provider/GameHelperProvider";
import {getAllTeamRoleOptions} from "./roleTooltip";
import {InputCommandType} from "../ChatWindow";

export function createChatTooltip(cmd: InputCommandType | undefined, helper: GameHelper): CascaderData[] {
    if (cmd === InputCommandType.CallPlayer) return callPlayerTooltip(helper);
    else if (cmd === InputCommandType.InsertInfo) return insertInfoTooltip(helper);
    return [];
}

function callPlayerTooltip(helper: GameHelper): CascaderData[] {
    const players: CascaderData = {
        label: '玩家',
        value: '玩家',
        children: helper.players.map((_, index) => {
            const label = `${index + 1}号玩家`
            return { label, value: '『' + label + '』' }
        })
    }
    const roles: CascaderData = {
        label: '角色',
        value: '角色',
        children: getAllTeamRoleOptions(helper, 'name'),
    }
    const playerRole: CascaderData = {
        label: '玩家-角色',
        value: '玩家-角色',
        children: helper.players.filter(v => Boolean(v?.id)).map((value, index) => {
            const role = helper.getPlayerRole(value.id)?.name || '无角色';
            const label = `${index + 1}号玩家(${role})`;
            return { label, value: '『' + label + '』' }
        })
    }
    return [roles, players, playerRole];
}

function insertInfoTooltip(helper: GameHelper) {
    const roleAbility: CascaderData = {
        label: '角色技能',
        value: '角色技能',
        children: getAllTeamRoleOptions(helper, 'ability'),
    }
    const firstNightReminder: CascaderData = {
        label: '首夜信息/技能',
        value: '首夜信息',
        children: getAllTeamRoleOptions(helper, 'firstNightReminder'),
    }
    const otherNightReminder: CascaderData = {
        label: '非首夜信息/技能',
        value: '非首夜信息',
        children: getAllTeamRoleOptions(helper, 'otherNightReminder'),
    }
    return [roleAbility, firstNightReminder, otherNightReminder];
}
