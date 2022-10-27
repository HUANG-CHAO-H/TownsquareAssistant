export {globalContext} from './globalContext';
export * from './webPageAnalysis';
export * from './townsquare';

import {isDevelopment} from "../utils";
import {globalContext} from "./globalContext";

export function getIconUrl(iconId: string, type = 'png'): string {
    return globalContext.baseUrl + `assets/icons/${iconId}.${type}`;
}

let addIndex = 0;
const edition = 'tb';
const roles = [
    "washerwoman",
    "librarian",
    "investigator",
    "chef",
    "empath",
    "fortuneteller",
    "undertaker",
    "monk",
    "ravenkeeper",
    "virgin",
    "slayer",
    "soldier",
    "mayor",
    "butler",
    "drunk",
    "recluse",
    "saint",
    "poisoner",
    "spy",
    "scarletwoman",
    "baron",
    "imp",
    "bureaucrat",
    "thief",
    "gunslinger",
    "scapegoat",
    "beggar"
];
function createPlayerInfo(merge: Partial<GamePlayerInfo> = {}): GamePlayerInfo {
    return {
        "name": Date.now() + '',
        "id": Date.now() + (++addIndex) + '',
        "role": roles[Math.floor(Math.random() * roles.length)],
        "reminders": [],
        "isVoteless": false,
        "isDead": false,
        "pronouns": "",
        "avatarUrl": "",
        "isTalking": false,
        "isMute": false,
        "isOpenMic": false,
        "countUnread": 0,
        ...merge
    }
}

if (isDevelopment()) {
    const players: GamePlayerInfo[] = [];
    for (let i = 0; i < 10; i++) {
        players.push(createPlayerInfo({
            id: i + 1 + '',
            name: i + 1 + '',
        }))
    }
    globalContext.gameState = {
        "bluffs": [],
        "edition": {"id": edition},
        "roles": [],
        "fabled": [{"id": "hellslibrarian"}],
        "players": players
    }
    globalContext.chatTitle = '1';
}
