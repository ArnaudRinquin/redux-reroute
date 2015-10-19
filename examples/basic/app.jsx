import React, { Component } from 'react';
import { connect } from 'react-redux';
import { viewSelector } from './viewSelector';

import { Links } from './components/links';

export class App extends Component {
  render() {
    const { component } = this.props;
    return <div id='app'>
      <Links/>
      { component }
    </div>;
  }
}

@connect(viewSelector)
export default class ConnectedApp extends App{}
