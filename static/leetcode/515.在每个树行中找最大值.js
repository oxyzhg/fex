/*
 * @lc app=leetcode.cn id=515 lang=javascript
 *
 * [515] 在每个树行中找最大值
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
var largestValues = function (root) {
  if (root === null) return [];

  // dfs版
  const result = [];
  const dfs = (node, level) => {
    // terminator
    if (node === null) return;

    if (level >= result.length) result[level] = Number.MIN_SAFE_INTEGER;

    result[level] = Math.max(result[level], node.val);

    if (node.left) dfs(node.left, level + 1);
    if (node.right) dfs(node.right, level + 1);
  };

  dfs(root, 0);

  // bfs版
  // const result = [];
  // const queue = [root];

  // while (queue.length) {
  //   let level = -Infinity;
  //   const size = queue.length;

  //   for (let i = 0; i < size; i++) {
  //     const node = queue.shift();

  //     level = Math.max(level, node.val);

  //     if (node.left) queue.push(node.left);
  //     if (node.right) queue.push(node.right);
  //   }

  //   result.push(level);
  // }

  return result;
};
// @lc code=end
