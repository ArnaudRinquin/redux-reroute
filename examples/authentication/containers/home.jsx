import React from 'react'; // eslint-disable-line no-unused-vars

export default ({routingError}) => {
  return (
    <section id='home'>
      <h1>reroute example homepage</h1>

      { routingError ?
          <div className='error'>{routingError}</div> :
          null
      }

    </section>
  );
};
