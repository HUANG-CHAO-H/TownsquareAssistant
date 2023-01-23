import { GamePlayerInfo, formatGamePlayerInfo } from "./gamePlayerInfo";

export interface GameStateJSON {
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
    stateJson.players = stateJson.players.map(formatGamePlayerInfo);
    return stateJson;
}
