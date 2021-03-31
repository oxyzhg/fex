/*
 * @lc app=leetcode.cn id=652 lang=javascript
 *
 * [652] 寻找重复的子树
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
 * @return {TreeNode[]}
 */
var findDuplicateSubtrees = function (root) {
  const ans = [];
  const map = new Map();
  dfs(root, map, ans);
  return ans;
};

function dfs(root, map, res) {
  if (root === null) return '#';

  const left = dfs(root.left, map, res);
  const right = dfs(root.right, map, res);
  const subtree = `${root.val},${left},${right}`;

  map.set(subtree, (map.get(subtree) || 0) + 1);

  if (map.get(subtree) === 2) {
    res.push(root);
  }

  return subtree;
}
// @lc code=end
