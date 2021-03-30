/*
 * @lc app=leetcode.cn id=144 lang=javascript
 *
 * [144] 二叉树的前序遍历
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
var preorderTraversal = function (root) {
  if (root === null) return [];

  const result = [];
  const stack = [];

  while (root !== null || stack.length) {
    while (root !== null) {
      result.push(root.val);
      stack.push(root);
      root = root.left;
    }

    root = stack.pop();
    root = root.right;
  }

  return result;
};
// @lc code=end

/**
 * 迭代实现：利用栈后入先出的特点
 * 1. 根节点入栈，进入迭代
 * 2. 由于是前序遍历，因此直接取栈顶元素，即最后入栈的元素输出
 * 3. 栈是后入先出，为保证先遍历左子树，因此先将右子树入栈
 */