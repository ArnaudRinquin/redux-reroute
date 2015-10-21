import React from 'react'; // eslint-disable-line no-unused-vars
import { createComponentSelector, NO_MATCH } from '../../index';

import {
  home,
  a,
  b,
  bDeep,
  c,
} from './routes';

import {
  Home,
  A,
  B,
  BDeep,
  C,
} from './containers';

export const viewSelector = createComponentSelector({
  [NO_MATCH]: () => <Home routingError="Could not find matching route"/>,
  [home]: () => <Home/>,
  [a]: () => <A/>,
  [b]: () => <B/>,
  [bDeep]: () => <BDeep/>,
  [c]: (urlParams) => <C {...urlParams}/>,
});
