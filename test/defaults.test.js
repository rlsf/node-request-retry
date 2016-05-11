'use strict';

var request = require('../');
var t = require('chai').assert;

describe('Defaults', function () {
  it('should set the default options', function (done) {
    var r = request.defaults({
        json: true,
        qs: { d: "{index}" }
    });
    r('http://www.filltext.com/?rows=1', function (err, response, body) {
      t.strictEqual(response.statusCode, 200);
      t.strictEqual(body[0].d, 1);
      done();
    });
  });

  it('should set a default function', function (done) {
    var r = request.defaults({}, function (err, response, body) {
      t.strictEqual(response.statusCode, 200);
      t.strictEqual(body[0].d, 1);
      done();
    });
    r({ url: 'http://www.filltext.com/?rows=1&d={index}', json: true });
  });

  it('should prefer options supplied to the call over default options', function (done) {
    var r = request.defaults({
        json: true,
        qs: { d: "foo" }
    });
    r({ url: 'http://www.filltext.com/?rows=1', qs: { d: "{index}" } }, function (err, response, body) {
      t.strictEqual(response.statusCode, 200);
      t.strictEqual(body[0].d, 1);
      done();
    });
  });

  it('should allow nesting', function (done) {
    var level0 = request.defaults({
        baseUrl: 'http://www.filltext.com'
    });
    var level1 = level0.defaults({
        json: true
    });
    var level2 = level1.defaults({
        qs: { d: "{index}" }
    });
    level2({ uri: '/?rows=1', fullResponse: false }).then(function (body) {
      t.strictEqual(body[0].d, 1);
      done();
    });
  });

  it('should perform "deep" defaulting', function (done) {
    var r = request.defaults({
        json: true,
        qs: { d: "{index}" }
    });
    r({ url: 'http://www.filltext.com/?rows=1', qs: { x: "test" } }, function (err, response, body) {
      t.strictEqual(response.statusCode, 200);
      t.strictEqual(body[0].d, 1);
      t.strictEqual(body[0].x, "test");
      done();
    });
  });

});