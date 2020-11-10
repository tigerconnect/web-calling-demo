import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppStateProvider from './state';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <AppStateProvider>
        <App />
    </AppStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
