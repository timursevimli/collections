'use strict';

const isIterable = (obj = null) =>
  !!obj && typeof obj[Symbol.iterator] === 'function';

module.exports = {
  isIterable,
};
