import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';        // index.css em src/
import App from './App';     // App.tsx em src/

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
