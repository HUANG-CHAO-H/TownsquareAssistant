import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.less';

const rootDiv = document.createElement('div');
rootDiv.className = 'root-container';
document.body.appendChild(rootDiv);

ReactDOM.createRoot(rootDiv).render(
    <React.StrictMode>
        <div>hello world</div>
    </React.StrictMode>
)
