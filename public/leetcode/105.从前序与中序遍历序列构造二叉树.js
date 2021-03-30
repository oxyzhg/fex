/*
 * @lc app=leetcode.cn id=105 lang=javascript
 *
 * [105] 从前序与中序遍历序列构造二叉树
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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
  return build(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1);
};

function build(preorder, preStart, preEnd, inorder, inStart, inEnd) {
  if (preStart > preEnd) return null;

  const rootVal = preorder[preStart];
  let index = 0;
  for (let i = inStart; i <= inEnd; i++) {
    if (inorder[i] === rootVal) {
      index = i;
      break;
    }
  }
  const padStart = index - inStart;

  const root = new TreeNode(rootVal);
  root.left = build(preorder, preStart + 1, preStart + padStart, inorder, inStart, index - 1);
  root.right = build(preorder, preStart + padStart + 1, preEnd, inorder, index + 1, inEnd);

  return root;
}
// @lc code=end

/**
 * 思路：
 * 1. 通过前序遍历序列可以确认根节点，通过中序遍历可以确认左子树和右子树序列
 * 2. 本题的关键就是找出根节点、左右子树序列
 * 3. 递归构建树即可
 */
