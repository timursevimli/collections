'use strict';

const { test, plan } = require('tap');
const { FixedQueue } = require('../collections.js');

plan(11);

test('FixedQueue initialization', (t) => {
  t.plan(2);

  const queue = new FixedQueue();

  t.equal(queue.length, 0);
  t.equal(queue instanceof FixedQueue, true);
});

test('Push method (small queue)', (t) => {
  t.plan(1);

  const queue = new FixedQueue();

  queue.push(1);
  queue.push(2);
  queue.push(3);

  t.equal(queue.length, 3);
});

test('Push method (large queue)', (t) => {
  t.plan(1);

  const MAX = 3_000;

  const queue = new FixedQueue();

  for (let i = 0; i < MAX; i++) {
    queue.push(i);
  }

  t.equal(queue.length, MAX);
});

test('Shift method (small queue)', (t) => {
  t.plan(6);

  const queue = new FixedQueue();

  queue.push(1);
  queue.push(2);
  queue.push(3);

  t.equal(queue.shift(), 1);
  t.equal(queue.length, 2);
  t.equal(queue.shift(), 2);
  t.equal(queue.length, 1);
  t.equal(queue.shift(), 3);
  t.equal(queue.length, 0);
});

test('Shift method (large queue)', (t) => {
  const MAX = 3_000;
  t.plan(MAX);

  const queue = new FixedQueue();

  for (let i = 0; i < MAX; i++) {
    queue.push(i);
  }

  for (let i = 0; i < MAX; i++) {
    t.equal(queue.shift(), i);
  }
});

test('Sort method (small queue)', (t) => {
  t.plan(4);

  const queue = new FixedQueue();

  queue.push(3);
  queue.push(1);
  queue.push(2);

  const sortedQueue = queue.sort();

  t.equal(queue.shift(), 1);
  t.equal(queue.shift(), 2);
  t.equal(queue.shift(), 3);
  t.equal(queue, sortedQueue);
});

test('Sort method (large queue)', (t) => {
  t.plan(1);

  const MAX = 3_000;
  const expected = new Array(MAX).fill(undefined).map((_, i) => i + 1);

  const queue = new FixedQueue();

  for (let i = MAX; i > 0; i--) {
    queue.push(i);
  }

  queue.sort((a, b) => a - b);

  t.same([...queue], expected);
});

test('Iterable (small queue)', (t) => {
  t.plan(1);

  const queue = new FixedQueue();
  queue.push(1);
  queue.push(2);
  queue.push(3);

  const result = [...queue];
  t.same(result, [1, 2, 3]);
});

test('Iterable (large queue)', (t) => {
  t.plan(1);

  const MAX = 3_000;
  const expected = new Array(MAX).fill(undefined);

  const queue = new FixedQueue();

  for (let i = 0; i < MAX; i++) {
    queue.push(i);
    expected[i] = i;
  }

  const result = [...queue];
  t.same(result, expected);
});

test('Every method', (t) => {
  t.plan(2);

  const queue = new FixedQueue();
  queue.push(1);
  queue.push(2);
  queue.push(3);

  t.equal(
    queue.every((x) => x > 0),
    true,
  );
  t.equal(
    queue.every((x) => x < 3),
    false,
  );
});

test('Find method', (t) => {
  t.plan(2);

  const queue = new FixedQueue();
  queue.push(10);
  queue.push(20);
  queue.push(30);

  const isExists = queue.find((x) => x === 20);
  t.equal(isExists, 20);

  const isNotExists = queue.find((x) => x === 100);
  t.equal(isNotExists, null);
});