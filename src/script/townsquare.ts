// export const RolesUrl = 'https://raw.githubusercontent.com/HUANG-CHAO-H/townsquare_assistant/master/static/roles.json';
// export const EditionsUrl = 'https://raw.githubusercontent.com/HUANG-CHAO-H/townsquare_assistant/master/static/editions.json';
// export function getIconUrl(iconId: string, type = 'png'): string {
//     return `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${iconId}.${type}`;
// }

declare global {
    interface GameStateJSON {
        // 当前剧本ID
        edition: { id: string };
        // 不在场角色（恶魔的伪装身份）
        bluffs: Array<string>;
        // 传奇角色（不包含说书人自身）
        fabled: Array<{id: string}>;
        // 当前剧本所拥有的角色
        roles: Array<{ id: string }>;
        // 玩家信息
        players: Array<GamePlayerInfo>;
    }

    interface GamePlayerInfo {
        // 玩家ID
        id: string;
        // 玩家name，如果座位上没有玩家则这里将填充座位号
        name: string;
        // 人称代词（自定义昵称）
        pronouns: string;
        // 玩家头像链接
        avatarUrl: string;
        // 玩家当前角色
        role: string;

        // 未读消息数量
        countUnread: number;
        // 玩家是否死亡
        isDead: boolean;
        // 玩家是否为静音状态
        isMute: boolean;
        // 是否是开放式麦克风
        isOpenMic: boolean;
        // 是否正在说话
        isTalking: boolean;
        // 是否已失去投票权
        isVoteless: boolean;
        // 标记与提示（自定义添加）
        reminders: {role: string, name: string}[];
    }

    interface GameRoleInfo {
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

    interface GameEditionInfo {
        // 剧本的ID
        id: string
        // 剧本的名称
        name: string
        // 作者
        author: string
        // 描述，介绍
        description: string
        // 剧本难度，等级
        level: 'Beginner' | 'Simple' | 'Intermediate' | 'Expert' | 'Veteran' |'unknown'
        // 角色ID
        roles: string[]
        // 是否是官方剧本
        isOfficial: boolean
    }
}

// RoleTeam值的翻译与转化
export function translateRoleTeam(team: GameRoleInfo['team'], target: 'CN'): string
export function translateRoleTeam(team: GameRoleInfo['team'], target: 'number'): number
export function translateRoleTeam(team: GameRoleInfo['team'], target: 'CN' | 'number'): string | number {
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
    }
    return team;
}

// Edition的level转化
export function translateEditionLevel(level: GameEditionInfo['level'], target: 'CN'): string
export function translateEditionLevel(level: GameEditionInfo['level'], target: 'number'): number
export function translateEditionLevel(level: GameEditionInfo['level'], target: 'CN' | 'number' = 'CN'): string | number {
    if (target === 'CN') {
        switch (level) {
            case "Beginner": return '入门';
            case "Simple": return '初级';
            case "Intermediate": return '中级';
            case 'Expert': return '高级';
            case 'Veteran': return '资深';
            default: return '未知类型';
        }
    } else if (target === 'number') {
        switch (level) {
            case "Beginner": return 0;
            case "Simple": return 1;
            case "Intermediate": return 2;
            case 'Expert': return 3;
            case 'Veteran': return 4;
            default: return 5;
        }
    }
    return level;
}

// 格式化 GameStateJSON 数据
export function formatGameStateJSON(stateJson: string | GameStateJSON): GameStateJSON {
    if (typeof stateJson === 'string') {
        stateJson = JSON.parse(stateJson) as GameStateJSON;
    }
    stateJson.edition = stateJson.edition || { id: '' };
    stateJson.bluffs = stateJson.bluffs || [];
    stateJson.fabled = stateJson.fabled || [];
    stateJson.roles = stateJson.roles || [];
    stateJson.players = stateJson.players || [];
    stateJson.players.forEach(formatGamePlayerInfo);
    return stateJson;
}
// 格式化 GamePlayerInfo 数据
export function formatGamePlayerInfo(playerInfo: string | GamePlayerInfo): GamePlayerInfo {
    if (typeof playerInfo === 'string') {
        playerInfo = JSON.parse(playerInfo) as GamePlayerInfo;
    }
    playerInfo.id = playerInfo.id || '';
    playerInfo.name = String(playerInfo.name) || '';
    playerInfo.pronouns = playerInfo.pronouns || '';
    playerInfo.avatarUrl = playerInfo.avatarUrl || '';
    playerInfo.role = playerInfo.role || '';
    playerInfo.countUnread = playerInfo.countUnread || 0;
    playerInfo.isDead = playerInfo.isDead || false;
    playerInfo.isMute = playerInfo.isMute || false;
    playerInfo.isOpenMic = playerInfo.isOpenMic || false;
    playerInfo.isTalking = playerInfo.isTalking || false;
    playerInfo.isVoteless = playerInfo.isVoteless || false;
    playerInfo.reminders = playerInfo.reminders || [];
    return playerInfo;
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
// 格式化 GameEditionInfo 数据
export function formatGameEditionInfo(editionInfo: string | GameEditionInfo): GameEditionInfo {
    if (typeof editionInfo === 'string') {
        editionInfo = JSON.parse(editionInfo) as GameEditionInfo;
    }
    editionInfo.id = editionInfo.id || '';
    editionInfo.name = editionInfo.name || '';
    editionInfo.author = editionInfo.author || '';
    editionInfo.description = editionInfo.description || '';
    editionInfo.level = editionInfo.level || 'unknown';
    editionInfo.roles = editionInfo.roles || [];
    editionInfo.isOfficial = editionInfo.isOfficial || false;
    return editionInfo;
}
