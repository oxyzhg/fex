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
  return isValid(root, null, null);
};

function isValid(node, min, max) {
  if (node === null) return true;

  if (min && node.val <= min.val) return false;
  if (max && node.val >= max.val) return false;
  
  return isValid(node.left, min, node) && isValid(node.right, node, max);
}

// @lc code=end

/**
 * 思路：
 * 1. 验证bst有效性，除了要对比左右子树，还要验证全部的左右子树
 */