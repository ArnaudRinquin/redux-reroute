import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import { connectToStore, location } from '../../index';

// Regular example actions and reducers
const increment = (by = 1) => ({type: 'INCREMENT', by});
const decrement = (by = 1) => ({type: 'DECREMENT', by});

const counter = (state = 0, {type, by}) => {
  switch (type) {
    case 'INCREMENT':
      return state + by;
    case 'DECREMENT':
      return state - by;
    default:
      return state;
  }
}

// redux reducers and store creation
const rootReducer = combineReducers({
  location, // the `reroute` location reducer
  counter // your own reducers
});

const store = createStore(rootReducer);

// Define your route templates
// the object keys aren't used internally, they are just for latter reference
// `connectToStore` actually transforms it to an array of string.
const routes = {
  home: '/',
  buttons: '/path/to/buttons(/by/:by)',
  total: '/path/to/total'
};

// Connect the `reroute` location handler to the store
const disconnect = connectToStore(store, routes);

// Regular application top level components connect to redux
// Only to get access to `actions` and bits of the app state
@connect((state) => ({by: state.location.urlParams.by}), { increment, decrement })
class ButtonsPage extends Component {
  render() {
    const by = parseInt(this.props.by || 1);
    return (
      <div>
        <button onClick={this.props.increment.bind(this, by)}>Increment</button>
        <button onClick={this.props.decrement.bind(this, by)}>Decrement</button>
        <div>By {by}</div>
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

// This component is responsible for picking and rendering the right component
// It connects to get the `location.matchedRoute` value of the app state
//
// Note: this is not necessary when using a component selector, this is only
// meant to demonstrate the `reroute` principles.
@connect(state => ({ matchedRoute: state.location.matchedRoute }))
class ComponentSwitch extends Component {
  render() {
    const {matchedRoute} = this.props;

    // Simply render the right component based on `matchedRoute`
    switch (matchedRoute) {
      case routes.home: return <div>Home page</div>
      case routes.buttons: return <ButtonsPage/>
      case routes.total: return <TotalPage/>
      default: return <div>unknown route</div>
    }
  }
}

// The top level component, just a list of links and the component switch
// Note how we only use regular `<a>` elements for navigation
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <h1>Links</h1>
          <div><a href={`#${routes.home}`}>Home</a></div>
          <div><a href='#/path/to/buttons'>Increment-Decrement Buttons</a></div>
          <div><a href='#/path/to/buttons/by/2'>Increment-Decrement Buttons by 2</a></div>
          <div><a href='#/path/to/buttons/by/5'>Increment-Decrement Buttons by 5</a></div>
          <div><a href={`#${routes.total}`}>Total</a></div>
          <div><a href='#unknown'>Unknown</a></div>
          <h1>View</h1>
          <ComponentSwitch/>
        </div>
      </Provider>
    );
  }
}

render(<App/>, document.getElementById('app-container'));
