/*
 * @lc app=leetcode.cn id=236 lang=javascript
 *
 * [236] 二叉树的最近公共祖先
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
  if (root === null || root === p || root === q) return root;

  const left = lowestCommonAncestor(root.left, p , q);
  const right = lowestCommonAncestor(root.right, p, q);

  return left && right ? root : left || right;
};
// @lc code=end

/**
 * 思路：
 * 1. 利用树的递归遍历，逐层缩小范围
 * 2. 如果其中某个值就是当前节点，那么这就是最近公共祖先
 * 3. 否则分别去左右子树缩小范围查找，这里利用的是后续遍历
 * 
 * 三种情况：
 * 1. 如果p,q都在当前节点的树上，那么p,q分别分步在左右子树上，当前节点就是最近公共祖先
 * 2. 如果p,q都不在当前节点的树上，那么它们无最近公共祖先
 * 3. 如果p,q只有一个在当前节点的树上，那么返回当前节点
 */