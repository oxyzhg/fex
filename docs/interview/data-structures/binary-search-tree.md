---
id: binary-search-tree
title: 二叉搜索树
---

特点：二叉树中的节点只能有两个子节点：左侧节点和右侧节点。二叉搜索树是二叉树的一种，但是只允许左侧节点存储（比父节点）小的值，右侧节点存储（比父节点）大的值。

### 实例方法

- `insert` --- 向树中插入新值
- `search` --- 在树中查找一个键。如果节点存在，则返回 true，否则返回 false
- `inOrderTraverse` --- 通过中序遍历的方式遍历所有节点
- `preOrderTraverse` --- 通过先序遍历的方式遍历所有节点
- `postOrderTraverse` --- 通过后序遍历的方式遍历所有节点
- `min` --- 返回树中的最小值
- `max` --- 返回树中的最大值
- `remove` --- 从树中移除某个键

### 模拟实现

先创建 `Node` 类表示二叉搜索树中的每个节点：

```typescript
class Node<T> {
  public key: T;
  public left: Node<T> | null;
  public right: Node<T> | null;

  constructor(key: T) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}
```

模拟实现二叉搜索树：

```typescript
class BinarySearchTree<T> {
  protected root: Node<T> | null;
  protected compareFn: Function;

  constructor() {
    this.root = null;
    this.compareFn = defaultCompare;
  }

  /** 向树种插入新元素 */
  insert(key: T) {
    /**
     * 1. 树为空，新节点就是根节点
     * 2. 树不为空，遍历插入
     */
    if (this.root === null) {
      this.root = new Node(key);
    } else {
      this.insertNode(this.root, key); // 递归向下查找
    }
  }

  private insertNode(root: Node<T>, key: T) {
    /**
     * 1. 对比当前节点元素与新值大小，若小于当前节点元素，则再判断左节点的情况，否则判断右节点
     * 2. 如果左节点为空值，那么新元素置于此，否则从左节点继续往下递归，直到新元素目标位置为空
     */
    if (this.compareFn(key, root.key) === Compare.LESS_THAN) {
      if (root.left === null) {
        root.left = new Node(key);
      } else {
        this.insertNode(root.left, key);
      }
    } else {
      if (root.right === null) {
        root.right = new Node(key);
      } else {
        this.insertNode(root.right, key);
      }
    }
  }

  /** 中序遍历 */
  inOrderTraverse(callback: Function) {
    // 特点：按从小到大的顺序访问节点
    // 应用：对树进行排序操作
    this.inOrderTraverseNode(this.root, callback);
  }

  private inOrderTraverseNode(node: Node<T> | null, callback: Function) {
    if (node != null) {
      this.inOrderTraverseNode(node.left, callback);
      callback(node.key);
      this.inOrderTraverseNode(node.right, callback);
    }
  }

  /** 先序遍历 */
  preOrderTraverse(callback: Function) {
    // 特点：优先于后代节点的顺序访问每个节点
    // 应用：输出结构化文档
    this.preOrderTraverseNode(this.root, callback);
  }

  private preOrderTraverseNode(node: Node<T> | null, callback: Function) {
    if (node != null) {
      callback(node.key);
      this.preOrderTraverseNode(node.left, callback);
      this.preOrderTraverseNode(node.right, callback);
    }
  }

  /** 后序遍历 */
  postOrderTraverse(callback: Function) {
    // 特点：优先访问后代节点，再访问节点本身
    // 应用：计算一个目录及其子目录中所有文件所占空间大小
    this.postOrderTraverseNode(this.root, callback);
  }

  private postOrderTraverseNode(node: Node<T> | null, callback: Function) {
    if (node != null) {
      this.postOrderTraverseNode(node.left, callback);
      this.postOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }

  /** 查找树中特定的值 */
  search(key: T) {
    return this.searchNode(this.root, key);
  }

  private searchNode(node: Node<T> | null, key: T): boolean {
    if (node == null) {
      return false;
    }
    /**
     * 1. 指定值小于当前值
     * 2. 指定值大于当前值
     * 3. 指定值等于当前值
     */
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      return this.searchNode(node.left, key);
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      return this.searchNode(node.right, key);
    } else {
      return true;
    }
  }

  /** 查找树中的最小值 */
  min() {
    return this.minNode(this.root);
  }

  private minNode(node: Node<T> | null) {
    let current = node;

    while (current != null && current.left != null) {
      current = current.left;
    }

    return current;
  }

  /** 查找树中的最大值 */
  max() {
    return this.maxNode(this.root);
  }

  private maxNode(node: Node<T> | null) {
    let current = node;

    while (current != null && current.right != null) {
      current = current.right;
    }

    return current;
  }

  /** 移除一个元素 */
  remove(key: T) {}
}
```
