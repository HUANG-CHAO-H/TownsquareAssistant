export * from './gamePlayerInfo';
export * from './gameEditionInfo';
export * from './gameRoleInfo';
export * from './gameStateJSON';
export * from './WsMessage';

import type { GamePlayerInfo as _GamePlayerInfo } from './gamePlayerInfo';
import type { GameEditionInfo as _GameEditionInfo } from './gameEditionInfo';
import type { GameRoleInfo as _GameRoleInfo } from './gameRoleInfo';
import type { GameStateJSON as _GameStateJSON } from './gameStateJSON';

declare global {
    type GamePlayerInfo = _GamePlayerInfo;
    type GameEditionInfo = _GameEditionInfo;
    type GameRoleInfo = _GameRoleInfo;
    type GameStateJSON = _GameStateJSON;
}