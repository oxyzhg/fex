/*
 * @lc app=leetcode.cn id=145 lang=javascript
 *
 * [145] 二叉树的后序遍历
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
var postorderTraversal = function(root) {
  if (root === null) return [];

  const result = [];
  const stack = [];

  while (root !== null || stack.length) {
    while (root !== null) {
      result.push(root.val);
      stack.push(root);
      root = root.right;
    }

    root = stack.pop();
    root = root.left;
  }

  return result.reverse();
};
// @lc code=end

/**
 * 迭代算法：
 * 1. 原理还是利用栈后入先出的特点
 * 2. 每次外层循环两个作用，一是 root!=null 一直沿右子树下探，二是 stack.length 用于弹栈回退，并切换另一分支
 * 3. 由于后序遍历的顺序是：左-右-根，而前序遍历顺序是：根-左-右，因此后续遍历可以看作是前序遍历的倒置，即：根-右-左，最终把结果倒置即可
 */