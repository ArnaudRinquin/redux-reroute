import React from 'react';
import { Links } from '../components/links';

export default ({routingError}) => {
  return (
    <section id='home'>
      <h1>ReRoute example homepage</h1>

      { routingError ?
          <div className='error'>{routingError}</div> :
          null
      }

      <Links/>

    </section>
  )
}
