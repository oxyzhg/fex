/*
 * @lc app=leetcode.cn id=102 lang=javascript
 *
 * [102] 二叉树的层序遍历
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
 * @return {number[][]}
 */
var levelOrder = function (root) {
  if (root === null) return [];

  const ans = [];
  const queue = [root];

  while (queue.length) {
    const level = [];
    const length = queue.length; // 动态增加

    for (let i = 0; i < length; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    ans.push(level);
  }

  return ans;
};
// @lc code=end

/**
 * 思路：队列
 */
