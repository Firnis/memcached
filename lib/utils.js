"use strict";

const createHash = require('crypto').createHash;
const toString = Object.prototype.toString;
const copy = Array.prototype.slice;

exports.validateArg = function validateArg (args, config) {
  let err;

  args.validate.forEach(function (tokens) {
    const key = tokens[0]
    const value = args[key];
    const valueString = toString.call(value);

    switch(tokens[1]){
      case String:
        if (valueString !== '[object String]') {
          err = 'Argument "' + key + '" is not a valid String.';
        }

        if (!err && key === 'key') {
          var result = validateKeySize(config, key, value);
          if (result.err) {
            err = result.err;
          } else {
            args.command = reallocString(args.command).replace(value, result['value']);
          }
        }
        break;

      case Function:
        if (valueString !== '[object Function]') {
          err = 'Argument "' + key + '" is not a valid Function.';
        }

        break;

      case Number:
        if (valueString !== '[object Number]') {
          err = 'Argument "' + key + '" is not a valid Number.';
        }

        break;

      case Boolean:
        if (valueString !== '[object Boolean]') {
          err = 'Argument "' + key + '" is not a valid Boolean.';
        }

        break;

      case Array:
        if (valueString !== '[object Array]') {
          err = 'Argument "' + key + '" is not a valid Array.';
        }
        if (!err && key === 'key') {
          for (var vKey=0; vKey<value.length; vKey++) {
            var vValue = value[vKey];
            var result = validateKeySize(config, vKey, vValue);
            if (result.err) {
              err = result.err;
            } else {
              args.command = args.command.replace(vValue, result['value']);
            }
          }
        }
        break;

      case Object:
        if (valueString !== '[object Object]') {
          err = 'Argument "' + key + '" is not a valid Object.';
        }

        break;

      default:
        if (valueString === '[object global]' && !tokens[2]) {
          err = 'Argument "' + key + '" is not defined.';
        }
    }
  });

  if (err){
    if (args.callback) args.callback(new Error(err));
    return false;
  }

  return true;
};

var validateKeySize = function validateKeySize(config, key, value) {
  if (value.length > config.maxKeySize) {
    if (config.keyCompression){
      return { err: false, value: createHash('md5').update(value).digest('hex') };
    } else {
      return { err: 'Argument "' + key + '" is longer than the maximum allowed length of ' + config.maxKeySize };
    }
  } else if (/[\s\n\r]/.test(value)) {
    return { err: 'The key should not contain any whitespace or new lines' };
  } else {
    return { err: false, value: value };
  }
};

// a small util to use an object for eventEmitter
exports.fuse = function fuse (target, handlers) {
  const keys = Object.keys(handlers);
  for (let i = 0, len = keys.length; i < len; ++i) {
    target.on(keys[i], handlers[keys[i]]);
  }
};

// merges a object's proppertys / values with a other object
exports.merge = function merge (target, obj) {
  for (var i in obj) {
    target[i] = obj[i];
  }

  return target;
};

function fastConcat (input, source) {
  const target = copy.call(input);
  const len = source.length;
  for (let i = 0; i < len; ++i) {
    target.push(source[i]);
  }
  return target;
}

// curry/bind functions
exports.curry = function curry (context, fn) {
  const args = copy.call(arguments, 2);

  return function bowlofcurry () {
    return fn.apply(context || this, fastConcat(args, arguments));
  };
};

//Escapes values by putting backslashes before line breaks
exports.escapeValue = function(value) {
  return value.replace(/(\r|\n)/g, '\\$1');
};

//Unescapes escaped values by removing backslashes before line breaks
exports.unescapeValue = function(value) {
  return value.replace(/\\(\r|\n)/g, '$1');
};

// Reallocate string to fix slow string operations in node 0.10
// see https://code.google.com/p/v8/issues/detail?id=2869 for details
const reallocString = exports.reallocString = value => (' ' + value).substring(1);
