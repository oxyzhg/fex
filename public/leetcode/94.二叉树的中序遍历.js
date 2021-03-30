/*
 * @lc app=leetcode.cn id=94 lang=javascript
 *
 * [94] 二叉树的中序遍历
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
var inorderTraversal = function (root) {
  if (root === null) return [];

  const result = [];
  const stack = [];

  while (root !== null || stack.length) {
    while (root !== null) {
      stack.push(root);
      root = root.left;
    }
    root = stack.pop();
    result.push(root.val);
    root = root.right;
  }

  return result;
};
// @lc code=end

/**
 * 迭代算法：
 * 1. 仍然是利用栈的特点解题
 * 2. 外层循环两个作用，一是一直下探到底，二是弹出栈顶元素，即最左子树
 * 3. 先操作左子树，然后切换到右子树
 * 4. 重复上述迭代过程
 */