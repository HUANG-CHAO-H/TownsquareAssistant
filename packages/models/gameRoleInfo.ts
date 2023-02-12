export interface GameRoleInfo {
    // 角色ID
    id: string,
    // 角色名称
    name: string,
    // 所属阵营
    team: "townsfolk" | "outsider" | "minion" | "demon" | "traveler" | "unknown",
    // 能力
    ability: string

    // 所属的游戏剧本ID
    edition: string,
    // 首夜顺序(默认为0，表示不参与排序)
    firstNight: number,
    // 首夜唤醒并给予提醒
    firstNightReminder: string,
    // 非首夜的顺序(默认为0，表示不参与排序)
    otherNight: number,
    // 非首夜唤醒并给予提醒
    otherNightReminder: string,
    //  因为该角色的出现,而带来的额外自定义标记类型（对当前角色有效）
    reminders: [],
    // 因为该角色的出现,而带来的额外自定义标记类型（对所有角色有效）
    remindersGlobal: []
    // whether this token affects setup (orange leaf), like the Drunk or Baron
    setup: boolean,
}

export const ROLE_TEAM = ["townsfolk", "outsider", "minion", "demon", "traveler", "unknown"] as const;

// RoleTeam值的翻译与转化
export function translateRoleTeam(team: GameRoleInfo['team'], target: 'CN'): '村民' | '外来者' | '爪牙' | '恶魔' | '旅行者' | '未知类型';
export function translateRoleTeam(team: GameRoleInfo['team'], target: 'color'): 'blue' | 'light-blue' | 'orange' | 'red' | 'green' | 'grey';
export function translateRoleTeam(team: GameRoleInfo['team'], target: 'number'): 0 | 1 | 2 | 3 | 4 | 5;
export function translateRoleTeam(team: GameRoleInfo['team'], target: 'CN' | 'number' | 'color'): string | number {
    if (target === 'CN') {
        switch (team) {
            case "townsfolk": return '村民';
            case "outsider": return '外来者';
            case "minion": return '爪牙';
            case 'demon': return '恶魔';
            case 'traveler': return '旅行者';
            default: return '未知类型';
        }
    } else if (target === 'number') {
        switch (team) {
            case "townsfolk": return 0;
            case "outsider": return 1;
            case "minion": return 2;
            case 'demon': return 3;
            case 'traveler': return 4;
            default: return 5;
        }
    } else if (target === 'color') {
        switch (team) {
            case "townsfolk": return 'blue';
            case "outsider": return 'light-blue';
            case "minion": return 'orange';
            case 'demon': return 'red';
            case 'traveler': return 'green';
            default: return 'grey';
        }
    }
    return team;
}

// 格式化 GameRoleInfo 数据
export function formatGameRoleInfo(roleInfo: string | GameRoleInfo): GameRoleInfo {
    if (typeof roleInfo === 'string') {
        roleInfo = JSON.parse(roleInfo) as GameRoleInfo;
    }
    roleInfo.id = roleInfo.id || '';
    roleInfo.name = roleInfo.name || '';
    roleInfo.team = roleInfo.team || 'unknown';
    roleInfo.ability = roleInfo.ability || '';
    roleInfo.edition = roleInfo.edition || '';
    roleInfo.firstNight = roleInfo.firstNight || 0;
    roleInfo.firstNightReminder = roleInfo.firstNightReminder || '';
    roleInfo.otherNight = roleInfo.otherNight || 0;
    roleInfo.otherNightReminder = roleInfo.otherNightReminder || '';
    roleInfo.reminders = roleInfo.reminders || [];
    roleInfo.remindersGlobal = roleInfo.remindersGlobal || [];
    roleInfo.setup = roleInfo.setup || false;
    return roleInfo;
}
