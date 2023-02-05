import React from "react";
import ReactDOM from "react-dom/client";
import { ChatWindow } from '../content-scripts/src/components/ChatWindow';

const divStyle: React.CSSProperties = {
    position: "absolute",
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 800,
    borderStyle: 'outset'
}

ReactDOM.createRoot(document.querySelector('#root')!).render(
    <React.StrictMode>
        <div style={divStyle}><ChatWindow/></div>
    </React.StrictMode>
);


