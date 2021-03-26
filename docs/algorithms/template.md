---
id: template
title: 算法模板
---

对于任何数据结构，其基本操作无非遍历和访问，再具体一点就是：**增删查改**。各种数据结构遍历和访问无非两种形式：线性与非线性。线性就是 for/while 为代表，非线性就是递归为代表。

**数组**遍历框架，典型的线性迭代结构：

```ts
function traverse(arr) {
  for (let i = 0; i < arr.length; i++) {
    // 迭代访问 arr[i]
  }
}
```

**链表**遍历框架，间距迭代和递归结构：

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

**二叉树**遍历框架，典型的非线性递归遍历结构：

```ts
class TreeNode {
  val: number;
  left: TreeNode;
  right: TreeNode;
}

function traverse(root: TreeNode) {
  traverse(root.left);
  traverse(root.right);
}
```

二叉树框架可以扩展为 N 叉树，N 叉树的遍历又可以扩展为图的遍历。
