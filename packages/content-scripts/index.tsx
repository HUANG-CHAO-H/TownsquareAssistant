import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import {Dropdown, Button} from '@douyinfe/semi-ui';
import {AssistantHome} from "./src/pages/AssistantHome";
import {
    SettingTest,
    GameStateJsonTest,
    GameSeatTest,
    ChatWindowTest,
    adapterState,
    openGameStateDialog
} from "./src/adapter";
import {ChatProvider} from "./src/provider/ChatProvider";
import {GameEditionProvider} from "./src/provider/GameEditionProvider";
import {GameHelperProvider} from "./src/provider/GameHelperProvider";
import {GameRoleProvider} from "./src/provider/GameRoleProvider";
import {GameStateProvider} from "./src/provider/GameStateProvider";
import './global.less';

const IS_TEST = false;

// 插入DOM元素(根节点)
const rootDiv = document.createElement('div');
rootDiv.id = 'assist-root';
rootDiv.style.position = 'absolute';
rootDiv.style.top = '0';
rootDiv.style.zIndex = '9999';
rootDiv.style.width = '100%';
document.body.appendChild(rootDiv);

interface DropdownElement {
    title: string;
    onClick?: () => void;
    childrenNode?: DropdownElement[];
}
const dropdownGroup: DropdownElement[] = [
    SettingTest,
    GameStateJsonTest,
    GameSeatTest,
    ChatWindowTest,
];
function dropdownGroupMap(element: DropdownElement) {
    if (element.childrenNode) {
        return (
            <Dropdown position={'rightTop'} render={
                <Dropdown.Menu>{element.childrenNode.map(dropdownGroupMap)}</Dropdown.Menu>
            }>
                <Dropdown.Item onClick={element.onClick}>{element.title}</Dropdown.Item>
            </Dropdown>
        )
    }
    return <Dropdown.Item onClick={element.onClick}>{element.title}</Dropdown.Item>;
}

if (IS_TEST) {
    ReactDOM.createRoot(rootDiv).render(
        <React.StrictMode>
            <Dropdown render={<Dropdown.Menu>{dropdownGroup.map(dropdownGroupMap)}</Dropdown.Menu>}>
                <Button
                    theme='solid'
                    type='secondary'
                    style={{position: 'absolute', top: 0, left: '70%'}}>
                    TestComponent
                </Button>
            </Dropdown>
        </React.StrictMode>
    );
} else {
    ReactDOM.createRoot(rootDiv).render(
        <React.StrictMode><App/></React.StrictMode>
    );
}

function App() {
    const [visible, setVisible] = useState(false);
    useEffect(() => adapterState.set('statePolling', visible), [visible]);
    return (
        <GameStateProvider>
            <GameEditionProvider>
                <GameRoleProvider>
                    <GameHelperProvider>
                        <ChatProvider>
                            {visible ? null : (
                                <Button
                                    theme='solid'
                                    type='secondary'
                                    onClick={() => setVisible(true)}
                                    style={buttonStyle}>
                                    助手
                                </Button>
                            )}
                            <AssistantHome visible={visible} setVisible={setVisible}/>
                        </ChatProvider>
                    </GameHelperProvider>
                </GameRoleProvider>
            </GameEditionProvider>
        </GameStateProvider>
    );
}

const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '70%',
}
