/*
 * @lc app=leetcode.cn id=225 lang=javascript
 *
 * [225] 用队列实现栈
 */

// @lc code=start
/**
 * Initialize your data structure here.
 */
var MyStack = function () {
  this.queue = [];
  this.tmp = [];
};

/**
 * Push element x onto stack.
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function (x) {
  this.queue.push(x);
};

/**
 * Removes the element on top of the stack and returns that element.
 * @return {number}
 */
MyStack.prototype.pop = function () {
  while (this.queue.length > 1) {
    this.tmp.push(this.queue.shift());
  }
  const value = this.queue.shift();
  this.queue = this.tmp;
  this.tmp = [];
  return value;
};

/**
 * Get the top element.
 * @return {number}
 */
MyStack.prototype.top = function () {
  while (this.queue.length > 1) {
    this.tmp.push(this.queue.shift());
  }
  const value = this.queue.shift();
  this.tmp.push(value);
  this.queue = this.tmp;
  this.tmp = [];
  return value;
};

/**
 * Returns whether the stack is empty.
 * @return {boolean}
 */
MyStack.prototype.empty = function () {
  return this.queue.length === 0;
};

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = new MyStack()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */
// @lc code=end

/**
 * 思路：
 * 1. 双队列实现栈
 * 2. 弹出栈时，如果缓存队列元素个数大于1，逐个出队，最后一个就是栈顶元素
 * 3. 查看栈顶元素时，逻辑同弹出栈，只不过栈顶元素还要再放回队尾
 */
