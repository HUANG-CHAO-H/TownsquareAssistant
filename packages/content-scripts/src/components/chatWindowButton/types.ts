import React from "react";
import {IChatContext} from "../../provider/ChatProvider";

export interface IButtonProps {
    // 修改聊天输入框中的内容
    setChatInput: React.Dispatch<React.SetStateAction<string>>
    // context的值
    chatContext: IChatContext | undefined
}