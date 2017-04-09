'use strict';
/**
 * Benchmark dependencies
 */
const Benchmark = require('benchmark');
const microtime = require('microtime');
const {
  tinyString,
  smallString,
  mediumString,
  largeString,
  printInfo,
  runNext,
  options,
  tests
} = require('./common');
  
/**
 * Different memcached drivers
 */
const Memcached = require('memcached');

/**
 * Setup the different benchmarks and stress tests
 */
const memcache = new Memcached('localhost');

const TIME = 60 * 60 * 20;

memcache.set('benchmark:set:1', tinyString, TIME, function() {});
memcache.set('benchmark:set:2', smallString, TIME, function() {});
memcache.set('benchmark:set:3', mediumString, TIME, function() {});
memcache.set('benchmark:set:4', largeString, TIME, function() {});

/**
 * Benchmark setting of tiny strings
 */

tests.push(new Benchmark('tinyGet', Object.assign({
  defer: true,
  fn: function(deferred) {
    memcache.get('benchmark:set:1', function() { deferred.resolve(); });
  }
}, options)));

/**
 * Benchmark setting of small strings
 */

tests.push(new Benchmark('smallGet', Object.assign({
  defer: true,
  fn: function(deferred) {
    memcache.get('benchmark:set:2', function() { deferred.resolve(); });
  }
}, options)));


tests.push(new Benchmark('mediumGet', Object.assign({
  defer: true,
  fn: function(deferred) {
    memcache.get('benchmark:set:3', function() { deferred.resolve(); });
  }
}, options)));


tests.push(new Benchmark('largeGet', Object.assign({
  defer: true,
  fn: function(deferred) {
    memcache.get('benchmark:set:4', function() { deferred.resolve(); });
  }
}, options)));

/**
 * Run the suites
 */
runNext();

