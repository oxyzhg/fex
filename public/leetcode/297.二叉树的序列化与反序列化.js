/*
 * @lc app=leetcode.cn id=297 lang=javascript
 *
 * [297] 二叉树的序列化与反序列化
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
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function (root) {
  const result = [];

  const helper = (node) => {
    if (node === null) {
      result.push('#');
      return;
    }
    result.push(node.val);
    helper(node.left);
    helper(node.right);
  };

  helper(root, result);
  return result.join(',');
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function (data) {
  const list = data.split(',');

  const helper = (nodes) => {
    if (nodes.length === 0) return null;

    const head = nodes.shift();
    if (head === '#') return null;

    const node = new TreeNode(Number(head));
    node.left = helper(nodes);
    node.right = helper(nodes);

    return node;
  };

  return helper(list);
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
// @lc code=end

/**
 * 思路：
 * 1. 前/中/后序遍历都是可行的
 */