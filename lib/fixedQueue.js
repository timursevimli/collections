'use strict';

// Currently optimal queue size, tested on V8 6.0 - 6.6. Must be power of two.
const kSize = 2048;
const kMask = kSize - 1;

// The FixedQueue is implemented as a singly-linked list of fixed-size
// circular buffers. It looks something like this:
//
//  head                                                       tail
//    |                                                          |
//    v                                                          v
// +-----------+ <-----\       +-----------+ <------\         +-----------+
// |  [null]   |        \----- |   next    |         \------- |   next    |
// +-----------+               +-----------+                  +-----------+
// |   item    | <-- bottom    |   item    | <-- bottom       |  [empty]  |
// |   item    |               |   item    |                  |  [empty]  |
// |   item    |               |   item    |                  |  [empty]  |
// |   item    |               |   item    |                  |  [empty]  |
// |   item    |               |   item    |       bottom --> |   item    |
// |   item    |               |   item    |                  |   item    |
// |    ...    |               |    ...    |                  |    ...    |
// |   item    |               |   item    |                  |   item    |
// |   item    |               |   item    |                  |   item    |
// |  [empty]  | <-- top       |   item    |                  |   item    |
// |  [empty]  |               |   item    |                  |   item    |
// |  [empty]  |               |  [empty]  | <-- top  top --> |  [empty]  |
// +-----------+               +-----------+                  +-----------+
//
// Or, if there is only one circular buffer, it looks something
// like either of these:
//
//  head   tail                                 head   tail
//    |     |                                     |     |
//    v     v                                     v     v
// +-----------+                               +-----------+
// |  [null]   |                               |  [null]   |
// +-----------+                               +-----------+
// |  [empty]  |                               |   item    |
// |  [empty]  |                               |   item    |
// |   item    | <-- bottom            top --> |  [empty]  |
// |   item    |                               |  [empty]  |
// |  [empty]  | <-- top            bottom --> |   item    |
// |  [empty]  |                               |   item    |
// +-----------+                               +-----------+
//
// Adding a value means moving `top` forward by one, removing means
// moving `bottom` forward by one. After reaching the end, the queue
// wraps around.
//
// When `top === bottom` the current queue is empty and when
// `top + 1 === bottom` it's full. This wastes a single space of storage
// but allows much quicker checks.

class FixedCircularBuffer {
  constructor() {
    this.bottom = 0;
    this.top = 0;
    this.list = new Array(kSize).fill(undefined);
    this.next = null;
  }

  isEmpty() {
    return this.top === this.bottom;
  }

  isFull() {
    return ((this.top + 1) & kMask) === this.bottom;
  }

  push(data) {
    this.list[this.top] = data;
    this.top = (this.top + 1) & kMask;
  }

  unshift(data) {
    this.bottom = (this.bottom - 1 + kSize) & kMask;
    this.list[this.bottom] = data;
  }

  shift() {
    const nextItem = this.list[this.bottom];
    if (nextItem !== undefined) {
      this.list[this.bottom] = undefined;
      this.bottom = (this.bottom + 1) & kMask;
    }
    return nextItem ?? null;
  }

  [Symbol.iterator]() {
    return this.list[Symbol.iterator]();
  }
}

class FixedQueue {
  constructor() {
    this.head = this.tail = new FixedCircularBuffer();
    this.length = 0;
  }

  isEmpty() {
    return this.head.isEmpty();
  }

  push(data) {
    this.length++;
    if (this.head.isFull()) {
      // Head is full: Creates a new queue, sets the old queue's `.next` to it,
      // and sets it as the new main queue.
      this.head = this.head.next = new FixedCircularBuffer();
    }
    this.head.push(data);
  }

  shift() {
    const tail = this.tail;
    const next = tail.shift();
    if (tail.isEmpty() && tail.next !== null) {
      // If there is another queue, it forms the new tail.
      this.tail = tail.next;
      tail.next = null;
    }
    if (next !== null) this.length--;
    return next;
  }

  unshift(data) {
    this.length++;
    if (this.tail.isFull()) {
      const newTail = new FixedCircularBuffer();
      newTail.next = this.tail;
      this.tail = newTail;
    }
    this.tail.unshift(data);
  }

  sort(compareFn = (a, b) => a - b) {
    const size = this.length;
    const items = new Array(size).fill(undefined);
    for (let i = 0; i < size; i++) items[i] = this.shift();
    this.head = this.tail = new FixedCircularBuffer();
    items.sort(compareFn);
    // TODO: Need realize merge sort algorithm (Memory: O(n * 2))
    for (const item of items) this.push(item);
    return this;
  }

  every(fn) {
    let res = true;
    for (const item of this) {
      if (!fn(item)) {
        res = false;
        break;
      }
    }
    return res;
  }

  find(fn) {
    let res = null;
    for (const item of this) {
      if (fn(item)) {
        res = item;
        break;
      }
    }
    return res;
  }

  *[Symbol.iterator]() {
    let node = this.tail;
    while (node) {
      for (const item of node) {
        if (item !== undefined) yield item;
      }
      node = node.next;
    }
  }
}

module.exports = FixedQueue;
