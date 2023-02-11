import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';

import { store } from './services/redux/store'
import { Provider } from 'react-redux'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
    <Provider store={store}>
      <App />
    </Provider>
);
