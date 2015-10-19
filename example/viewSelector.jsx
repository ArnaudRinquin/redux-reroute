import React from 'react';
import { createSelector } from 'reselect';
import { createComponentSelector } from '../index';

import {
  home,
  users,
  me,
  user,
  login,
} from './routes';

import {
  Home,
  Users,
  Me,
  User,
  Error,
  Login
} from './containers';

import { noMatchRouteSelector } from '../index';

const userSelector = ({user}) => user;
const isAuthed = createSelector(
  userSelector,
  ({authorized}) => authorized
);

export const viewSelector = createSelector(
  noMatchRouteSelector(),
  state => state,
  (noMatch, state) => {
    if (noMatch) {
      return <Home routingError='Oh snap'/>;
    }
    return preAuthSelector(state) || auth(state);
  }
)

const preAuthSelector = createComponentSelector({
  [home]: () => <Home/>
});

const auth = createSelector(
  isAuthed,
  state => state,
  (isAuthed, state) => {
    return isAuthed ? postAuthSelector(state) : <Login/>
  }
)

const postAuthSelector = createComponentSelector({
  [users]: () => <Users/>,
  [me]: () => <Me/>,
  [user]: (urlParams) => <User {...urlParams} />
});
