import {CascaderData} from "@douyinfe/semi-ui/cascader/item";
import {GameRoleInfo, ROLE_TEAM, translateRoleTeam} from "../../../../../models";
import {RoleAvatar} from "../../../components/RoleAvatar";
import {GameHelper} from "../../../provider/GameHelperProvider";
import {getRoleTag} from "../../../utils";

export type ValueType = 'name' | 'ability' | 'firstNightReminder' | 'otherNightReminder'

// 获取某一阵营下所有的角色列表
export function getTeamRoleOptions(
    team: GameRoleInfo['team'],
    helper: GameHelper,
    valueType: ValueType = 'name',
): CascaderData[] {
    const record = helper.gameRoleHelper.getTeamRoles(team);
    return Object.keys(record).map<CascaderData>(k => ({
        label: <RoleAvatar roleInfo={record[k]} size={'small'}/>,
        value: record[k][valueType],
    }));
}

// 当前剧本下， 所有分类下的所有角色
export function getAllTeamRoleOptions(helper: GameHelper, valueType?: ValueType): CascaderData[] {
    return ROLE_TEAM.map(t => ({
        label: getRoleTag(t),
        value: translateRoleTeam(t, 'CN'),
        children: getTeamRoleOptions(t, helper, valueType),
    })).filter(v => v.children.length);
}
