/*
 * @lc app=leetcode.cn id=230 lang=javascript
 *
 * [230] 二叉搜索树中第K小的元素
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
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function (root, k) {
  // 中序遍历对应二叉树排序
  let res;

  const helper = (node) => {
    if (node === null) return;

    // left
    helper(node.left);
    // current
    if (--k === 0) {
      res = node.val;
      return;
    }
    // right
    helper(node.right);
  };

  helper(root);

  return res;
};
// @lc code=end
