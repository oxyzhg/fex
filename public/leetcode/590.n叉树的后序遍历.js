/*
 * @lc app=leetcode.cn id=590 lang=javascript
 *
 * [590] N叉树的后序遍历
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
 * @return {number[]}
 */
var postorder = function (root) {
  // 递归结束条件
  if (root === null) return [];

  let res = [];

  for (let child of root.children) {
    res = [...res, ...postorder(child)];
  }

  res.push(root.val);

  return res;
};
// @lc code=end
/*  */