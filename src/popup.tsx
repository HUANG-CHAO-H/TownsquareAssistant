import React from 'react'
import ReactDOM from 'react-dom/client'

const rootDiv = document.createElement('div');
rootDiv.className = 'root-container';
rootDiv.style.minWidth = '200px';
rootDiv.style.minHeight = '100px';
document.body.appendChild(rootDiv);

ReactDOM.createRoot(rootDiv).render(
    <React.StrictMode>
        <div>hello world</div>
    </React.StrictMode>
)
