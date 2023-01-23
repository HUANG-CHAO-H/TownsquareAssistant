import React, {useCallback, useEffect, useState} from "react";
import {Button, SideSheet, Row, Col} from "@douyinfe/semi-ui";
import {ChatWindow} from "./chatWindow";
import {globalState} from "../globalState";
import {GameStateProvider} from "../provider/GameStateProvider";
import {ChatProvider} from "../provider/ChatProvider";
import {SizeProvider} from "../provider/SizeProvider";
import {PlayerInfo} from "./PlayerInfo";
import {GameEditionProvider} from "../provider/GameEditionProvider";
import {GameRoleProvider} from "../provider/GameRoleProvider";

export function AssistantIndex() {
    const [visible, setVisible] = useState(false);
    const changeVisible = useCallback(() => setVisible(v => !v), []);

    useEffect(() => {
        if (visible) {
            globalState.data.statePolling = true;
            globalState.data.chatPolling = true;
        } else {
            globalState.data.statePolling = false;
            globalState.data.chatPolling = false;
        }
    }, [visible])

    return (<>
        <Button theme='solid' type='secondary' onClick={changeVisible} style={buttonStyle}>助手</Button>
        <GameStateProvider>
            <GameEditionProvider>
                <GameRoleProvider>
                    <ChatProvider>
                        <SideSheet closeOnEsc={true}
                                   placement='bottom'
                                   height='80%'
                                   headerStyle={headerStyle}
                                   bodyStyle={bodyStyle}
                                   visible={visible}
                                   onCancel={changeVisible}
                        >
                            <Row gutter={16} style={fullHeight}>
                                <Col style={fullHeight} span={16}>
                                    <SizeProvider><PlayerInfo/></SizeProvider>
                                </Col>
                                <Col style={fullHeight} span={8}>
                                    <SizeProvider><ChatWindow/></SizeProvider>
                                </Col>
                            </Row>
                        </SideSheet>
                    </ChatProvider>
                </GameRoleProvider>
            </GameEditionProvider>
        </GameStateProvider>
    </>);
}

const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '70%',
}

const headerStyle: React.CSSProperties = {
    display: 'none'
}

const bodyStyle: React.CSSProperties = {
    padding: 0,
    overflow: "hidden",
}

const fullHeight: React.CSSProperties = {
    height: '100%',
}
