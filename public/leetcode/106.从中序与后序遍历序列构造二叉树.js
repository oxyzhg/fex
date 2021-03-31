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
  if (postStart > postEnd) return null;

  const rootVal = postorder[postEnd];
  let index = 0;
  for (let i = inStart; i <= inEnd; i++) {
    if (inorder[i] === rootVal) {
      index = i;
      break;
    }
  }
  const leftSize = index - inStart;
  // postorder: left [preStart, postStart+leftSize-1], right [postStart+leftSize, postEnd-1]
  // inorder: left [inStart, index-1], right [index+1, inEnd]
  const root = new TreeNode(rootVal);
  root.left = build(
    inorder, inStart, index - 1,
    postorder, postStart, postStart + leftSize - 1
  );
  root.right = build(
    inorder, index + 1, inEnd,
    postorder, postStart + leftSize, postEnd - 1
  );
  return root;
}
// @lc code=end
