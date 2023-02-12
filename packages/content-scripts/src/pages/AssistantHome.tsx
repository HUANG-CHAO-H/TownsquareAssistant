import React, { useMemo } from "react";
import { SideSheet, Button } from "@douyinfe/semi-ui";
import { IconClose } from '@douyinfe/semi-icons';
import { ReactSetState } from '../../../utils';
import {useChatContext} from "../provider/ChatProvider";
import {SizeProvider} from "../provider/SizeProvider";
import {ChatPage} from "./ChatPage";
import {PlayerInfo} from "./PlayerInfo";

export interface AssistantHomeProps {
    // 可见性
    visible: boolean;
    // 设置可见性
    setVisible: ReactSetState<boolean>
}

export function AssistantHome(props: AssistantHomeProps) {
    const chatContext = useChatContext();
    return useMemo(() => (
        <SideSheet
            closeOnEsc={true}
            placement='bottom'
            height='100%'
            headerStyle={{ display: 'none' }}
            bodyStyle={bodyStyle}
            visible={props.visible}
            onCancel={() => props.setVisible(false)}
        >
            <div style={{height: '100%', flexShrink: 1, flexGrow: 1}}>
                <SizeProvider><PlayerInfo/></SizeProvider>
            </div>
            {!chatContext.chatPlayer ? null : (
                <div style={{width: 400, height: '100%', flexShrink: 0, flexGrow: 0, marginLeft: 10 }}>
                    <SizeProvider><ChatPage/></SizeProvider>
                </div>
            )}
            <Button
                style={closeButtonStyle}
                icon={<IconClose />}
                theme="light"
                aria-label="关闭"
                onClick={() => props.setVisible(false)}
            />
        </SideSheet>
    ), [!chatContext.chatPlayer, props.visible, props.setVisible])
}

const bodyStyle: React.CSSProperties = {
    padding: 0,
    overflow: "hidden",
    display: 'flex',
    flexDirection: 'row',
}

const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 10,
    right: 10,
    display: 'inline-block',
    borderRadius: 999
}
