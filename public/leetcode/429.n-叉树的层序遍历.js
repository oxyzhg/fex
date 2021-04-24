/*
 * @lc app=leetcode.cn id=429 lang=javascript
 *
 * [429] N 叉树的层序遍历
 */

// @lc code=start
/**
 * // Definition for a Node.
 * function Node(val,children) {
 *    this.val = val;
 *    this.children = children;
 * };
 */

/**
 * @param {Node} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
  if (root === null) return [];

  const result = [];
  const queue = [root];

  while (queue.length) {
    const level = [];
    const length = queue.length;

    for (let i = 0; i < length; i++) {
      const node = queue.shift();
      level.push(node.val);
      for (let child of node.children) {
        queue.push(child);
      }
    }

    result.push(level);
  }

  return result;
};
// @lc code=end
