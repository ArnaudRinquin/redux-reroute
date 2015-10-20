import { createHistory } from 'history';
import UrlPattern from 'url-pattern';
import React from 'react';

export const LOCATION_CHANGED = 'LOCATION_CHANGED';
export const NO_MATCH = 'NO_MATCH';

export function connectToStore(store, routes) {

  if (!Array.isArray(routes)) {
    routes = Object.keys(routes)
      .map((key) => routes[key])
      .filter(r => typeof r === 'string' || r.exec);
  }

  const history = createHistory();
  const patterns = routes.map((route) => {
    const pattern = new UrlPattern(route);
    pattern.route = route;
    return pattern;
  });

  const unlisten = history.listen((location) => {
    const route = location.hash[0] === '#' ? location.hash.slice(1) : '/';

    const payload = patterns.reduce((matching, pattern) => {
      const urlParams = pattern.match(route);
      if (urlParams) {
        return {
          matchedRoute: pattern.route,
          urlParams
        }
      };

      return matching;

    }, null) || {
      matchedRoute: NO_MATCH,
      urlParams: {}
    };

    store.dispatch({
      type: LOCATION_CHANGED,
      payload
    });

  });

  return unlisten;

}


const initialState = {
  matchedRoute: NO_MATCH,
  urlParms: {}
}

export function location(state = initialState, {type, payload}) {
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
