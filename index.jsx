import { createHistory } from 'history';
import UrlPattern from 'url-pattern';
import React, { PropTypes } from 'react';

export const LOCATION_CHANGED = 'LOCATION_CHANGED';
export const NO_MATCH = 'NO_MATCH';

const noMatchPayload = {
  matchedRoute: NO_MATCH,
  urlParams: {}
};

export function generateLocationDispatcher(patterns, store) {
  return function dispatchLocation(location) {

     const path = location.hash[0] === '#' ? location.hash.slice(1) : '/';

     const payload = patterns.reduce((matching, pattern) => {
       const urlParams = pattern.match(path);
       if (urlParams) {
         return {
           matchedRoute: pattern.route,
           path,
           urlParams
         }
       };

       return matching;

     }, {...noMatchPayload, path});

     store.dispatch({
       type: LOCATION_CHANGED,
       payload
     });
   };
}

export function generatePatterns(routes) {
  if (!Array.isArray(routes)) {
    routes = Object.keys(routes)
      .map((key) => routes[key])
      .filter(route => typeof route === 'string' || route instanceof RegExp);
  }

  return routes.map((route) => {
    const pattern = new UrlPattern(route);
    // unfortunately, UrlPattern does not
    // keep the original route so we do it manually
    pattern.route = route;
    return pattern;
  });
}

export function connectToStore(store, routes) {
  const history = createHistory();
  const patterns = generatePatterns(routes);
  const locationDispatcher = generateLocationDispatcher(patterns, store);
  return history.listen(locationDispatcher);
}

export function location(state = noMatchPayload, {type, payload}) {
  if (type === LOCATION_CHANGED) {
    return {
      ...state,
      ...payload
    }
  }

  return state;
}

export function Link({route, urlParams, children}) {
  const pattern = new UrlPattern(route);
  return <a href={ `#${ pattern.stringify(urlParams) }` }>{children}</a>
}

function defaultLocationSelector({location}) {
  return location;
}

Link.propTypes = {
   route: PropTypes.string.isRequired,
   urlParams: PropTypes.object,
   children: PropTypes.node
}

export function noMatchRouteSelector(locationSelector = defaultLocationSelector) {
  return function(state) {
    const { matchedRoute } = locationSelector(state);
    return matchedRoute === NO_MATCH ? NO_MATCH : null;
  }
}

export function createComponentSelector(routeToComponentCreators, locationSelector = defaultLocationSelector) {
  const routes = Object.keys(routeToComponentCreators);
  return function componentSelector(state) {

    const { matchedRoute, urlParams } = locationSelector(state);

    const componentCreator = routes.reduce((componentCreator, route) => {
      if (matchedRoute === route) {
        return routeToComponentCreators[route];
      }
      return componentCreator;
    }, null);

    if (componentCreator) {
      const component = componentCreator(urlParams);
      return { component };
    }
  }
}
