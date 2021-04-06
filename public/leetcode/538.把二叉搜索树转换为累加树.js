/*
 * @lc app=leetcode.cn id=538 lang=javascript
 *
 * [538] 把二叉搜索树转换为累加树
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var convertBST = function (root) {
  if (root === null) return null;

  let sum = 0;

  const traverse = (node) => {
    if (node) {
      traverse(node.right);
      sum += node.val;
      node.val = sum;
      traverse(node.left);
    }
  };

  traverse(root);

  return root;
};
// @lc code=end

/**
 * 思路：
 * 1. 反过来想问题，当前值是后边值的累加
 * 2. 运用中序遍历的思想
 */
