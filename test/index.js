import expect from 'expect';
import {
  generatePatterns,
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
