import type {ISelectItem} from "../../../components/CascadeSelect";
import type {GameHelper} from "../../../provider/GameHelperProvider";
import {getAllTeamRoleOptions} from "./roleTooltip";
import {InputCommandType} from "../ChatWindow";

export function createChatTooltip(cmd: InputCommandType | undefined, helper: GameHelper): ISelectItem[] {
    if (cmd === InputCommandType.CallPlayer) return callPlayerTooltip(helper);
    else if (cmd === InputCommandType.InsertInfo) return insertInfoTooltip(helper);
    return [];
}

function callPlayerTooltip(helper: GameHelper): ISelectItem[] {
    const players: ISelectItem = {
        itemKey: '玩家',
        label: '玩家',
        value: '玩家',
        searchKey: () => false,
        childItem: helper.players.map<ISelectItem>((value, index) => {
            const label = `${index + 1}号玩家`
            return {
                itemKey: String(value.id || label),
                label,
                value: '『' + label + '』',
                searchKey: [label],
            }
        })
    }
    const roles: ISelectItem = {
        itemKey: '角色',
        label: '角色',
        value: '角色',
        searchKey: () => false,
        childItem: getAllTeamRoleOptions(helper, 'name'),
    }
    const playerRole: ISelectItem = {
        itemKey: '玩家-角色',
        label: '玩家-角色',
        value: '玩家-角色',
        searchKey: () => false,
        childItem: helper.players.filter(v => Boolean(v?.id)).map((value, index) => {
            const role = helper.getPlayerRole(value.id)?.name || '无角色';
            const label = `${index + 1}号玩家(${role})`;
            return {
                itemKey: String(value.id),
                label,
                value: '『' + label + '』',
                searchKey: [label]
            }
        })
    }
    return [roles, players, playerRole];
}

function insertInfoTooltip(helper: GameHelper) {
    const roleAbility: ISelectItem = {
        itemKey: '角色技能',
        label: '角色技能',
        value: '角色技能',
        childItem: getAllTeamRoleOptions(helper, 'ability'),
    }
    const firstNightReminder: ISelectItem = {
        itemKey: '首夜信息',
        label: '首夜信息/技能',
        value: '首夜信息',
        childItem: getAllTeamRoleOptions(helper, 'firstNightReminder'),
    }
    const otherNightReminder: ISelectItem = {
        itemKey: '非首夜信息',
        label: '非首夜信息/技能',
        value: '非首夜信息',
        childItem: getAllTeamRoleOptions(helper, 'otherNightReminder'),
    }
    return [roleAbility, firstNightReminder, otherNightReminder];
}
