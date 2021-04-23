/*
 * @lc app=leetcode.cn id=112 lang=javascript
 *
 * [112] 路径总和
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
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function (root, targetSum) {
  if (root === null) return false;

  if (!root.left && !root.right) {
    return root.val === targetSum;
  } else {
    return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val);
  }
};
// @lc code=end

/**
 * 思路：递归判断
 * 1. 递归终止条件，空节点退出即可
 * 2. 如果无子节点，即达到叶子节点，判断剩下的值是否等于目标值
 * 3. 如果存在子节点，递归判断左右节点的值，但是目标值要减去当前节点值
 */