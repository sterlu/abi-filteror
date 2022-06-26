import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';

declare global {
    interface Window {
        ethereum: any
    }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
