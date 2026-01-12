import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { I18nProvider } from './i18n/I18nContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <I18nProvider defaultLanguage="ja">
      <App />
    </I18nProvider>
  </React.StrictMode>
);
