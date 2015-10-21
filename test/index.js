import * as reroute from '../index.jsx';
import expect from 'expect';

describe('reroute', function(){
  it('should be exported', function(){
    reroute.generatePatterns({
      foo: '/foo',
    });
    expect(reroute).toExist();
  });
});
