import {loadRemoteJson, ReactiveData, sleep} from "../utils";
import {formatGameEditionInfo, formatGameRoleInfo, formatGameStateJSON} from "./townsquare";

interface IGlobalContext {
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
    // 轮询游戏状态的时间间隔
    statePollTime: number

    // 聊天窗口的标题
    chatTitle: string
    // 聊天内容的DOM拷贝
    chatContent: NodeListOf<ChildNode> | null
    // 聊天输入框中的内容
    chatInput: string
    // 是否开启轮询,查询和更新JSON状态
    chatPolling: boolean
    // 轮询游戏状态的时间间隔
    chatPollTime: number
}

export const globalContext = ReactiveData<IGlobalContext>({
    baseUrl: '',
    rolesUrl: '',
    roles: {},
    editionsUrl: '',
    editions: {},

    gameStateString: '',
    gameState: undefined,
    statePolling: false,
    statePollTime: 300,

    chatTitle: '',
    chatContent: null,
    chatInput: '',
    chatPolling: false,
    chatPollTime: 300,
});

// 获取插件的baseUrl
async function getBaseUrl(): Promise<string> {
    for (let i = 0; i < 10; i++) {
        const span = document.body.querySelector('#townsquare_assistant_url');
        if (span) return span.innerHTML
        await sleep(300);
    }
    return '';
}
getBaseUrl().then(baseUrl => {
    if (baseUrl) {
        console.log('BaseUrl = ', baseUrl);
        globalContext.baseUrl = baseUrl;
        globalContext.rolesUrl = baseUrl + 'roles.json';
        globalContext.editionsUrl = baseUrl + 'editions.json';
    } else {
        console.log('BaseUrl获取失败');
    }
})

// 关联更新rolesUrl和roles
globalContext.observe('rolesUrl', async url => {
    if (!url) return globalContext.roles = {};
    globalContext.roles = await loadRoles(url);
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
globalContext.observe('editionsUrl', async url => {
    if (!url) return globalContext.editions = {};
    globalContext.editions = await loadEditions(url);
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
globalContext.observe('gameStateString', gameStateString => {
    if (!gameStateString) globalContext.gameState = undefined;
    globalContext.gameState = formatGameStateJSON(gameStateString);
});
