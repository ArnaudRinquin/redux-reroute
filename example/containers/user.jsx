import React from 'react';
import { Links } from '../components/links';

export default ({userId}) => {
  return (
    <section id='home'>
      <h1>{ `User ${userId} page`}</h1>
      <Links/>
    </section>
  )
}
