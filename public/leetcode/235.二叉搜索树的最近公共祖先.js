/*
 * @lc app=leetcode.cn id=235 lang=javascript
 *
 * [235] 二叉搜索树的最近公共祖先
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
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  const min = Math.min(p.val, q.val);
  const max = Math.max(p.val, q.val);

  const find = (node) => {
    if (node.val < min) {
      return find(node.right);
    } else if (node.val > max) {
      return find(node.left);
    } else {
      return node;
    }
  }

  return find(root);
};
// @lc code=end

/**
 * 思路：
 * 同样是利用递归缩小查找范围
 * 与二叉树不同的是，BST具有左小右大的性质
 * 因此缩小范围更精确
 */