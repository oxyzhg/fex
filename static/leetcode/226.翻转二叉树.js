/*
 * @lc app=leetcode.cn id=226 lang=javascript
 *
 * [226] 翻转二叉树
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function (root) {
  // terminator
  if (root === null) return null;

  // drill down
  const left = invertTree(root.left);
  const right = invertTree(root.right);

  // current
  root.left = right;
  root.right = left;

  return root;
};
// @lc code=end
