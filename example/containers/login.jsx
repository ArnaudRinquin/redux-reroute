import React, { Component } from 'react';
import { connect } from 'react-redux';

import { submitLogin } from '../actions/login';

export class Login extends Component {
  render() {
    return (
      <section id="login">
        <h1>Login page</h1>
        <button onClick={this.props.submitLogin}>Submit</button>
      </section>
    );
  }
}

@connect(null, { submitLogin })
export default class ConnectedLogin extends Login {};
