import {GameRoleInfo, ROLE_TEAM, translateRoleTeam} from "../../../../../models";
import {RoleAvatar} from "../../../components/RoleAvatar";
import {GameHelper} from "../../../provider/GameHelperProvider";
import {getRoleTag} from "../../../utils";
import { ISelectItem } from '../../../components/CascadeSelect'

export type ValueType = 'name' | 'ability' | 'firstNightReminder' | 'otherNightReminder'

// 获取某一阵营下所有的角色列表
export function getTeamRoleOptions(
    team: GameRoleInfo['team'],
    helper: GameHelper,
    valueType: ValueType = 'name',
): ISelectItem[] {
    const record = helper.gameRoleHelper.getTeamRoles(team);
    return Object.keys(record).map<ISelectItem>(k => ({
        itemKey: k,
        label: <RoleAvatar roleInfo={record[k]} size={'small'}/>,
        value: record[k][valueType],
        searchKey: [record[k].name]
    }));
}

// 当前剧本下， 所有分类下的所有角色
export function getAllTeamRoleOptions(helper: GameHelper, valueType?: ValueType): ISelectItem[] {
    return ROLE_TEAM.map<ISelectItem>(t => ({
        itemKey: t,
        label: getRoleTag(t),
        value: translateRoleTeam(t, 'CN'),
        childItem: getTeamRoleOptions(t, helper, valueType),
    })).filter(v => v.childItem?.length);
}
