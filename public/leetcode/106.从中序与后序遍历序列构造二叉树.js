/*
 * @lc app=leetcode.cn id=106 lang=javascript
 *
 * [106] 从中序与后序遍历序列构造二叉树
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
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
  return build(inorder, 0, inorder.length - 1, postorder, 0, postorder.length - 1);
};

function build(inorder, inStart, inEnd, postorder, postStart, postEnd) {
  if (inStart > inEnd) return null;
  const rootVal = postorder[postEnd];
  let index = 0;
  for (let i = inStart; i <= inEnd; i++) {
    if (inorder[i] === rootVal) {
      index = i;
      break;
    }
  }
  const padStart = index - inStart;

  const root = new TreeNode(rootVal);
  root.left = build(inorder, inStart, index - 1, postorder, postStart, postStart + padStart - 1);
  root.right = build(inorder, index + 1, inEnd, postorder, postStart + padStart, postEnd - 1);

  return root;
}
// @lc code=end
