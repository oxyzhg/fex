/*
 * @lc app=leetcode.cn id=450 lang=javascript
 *
 * [450] 删除二叉搜索树中的节点
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
 * @param {number} key
 * @return {TreeNode}
 */
var deleteNode = function (root, key) {
  if (root === null) return null;

  if (root.val === key) {
    if (root.left === null) return root.right;
    if (root.right === null) return root.left;
    const minNode = getMin(root.right);
    root.val = minNode.val;
    root.right = deleteNode(root.right, minNode.val);
  } else if (root.val < key) {
    root.right = deleteNode(root.right, key);
  } else {
    root.left = deleteNode(root.left, key);
  }

  return root;
};

function getMin(node) {
  while (node.left !== null) {
    node = node.left;
  }
  return node;
}
// @lc code=end

/**
 * 思路：
 * 1. 如果是当前节点，直接干掉。
 *  - 如果左右子树都为空，即树尾，直接干掉；
 *  - 如果左子树或右子树为空，让子树顶替档期啊节点；
 *  - 如果左右子树都不为空，这种情况最复杂，需要找左子树最大值和右子树最小值替换。
 * 2. 如果小于当前节点，去右子树删除
 * 3. 如果大于当前节点，去左子树删除
 */
