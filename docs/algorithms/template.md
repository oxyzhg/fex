---
id: template
title: 算法模板
---

对于任何数据结构，其基本操作无非遍历和访问，再具体一点就是：**增删查改**。各种数据结构遍历和访问无非两种形式：线性与非线性。线性就是 for/while 为代表，非线性就是递归为代表。

### 数组遍历

**数组**遍历框架，典型的线性迭代结构：

```ts
function traverse(arr) {
  for (let i = 0; i < arr.length; i++) {
    // 迭代访问 arr[i]
  }
}
```

### 链表遍历

**链表**遍历框架，兼具迭代和递归结构：

```ts
class ListNode {
  val: number;
  next: ListNode;
}

function traverse(head: ListNode) {
  for (let p = head; p !== null; p = p.next) {
    // 迭代访问 p.val
  }
}

function traverse(head: ListNode) {
  // 递归访问 head.val
  traverse(head.next);
}
```

### 二叉树遍历

**二叉树**遍历框架，典型的非线性递归遍历结构：

```ts
class TreeNode {
  val: number;
  left: TreeNode;
  right: TreeNode;
}

function traverse(root: TreeNode) {
  // 前序遍历代码
  traverse(root.left);
  // 中序遍历代码
  traverse(root.right);
  // 后序遍历代码
}
```

二叉树还可以用栈模拟递归，实现迭代遍历：

```ts
/* 前序遍历核心代码 */
while (root !== null || stack.length) {
  // go left down to the ground
  while (root !== null) {
    result.push(root.val);
    stack.push(root);
    root = root.left;
  }
  // if we reach to the leaf, go back to the parent right, and repeat the go left down.
  root = stack.pop();
  root = root.right;
}

/* 后序遍历核心代码 */
while (root !== null || stack.length) {
  while (root !== null) {
    result.push(root.val);
    stack.push(root);
    root = root.right;
  }
  root = stack.pop();
  root = root.left;
}
result.reverse();

/* 中序遍历核心代码 */
while (root !== null || stack.length) {
  while (root !== null) {
    stack.push(root);
    root = root.left;
  }
  root = stack.pop();
  result.push(root.val);
  root = root.right;
}
```

关于二叉树迭代遍历方法请阅读[原文](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/solution/zhuan-ti-jiang-jie-er-cha-shu-qian-zhong-hou-xu-2/)了解更多。

二叉树框架可以扩展为 N 叉树，N 叉树的遍历又可以扩展为图的遍历。
