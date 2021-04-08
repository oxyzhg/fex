/*
 * @lc app=leetcode.cn id=222 lang=javascript
 *
 * [222] 完全二叉树的节点个数
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
 * @return {number}
 */
var countNodes = function (root) {
  if (root === null) return 0;

  let l1 = (l2 = root);
  let hl = (hr = 0);

  while (l1 !== null) {
    hl++;
    l1 = l1.left;
  }
  while (l2 !== null) {
    hr++;
    l2 = l2.right;
  }

  if (hl === hr) {
    return 2 ** hl - 1;
  }

  return countNodes(root.left) + countNodes(root.right) + 1;
};
// @lc code=end

/**
 * 普通二叉树：节点分步具有不确定性
 * 完全二叉树：只有最后一行可能存在不满，其余同层都是满的
 * 满二叉树：是个等腰三角形，每层都是满的，节点数与层数有指数关系
 */
