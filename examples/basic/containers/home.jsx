import React from 'react';

export default ({routingError}) => {
  return (
    <section id='home'>
      <h1>reroute basic example homepage</h1>

      { routingError ?
          <div className='error'>{routingError}</div> :
          null
      }

    </section>
  )
}
