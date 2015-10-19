import React, { Component } from 'react';
import { connect } from 'react-redux';
import { viewSelector } from './viewSelector';

export class App extends Component {
  render() {
    const { component } = this.props;
    return <div id='app'>{ component }</div>;
  }
}

@connect((state) => {
  return {
    component: viewSelector(state)
  }
})
export default class ConnectedApp extends App{}
