import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import App from './app';
import store from './store'

import * as routes from './routes';
import { connectToStore } from '../index';

connectToStore(store, routes);

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App/>
      </Provider>
    );
  }
}

render(<Root/>, document.getElementById('app-container'));
