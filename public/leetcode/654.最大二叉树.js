/*
 * @lc app=leetcode.cn id=654 lang=javascript
 *
 * [654] 最大二叉树
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
 * @param {number[]} nums
 * @return {TreeNode}
 */
var constructMaximumBinaryTree = function (nums) {
  return build(nums, 0, nums.length - 1);
};

function build(nums, lo, hi) {
  if (lo > hi) return null;
  let max = lo;
  for (let j = lo; j <= hi; j++) {
    if (nums[j] > nums[max]) max = j;
  }
  const root = new TreeNode(nums[max]);
  root.left = build(nums, lo, max - 1);
  root.right = build(nums, max + 1, hi);
  return root;
}
// @lc code=end

/**
 * 思路：
 * 1. 首先确认根节点应该做什么，想办法把根节点构造出来
 * 2. 该题根节点就是要找数组中的最大值最为根节点，然后分别构建左右子树，最后返回
 */
