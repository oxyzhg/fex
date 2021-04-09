/*
 * @lc app=leetcode.cn id=232 lang=javascript
 *
 * [232] 用栈实现队列
 */

// @lc code=start
/**
 * Initialize your data structure here.
 */
var MyQueue = function () {
  this.stack1 = [];
  this.stack2 = [];
};

/**
 * Push element x to the back of queue.
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function (x) {
  this.stack1.push(x);
};

/**
 * Removes the element from in front of queue and returns that element.
 * @return {number}
 */
MyQueue.prototype.pop = function () {
  while (this.stack1.length > 0) {
    this.stack2.push(this.stack1.pop());
  }
  const value = this.stack2.pop();
  while (this.stack2.length > 0) {
    this.stack1.push(this.stack2.pop());
  }
  return value;
};

/**
 * Get the front element.
 * @return {number}
 */
MyQueue.prototype.peek = function () {
  while (this.stack1.length > 0) {
    this.stack2.push(this.stack1.pop());
  }
  const value = this.stack2.pop();
  this.stack2.push(value);
  while (this.stack2.length > 0) {
    this.stack1.push(this.stack2.pop());
  }
  return value;
};

/**
 * Returns whether the queue is empty.
 * @return {boolean}
 */
MyQueue.prototype.empty = function () {
  return this.stack1.length === 0;
};

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */
// @lc code=end

/**
 * 思路：用栈实现队列跟用队列实现栈类似，在出队时需要两个栈轮询调换一下
 */
