import { registerRootComponent } from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import store from './components/store';
import App from './App';

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

registerRootComponent(Root);

