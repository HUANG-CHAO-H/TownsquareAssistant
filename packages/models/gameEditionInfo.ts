export interface GameEditionInfo {
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
