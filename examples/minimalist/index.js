import React, { Component } from 'react';
import {render} from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { connectToStore, location } from '../../index';

// Actions and reducers
const increment = () => ({type: 'INCREMENT'});
const decrement = () => ({type: 'DECREMENT'});

const counter = (state = 0, {type}) => {
  switch (type) {
    case 'INCREMENT':
      return ++state;
    case 'DECREMENT':
      return --state;
    default:
      return state;
  }
}

// Store
const rootReducer = combineReducers({
  location,
  counter
});

const store = createStore(rootReducer);

// Routes and connection to the store
const routes = {
  home: '/',
  buttons: '/path/to/buttons',
  total: '/path/to/total'
};

const disconnect = connectToStore(store, routes);

// Pages
@connect(null, { increment, decrement })
class ButtonsPage extends Component {
  render() {
    return (
      <div>
        <button onClick={this.props.increment}>Increment</button>
        <button onClick={this.props.decrement}>Decrement</button>
      </div>
    );
  }
}

@connect(({counter}) => ({counter}))
class TotalPage extends Component {
  render() {
    const { counter } = this.props;
    return (
      <div>
        <h1>Total: {counter}</h1>
      </div>
    );
  }
}

// View container
@connect(s => ({matchedRoute: s.location.matchedRoute}))
class ViewContainer extends Component {
  render() {
    const {matchedRoute} = this.props;

    switch (matchedRoute) {
      case routes.home: return <div>Home page</div>
      case routes.buttons: return <ButtonsPage/>
      case routes.total: return <TotalPage/>
      default: return <div>unknown route</div>
    }
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <a href={`#${routes.home}`}>Home</a>
          <a href={`#${routes.buttons}`}>Buttons</a>
          <a href={`#${routes.total}`}>Total</a>
          <a href={`#unknown`}>Unknown</a>
          <ViewContainer/>
        </div>
      </Provider>
    );
  }
}

render(<App/>, document.getElementById('app-container'));
