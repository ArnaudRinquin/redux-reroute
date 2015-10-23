import { createHistory } from 'history';
import UrlPattern from 'url-pattern';
import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars

export const LOCATION_CHANGED = 'LOCATION_CHANGED';
export const NO_MATCH = 'NO_MATCH';

const noMatchPayload = {
  matchedRoute: NO_MATCH,
  urlParams: {},
};

export const extractFromHash = (location) => {
  if (!location.hash) {
    return '/';
  }

  let path = location.hash;
  // remove # prefix
  path = path[0] === '#' ? path.slice(1) : path;
  // ensure / prefix
  path = path[0] === '/' ? path : `/${path}`;

  return path;
};

export const pathToAction = (path, patterns) => {
  const payload = patterns.reduce((matching, pattern) => {
    const urlParams = pattern.match(path);
    if (urlParams) {
      return {
        matchedRoute: pattern.route,
        path,
        urlParams,
      };
    }

    return matching;

  }, { ...noMatchPayload, path });

  return {
    type: LOCATION_CHANGED,
    payload,
  };
};

export function generateLocationDispatcher(patterns, store, extractPath = extractFromHash) {
  return function dispatchLocation(location) {
    store.dispatch(pathToAction(extractPath(location), patterns));
  };
}

const isMatchable = (thing) => typeof thing === 'string' || thing instanceof RegExp;
const toPattern = (route) => {
  const pattern = new UrlPattern(route);
  // unfortunately, UrlPattern does not
  // keep the original route so we do it manually
  pattern.route = route;
  return pattern;
};

const toArray = (thing) => {
  if (Array.isArray(thing)) return thing;
  return Object.keys(thing).map((key) => thing[key]);
};

export function generatePatterns(routes) {
  return toArray(routes)
    .filter(isMatchable)
    .map(toPattern);
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
      ...payload,
    };
  }

  return state;
}

export function Link({route, urlParams, children}) {
  const pattern = new UrlPattern(route);
  return <a href={ `#${ pattern.stringify(urlParams) }` }>{children}</a>;
}

Link.propTypes = {
  route: PropTypes.string.isRequired,
  urlParams: PropTypes.object,
  children: PropTypes.node,
};

function defaultLocationSelector({location}) {
  return location;
}

export function noMatchRouteSelector(locationSelector = defaultLocationSelector) {
  return function(state) {
    const { matchedRoute } = locationSelector(state);
    return matchedRoute === NO_MATCH ? NO_MATCH : null;
  };
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
  };
}
