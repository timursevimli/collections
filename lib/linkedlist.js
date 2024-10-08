'use strict';

const { isIterable } = require('./utils.js');

class LinkedList {
  constructor(iterable = null) {
    this.first = null;
    this.last = null;
    this.length = 0;
    if (iterable) {
      if (!isIterable(iterable)) this.push(iterable);
      else for (const item of iterable) this.push(item);
    }
  }

  static from(iterable) {
    return new LinkedList(iterable);
  }

  push(item) {
    this.length++;
    const last = this.last;
    const element = { prev: last, next: null, item };
    if (last) last.next = element;
    else this.first = element;
    this.last = element;
    return this.length;
  }

  shift() {
    const element = this.first;
    if (element) {
      this.length--;
      if (this.last === element) {
        this.first = null;
        this.last = null;
      } else {
        this.first = element.next;
        this.first.prev = null;
      }
    }
    return element?.item;
  }

  concat(iterable = null) {
    const list = LinkedList.from(this);
    if (!iterable) return list;
    if (!isIterable(iterable)) list.push(iterable);
    else for (const item of iterable) list.push(item);
    return list;
  }

  toString() {
    let result = '';
    let element = this.first;
    while (true) {
      result += element.item;
      element = element.next;
      if (!element) break;
      result += ',';
    }
    return result;
  }

  toArray() {
    const array = new Array(this.length);
    let element = this.first;
    for (let i = 0; i < this.length; i++) {
      array[i] = element.item;
      element = element.next;
    }
    return array;
  }

  [Symbol.iterator]() {
    let element = this.first;
    const next = () => {
      if (!element) return { done: true };
      const result = { value: element.item, done: false };
      element = element.next;
      return result;
    };
    return { next };
  }

  // sort(compareFn = (a, b) => a - b) {
  //   if (!this.first) return this;
  //   this.first = mergeSort(this.first, compareFn);
  //   let current = this.first;
  //   while (current.next) {
  //     current = current.next;
  //   }
  //   this.last = current;
  //   return this;
  // }
}

module.exports = LinkedList;
