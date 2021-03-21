/*
 * @lc app=leetcode.cn id=98 lang=javascript
 *
 * [98] 验证二叉搜索树
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
 * @return {boolean}
 */
var isValidBST = function (root) {
  return helper(root, null, null);
};

const helper = (root, lower, upper) => {
  // terminator
  if (!root) return true;

  // current
  if (lower && root.val <= lower.val) return false;
  if (upper && root.val >= upper.val) return false;

  // drill down
  // 这里上下限需要多理解一下
  return helper(root.left, lower, root) && helper(root.right, root, upper);
};
// @lc code=end
