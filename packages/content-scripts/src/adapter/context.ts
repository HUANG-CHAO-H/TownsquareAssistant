import {isEqual} from "lodash";
import {EventEmitter, loadRemoteJson, ReactiveData, sleep} from "../../../utils";
import {
    formatGameRoleInfo,
    formatGameEditionInfo,
    formatGameStateJSON,
    GamePlayerInfo,
    ChatMessageType, formatGamePlayerInfo
} from '../../../models';

export interface HttpRequestInfo {
    method: string;
    url: string;
    requestBody: Document | XMLHttpRequestBodyInit | null;
    responseBody: Record<string, any> | null;
}
interface IAdapterEvent {
    // 接收到聊天消息
    chat_msg: (msg: ChatMessageType) => void;
    // 长链接收到clockTower相关的消息
    clockTower_msg: (msg: [string, Record<string, any>]) => void;
    // http响应
    http_request: (info: HttpRequestInfo) => void;
}
export const adapterEvent = new EventEmitter<IAdapterEvent>();

// 聊天数据的store仓库
export const chatMsgStore = new ReactiveData<Record<number, ChatMessageType[]>>({}, false);

interface IAdapterState {
    // base url
    baseUrl: string,
    // 角色数据
    roles: Record<string, GameRoleInfo>,
    // editions剧本数据
    editions: Record<string, GameEditionInfo>;

    // 当前主机玩家信息
    hostPlayer: GamePlayerInfo | undefined;

    // 是否开启轮询,查询和更新JSON状态
    statePolling: boolean
    // 游戏状态JSON的字符串形式
    gameStateString: string
    // 游戏状态JSON
    gameState: GameStateJSON | undefined
    // 聊天窗口的标题
    chatTitle: string
    // 聊天内容
    chatContent: string
    // 聊天输入框中的内容
    chatInput: string
}

export const adapterState = new ReactiveData<IAdapterState>({
    baseUrl: '',
    roles: {},
    editions: {},

    hostPlayer: undefined,

    gameStateString: '',
    gameState: undefined,
    statePolling: false,
    chatTitle: '',
    chatContent: '',
    chatInput: '',
});

// 拉取角色和剧本数据
adapterState.observe('baseUrl', url => {
    if (!url) {
        adapterState.set('roles', {});
        adapterState.set('editions', {});
        return;
    }
    loadRemoteJson<GameRoleInfo[]>(url + 'json/roles.json').then(data => {
        if (!(data instanceof Array)) return Promise.reject('加载roles数据失败');
        const roleRecord: Record<string, GameRoleInfo> = {};
        for (const role of data) roleRecord[role.id] = formatGameRoleInfo(role);
        adapterState.set('roles', roleRecord);
    });
    loadRemoteJson<GameEditionInfo[]>(url + 'json/editions.json').then(data => {
        if (!(data instanceof Array)) return Promise.reject('加载roles数据失败');
        const editionRecord: Record<string, GameEditionInfo> = {};
        for (const edition of data) editionRecord[edition.id] = formatGameEditionInfo(edition);
        adapterState.set('editions', editionRecord);
    });
});
// 关联更新 gameStateString 和 gameState
adapterState.observe('gameStateString', gameStateString => {
    if (!gameStateString) adapterState.set('gameState', undefined);
    adapterState.set('gameState', formatGameStateJSON(gameStateString));
});
// 处理主机玩家信息
adapterEvent.addListener('clockTower_msg', msg => {
    if (msg instanceof Array && msg[0] === 'gs') {
        const host = formatGamePlayerInfo(msg[1]?.host || {});
        if (isEqual(adapterState.get('hostPlayer'), host)) {
            return;
        }
        adapterState.set('hostPlayer', host);
    }
});

// 获取插件的baseUrl
(async function () {
    while (!adapterState.get('baseUrl')) {
        const span = document.querySelector('#townsquare_assistant_url');
        if (span) {
            adapterState.set('baseUrl', span.innerHTML);
            continue;
        }
        await sleep(1000);
    }
})();

adapterEvent.addListener('clockTower_msg', msg => console.info('clockTower_msg', msg));
