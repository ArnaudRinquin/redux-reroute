import React from 'react'; // eslint-disable-line no-unused-vars
import { createSelector } from 'reselect';
import { createComponentSelector, noMatchRouteSelector } from '../../index';

import { home, users, me, user } from './routes';
import { Home, Users, Me, User, Login } from './containers';

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
      return { component: <Home routingError='Oh snap'/> };
    }
    return preAuthSelector(state) || auth(state);
  }
);

const preAuthSelector = createComponentSelector({
  [home]: () => <Home/>,
  [users]: () => <Users/>,
});

const auth = createSelector(
  isAuthed,
  state => state,
  (isAuthed, state) => {
    return isAuthed ? postAuthSelector(state) : { component: <Login/>};
  }
);

const postAuthSelector = createComponentSelector({
  [me]: () => <Me/>,
  [user]: (urlParams) => <User {...urlParams} />,
});
