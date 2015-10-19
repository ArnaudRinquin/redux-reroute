import React from 'react';
import { Link } from '../../../index';
import { me, user } from '../routes';

export function Links() {
  return (
    <div>
      <div>Open pages</div>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#/users">List all users</a></li>
      </ul>
      <div>Behind authentication</div>
      <ul>
        <li><Link route={me}>Me (Link directive)</Link></li>
        <li><a href="#/users/me">Me</a></li>
        <li><a href="#/users/white">W. White</a></li>
        <li><a href="#/users/pinkman">J. Pinkman</a></li>
        <li><Link route={user} urlParams={ { userId: 'brown' } }>Mr. Brown (link directive)</Link></li>
      </ul>
    </div>
  );
}
