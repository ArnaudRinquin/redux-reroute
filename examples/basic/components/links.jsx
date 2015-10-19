import React from 'react';
import { Link } from '../../../index';
import { home, a, b, bDeep, c } from '../routes';

export function Links() {
  return (
    <ul>
      <li><Link route={home}>Home</Link></li>
      <li><Link route={a}>Page A</Link></li>
      <li><Link route={b}>Page B</Link></li>
      <li><Link route={bDeep}>Page B/Deep</Link></li>
      <li><Link route={c} urlParams={{myUrlParam:'foo'}}>Page C with url params = foo</Link></li>
      <li><Link route={c} urlParams={{myUrlParam:'bar'}}>Page C with url params = bar</Link></li>
      <li><a href="#/wrong-way">unknown path</a></li>
    </ul>
  );
}
