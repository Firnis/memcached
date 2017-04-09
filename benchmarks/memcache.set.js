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

/**
 * Benchmark setting of tiny strings
 */

tests.push(new Benchmark('tinySet', Object.assign({
  defer: false,
  fn: function(deferred) {
    memcache.set('benchmark:set:1', tinyString, 0);
  }
}, options)));

/**
 * Benchmark setting of small strings
 */

tests.push(new Benchmark('smallSet', Object.assign({
  defer: false,
  fn: function(deferred) {
    memcache.set('benchmark:set:1', smallString, 0);
  }
}, options)));

/**
 * Run the suites
 */
runNext();
