---
id: linked-list
title: 链表
---

特点：存在首项，通过一个关联的指针连接。

### 实例方法

- `push` --- 向链表尾部添加元素
- `insert` --- 向指定位置添加元素，返回是否执行成功
- `remove` --- 移除链表中的一个元素，并返回被移除的元素
- `removeAt` --- 移除指定位置的元素，并返回被移除的元素
- `getElementAt` --- 查看指定位置的元素
- `indexOf` --- 查看元素在链表中的位置
- `getHead` --- 查看链表的第一个元素
- `isEmpty` --- 查看链表是否为空
- `size` --- 查看链表元素个数

### 模拟实现

```typescript
/**
 * 元素
 */
class CNode<T> {
  protected element: T;
  protected next: CNode<T> | null;

  constructor(element: T) {
    this.element = element;
    this.next = null;
  }
}

/**
 * 链表结构
 */
class LinkedList<T> {
  protected count: number;
  protected head: CNode<T> | null; // 链表中的第一个值
  protected equalsFn: Function;

  constructor() {
    this.count = 0;
    this.head = null;
    this.equalsFn = defaultEquals;
  }

  /** 向链表尾部添加元素 */
  push(element: T) {
    const node = new CNode(element);
    /**
     * 1. 链表为空，直接修改 head 指向
     * 2. 链表不为空，通过递归找到尾项，并把尾项的下一项指向新元素
     */
    if (this.head === null) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next !== null) {
        current = current.next; // 找到链表的最后一个元素
      }
      current.next = node;
    }
    this.count++;
  }

  /** 向指定位置添加元素 */
  insert(element: T, position: number) {
    if (position >= 0 && position < this.count) {
      const node = new CNode(element);

      /**
       * 1. 向头部插入元素，要修改 head 属性
       * 2. 向非头部插入元素，找到索引前一个元素和索引元素，并修改他们的关联关系
       */
      if (position === 0) {
        node.next = this.head;
        this.head = node;
      } else {
        let previous = this.getElementAt(position - 1);
        let current = previous.next;
        node.next = current;
        previous.next = current;
      }

      this.count++;
      return true;
    }

    return false;
  }

  /** 移除链表中的一个元素 */
  remove(element: T) {
    const index = this.indexOf(element);

    if (index > -1) {
      return this.removeAt(index);
    }

    return undefined;
  }

  /** 移除指定位置的元素 */
  removeAt(index: number) {
    if (index >= 0 && index < this.count) {
      let current = this.head;
      if (index === 0) {
        this.head = current.next;
      } else {
        let previous;
        for (let i = 0; i < index; i++) {
          previous = current;
          current = current.next;
        }
        previous.next = current.next;
        this.count--;
      }
      return current;
    }

    return undefined;
  }

  /** 查看指定位置的元素 */
  getElementAt(index: number) {
    if (index >= 0 && index < this.count) {
      let current = this.head;

      // 递归，直到索引对应元素出现
      for (let i = 0; i < index; i++) {
        current = current.next;
      }

      return current;
    }

    return undefined;
  }

  /** 查看元素在链表中的位置 */
  indexOf(element: T) {
    let current = this.head;

    for (let i = 0; i < this.count; i++) {
      if (this.equalsFn(current.element, element)) {
        return i;
      }
      current = current.next;
    }

    return -1;
  }

  /** 查看链表的第一个元素 */
  getHead() {
    return this.head;
  }

  /** 查看链表是否为空 */
  isEmpty() {
    return this.head === null;
  }

  /** 查看链表元素的个数 */
  size() {
    return this.count;
  }
}
```

总结：操作链表主要特别注意的点是 head 和操作元素前后的相关元素，另外可通过 count 判断操作索引是否越界。
