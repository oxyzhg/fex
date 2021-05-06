/*
 * @lc app=leetcode.cn id=199 lang=javascript
 *
 * [199] 二叉树的右视图
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
 * @return {number[]}
 */
var rightSideView = function (root) {
  if (root === null) return [];
  const ans = [];

  const traverse = (node, h) => {
    if (node === null) return;
    ans[h] = node.val;
    traverse(node.left, h + 1);
    traverse(node.right, h + 1);
  };

  traverse(root, 0);

  return ans;
};
// @lc code=end

/**
 * 思路：前序遍历
 */