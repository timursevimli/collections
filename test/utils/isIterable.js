'use strict';

const { test, plan } = require('tap');
const { isIterable } = require('../../lib/utils.js');

plan(4);

test('isIterable with array', (t) => {
  t.plan(1);
  t.equal(isIterable([1, 2, 3]), true);
});

test('isIterable with string', (t) => {
  t.plan(1);
  t.equal(isIterable('hello'), true);
});

test('isIterable with object', (t) => {
  t.plan(1);
  t.equal(isIterable({ key: 'value' }), false);
});

test('isIterable with null', (t) => {
  t.plan(1);
  t.equal(isIterable(null), false);
});
