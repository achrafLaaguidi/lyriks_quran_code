import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import { store } from './redux/store';
import './assets/i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </React.Suspense>
  </React.StrictMode>,
);
