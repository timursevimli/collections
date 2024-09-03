'use strict';

const { test, plan } = require('tap');
const { LinkedList } = require('../collections.js');

plan(11);

test('LinkedList initialization', (t) => {
  t.plan(3);

  const list = new LinkedList();

  t.equal(list.length, 0);
  t.equal(list.first, null);
  t.equal(list.last, null);
});

test('LinkedList initialization with array', (t) => {
  t.plan(3);

  const list = new LinkedList([1, 2, 3]);

  t.equal(list.length, 3);
  t.equal(list.first.item, 1);
  t.equal(list.last.item, 3);
});

test('LinkedList initialization with another list', (t) => {
  t.plan(3);

  const list = new LinkedList(new LinkedList([1, 2, 3]));

  t.equal(list.length, 3);
  t.equal(list.first.item, 1);
  t.equal(list.last.item, 3);
});

test('LinkedList initialization from array', (t) => {
  t.plan(3);

  const list = LinkedList.from([1, 2, 3]);

  t.equal(list.length, 3);
  t.equal(list.first.item, 1);
  t.equal(list.last.item, 3);
});

test('LinkedList initialization from another list', (t) => {
  t.plan(3);

  const list = LinkedList.from(new LinkedList([1, 2, 3]));

  t.equal(list.length, 3);
  t.equal(list.first.item, 1);
  t.equal(list.last.item, 3);
});

test('LinkedList push', (t) => {
  t.plan(6);

  const list = new LinkedList();
  const p1 = list.push(1);
  const p2 = list.push(2);
  const p3 = list.push(3);

  t.equal(p1, 1);
  t.equal(p2, 2);
  t.equal(p3, 3);
  t.equal(list.length, 3);
  t.equal(list.first.item, 1);
  t.equal(list.last.item, 3);
});

test('LinkedList shift', (t) => {
  t.plan(2);

  const list = new LinkedList([1, 2, 3]);
  const element = list.shift();

  t.equal(element, 1);
  t.equal(list.length, 2);
});

test('LinkedList concat with another LinkedList', (t) => {
  t.plan(9);

  const list1 = new LinkedList([1, 2]);
  const list2 = new LinkedList([3, 4]);
  const concat = list1.concat(list2);

  t.equal(list1.length, 2);
  t.equal(list2.length, 2);
  t.equal(list1.first.item, 1);
  t.equal(list1.last.item, 2);
  t.equal(list2.first.item, 3);
  t.equal(list2.last.item, 4);
  t.equal(concat.length, 4);
  t.equal(concat.first.item, 1);
  t.equal(concat.last.item, 4);
});

test('LinkedList concat with array', (t) => {
  t.plan(11);

  const list = new LinkedList([1, 2]);
  const array = [3, 4];
  const concat = list.concat(array);

  t.equal(list.length, 2);
  t.equal(array.length, 2);
  t.equal(list.first.item, 1);
  t.equal(list.last.item, 2);
  t.equal(array[0], 3);
  t.equal(array.at(-1), 4);
  t.equal(concat.length, 4);
  t.equal(concat.first.item, 1);
  t.equal(concat.last.item, 4);
  t.notSame(concat, list);
  t.notSame(concat, array);
});

test('LinkedList toString', (t) => {
  t.plan(2);

  let list = new LinkedList(['a', 'b', 'c']);

  t.equal(list.toString(), 'a,b,c');

  list = new LinkedList([1, 2, 3]);

  t.equal(list.toString(), '1,2,3');
});

test('LinkedList to toArray', (t) => {
  t.plan(2);

  const list = new LinkedList([1, 2, 3]);
  const array = list.toArray();

  t.equal(array.length, 3);
  t.same(array, [1, 2, 3]);
});
