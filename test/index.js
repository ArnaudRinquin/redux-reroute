import expect from 'expect';
import {
  LOCATION_CHANGED,
  NO_MATCH,
  generatePatterns,
  extractFromHash,
  pathToAction,
} from '../index.jsx';
import UrlPattern from 'url-pattern';

describe('generatePatterns', () => {
  const expectToBeUrlPattern = (pattern) => expect(pattern).toBeA(UrlPattern);
  const legitRoutes = [
    '/route/a',
    '/route/b',
    '/route/b/but/deeper',
    /reg\/route/,
  ];

  context('when given an array', () => {

    it('should return an array of UrlPatterns', () => {
      const patterns = generatePatterns(legitRoutes);
      expect(Array.isArray(patterns)).toBe(true, 'should return an array');
      expect(patterns.length).toBeGreaterThan(0, 'should return some values');
      patterns.forEach(expectToBeUrlPattern);
    });

    it('should strip out non string or non regexp values', () => {
      const routes = [
        ...legitRoutes,
        true,
        [],
        {obj: 'is an object'},
      ];
      const patterns = generatePatterns(routes);
      expect(patterns.length).toBe(legitRoutes.length);
    });

    it('should attach original route to UrlPattern', () => {
      const patterns = generatePatterns(legitRoutes);
      patterns.forEach((pattern, index) => expect(pattern.route).toBe(legitRoutes[index]));
    });
  });

  context('when given an Object', () => {
    const routes = [
      '/home',
      '/users/:userId',
      '/users',
    ];

    const routeObject = {
      home: routes[0],
      user: routes[1],
      users: routes[2],
    };

    it('should use the object values as input', () => {
      const patternsFromObject = generatePatterns(routeObject);
      const patternsFromArray = generatePatterns(routes);
      expect(patternsFromObject).toEqual(patternsFromArray);
    });
  });
});

describe('extractFromHash(location)', () => {
  it('should return location.hash', function(){
    expect(extractFromHash({hash: '/foo'})).toEqual('/foo');
  });

  it('should remove "#" prefix', function(){
    expect(extractFromHash({hash: '#/foo'})).toEqual('/foo');
  });

  it('should ensure a "/" prefix', function(){
    expect(extractFromHash({hash: '#foo'})).toEqual('/foo');
    expect(extractFromHash({hash: 'foo'})).toEqual('/foo');
  });

  it('should return "/" when hash is falsy', () =>{
    expect(extractFromHash({hash: null})).toEqual('/');
    expect(extractFromHash({hash: undefined})).toEqual('/');
    expect(extractFromHash({hash: false})).toEqual('/');
  });

  it('should return "/" when hash is empty string', () => {
    expect(extractFromHash({hash: ''})).toEqual('/');
  });
});

describe('pathToAction', () => {

  function matchingPattern(route, urlParams) {
    return {
      route,
      match: () => urlParams,
    };
  }

  function nonMatchingPattern(route) {
    return {
      route,
      match: () => null,
    };
  }

  it('returns a LOCATION_CHANGED type action with matchedRoute and urlParams as payload', () => {
    const patterns = [
      matchingPattern('matching', {foo:'bar'}),
      nonMatchingPattern('non-matching'),
    ];

    const action = pathToAction('whatever', patterns);
    const {type, payload} = action;
    const {matchedRoute, urlParams} = payload;

    expect(type).toBe(LOCATION_CHANGED);
    expect(matchedRoute).toBe('matching');
    expect(urlParams).toEqual({foo:'bar'});
  });

  it('returns an LOCATION_CHANGED action with the NO_MATCH and empty object as payload', () => {
    const action = pathToAction('whatever', []);
    const {type, payload} = action;
    const {matchedRoute, urlParams} = payload;

    expect(type).toBe(LOCATION_CHANGED);
    expect(matchedRoute).toBe(NO_MATCH);
    expect(urlParams).toEqual({});
  });

  context('when many routes match', () => {
    it('returns an aciton out out the last matching pattern', () => {
      const patterns = [
        matchingPattern('matching', {foo:'bar'}),
        matchingPattern('matching', {foo:'bar2'}),
        matchingPattern('matching', {foo:'bar3'}),
        matchingPattern('theLastOneMatching', {isThe:'oneWeWant'}),
      ];

      const action = pathToAction('whatever', patterns);
      const {type, payload} = action;
      const {matchedRoute, urlParams} = payload;

      expect(type).toBe(LOCATION_CHANGED);
      expect(matchedRoute).toBe('theLastOneMatching');
      expect(urlParams).toEqual({isThe:'oneWeWant'});
    });
  });
});
