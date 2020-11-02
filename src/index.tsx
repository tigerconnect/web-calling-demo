import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppStateProvider from './state';
// import { VideoProvider } from './components/VideoProvider';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <AppStateProvider>
      {/* <VideoProvider onError={() => {}} onDisconnect={() => {}}> */}
        <App />
      {/* </VideoProvider> */}
    </AppStateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
