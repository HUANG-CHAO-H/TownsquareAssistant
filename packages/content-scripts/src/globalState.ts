import {loadRemoteJson, ReactiveData, sleep} from "@/utils";
import {formatGameRoleInfo, formatGameEditionInfo, formatGameStateJSON} from '@/models';

interface IGlobalState {
    // base url
    baseUrl: string,
    // roles.json文件地址
    rolesUrl: string,
    // 角色数据
    roles: Record<string, GameRoleInfo>,
    // editions.json文件地址
    editionsUrl: string,
    // editions剧本数据
    editions: Record<string, GameEditionInfo>

    // 游戏状态JSON的字符串形式
    gameStateString: string
    // 游戏状态JSON
    gameState: GameStateJSON | undefined
    // 是否开启轮询,查询和更新JSON状态
    statePolling: boolean

    // 聊天窗口的标题
    chatTitle: string
    // 聊天内容
    chatContent: string
    // 聊天输入框中的内容
    chatInput: string
    // 是否开启轮询,查询和更新JSON状态
    chatPolling: boolean
}

export const globalState = new ReactiveData<IGlobalState>({
    baseUrl: '',
    rolesUrl: '',
    roles: {},
    editionsUrl: '',
    editions: {},

    gameStateString: '',
    gameState: undefined,
    statePolling: false,

    chatTitle: '',
    chatContent: '',
    chatInput: '',
    chatPolling: false,
});
export default globalState;

// 获取插件的baseUrl
async function getBaseUrl(): Promise<string> {
    for (let i = 0; i < 10; i++) {
        const span = document.querySelector('#townsquare_assistant_url');
        if (span) return span.innerHTML
        await sleep(300);
    }
    return '';
}
getBaseUrl().then(baseUrl => {
    if (baseUrl) {
        console.log('BaseUrl = ', baseUrl);
        globalState.set('baseUrl', baseUrl);
        globalState.set('rolesUrl', baseUrl + 'json/roles.json');
        globalState.set('editionsUrl', baseUrl + 'json/editions.json');
    } else {
        console.log('BaseUrl获取失败');
    }
})

// 关联更新rolesUrl和roles
globalState.observe('rolesUrl', async url => {
    if (!url) return globalState.set('roles', {});
    globalState.set('roles', await loadRoles(url));
});
function loadRoles(url: string): Promise<Record<string, GameRoleInfo>> {
    if (!url) return Promise.reject('url为空');
    return loadRemoteJson<GameRoleInfo[]>(url).then(data => {
        if (!(data instanceof Array)) return Promise.reject('加载roles数据失败');
        const roleRecord: Record<string, GameRoleInfo> = {};
        for (const role of data) roleRecord[role.id] = formatGameRoleInfo(role);
        return roleRecord;
    })
}

// 关联更新editionsUrl和editions
globalState.observe('editionsUrl', async url => {
    if (!url) return globalState.set('editions', {});
    globalState.set('editions', await loadEditions(url));
});
function loadEditions(url: string): Promise<Record<string, GameEditionInfo>> {
    if (!url) return Promise.reject('url为空');
    return loadRemoteJson<GameEditionInfo[]>(url).then(data => {
        if (!(data instanceof Array)) return Promise.reject('加载roles数据失败');
        const editionRecord: Record<string, GameEditionInfo> = {};
        for (const edition of data) editionRecord[edition.id] = formatGameEditionInfo(edition);
        return editionRecord;
    })
}

// 关联更新 gameStateString 和 gameState
globalState.observe('gameStateString', gameStateString => {
    if (!gameStateString) globalState.set('gameState', undefined);
    globalState.set('gameState', formatGameStateJSON(gameStateString));
});