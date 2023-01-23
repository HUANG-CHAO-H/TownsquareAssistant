export interface GamePlayerInfo {
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
