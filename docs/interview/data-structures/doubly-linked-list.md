---
id: doubly-linked-list
title: 双向链表
---

特点：存在首项和尾项，通过两个指针关联前后的元素。

### 实例方法

对比单项链表，需要特别关注以下方法：

- `insert` --- 向指定位置添加元素，返回是否执行成功
- `remove` --- 移除指定位置的元素，并返回被移除的元素

### 模拟实现

```typescript
/**
 * 元素
 */
class DoublyNodes<T> {
  protected element: T;
  protected prev: DoublyNodes<T> | null;
  protected next: DoublyNodes<T> | null;

  constructor(element: T) {
    this.element = element;
    this.prev = null;
    this.next = null;
  }
}

/**
 * 链表结构
 */
class DoublyLinkedList<T> {
  protected count: number;
  protected head: DoublyNodes<T> | null; // 链表中的第一个值
  protected tail: DoublyNodes<T> | null; // 链表中的最后一个值
  protected equalsFn: Function;

  constructor() {
    this.count = 0;
    this.head = null;
    this.tail = null;
    this.equalsFn = defaultEquals;
  }

  /** 向指定位置添加元素 */
  insert(element: T, index: number) {
    if (index >= 0 && index < this.count) {
      const node = new DoublyNodes(element);
      let current = this.head;

      /**
       * 1. 头部插入新元素，若是空链表，则修改 head,tail 指向，否则修改前后关联关系
       * 2. 尾部插入新元素，修改前后关联关系，修改 tail 指向
       * 3. 中间插入新元素，查找索引对应元素，修改前后关联关系
       */
      if (index === 0) {
        if (this.head === null) {
          // NEW
          this.head = node;
          this.tail = node;
        } else {
          node.next = this.head;
          this.head.prev = node; // NEW
          this.head = node;
        }
      } else if (index === this.count) {
        current = this.tail;
        current.next = node;
        node.prev = current;
        this.tail = node;
      } else {
        const previous = this.getElementAt(index - 1);
        current = previous.next;
        previous.next = node;
        node.prev = previous;
        node.next = current;
        current.prev = node;
      }

      this.count++;
      return true;
    }

    return false;
  }

  /** 移除指定位置的元素 */
  removeAt(index: number) {
    if (index >= 0 && index < this.count) {
      let current = this.head;

      /**
       * 1. 头部删除元素，将 head 指向第二项元素，若本身仅有一项，移除后链表为空，将 tail 也置空，否则将 head 前一项置空，表示头部
       * 2. 尾部删除元素，将 tail 指向倒数第二项元素，并将下一项置空，表示尾部
       * 3. 中间删除元素，修改前后关联关系
       */
      if (index == 0) {
        this.head = current.next;
        if (this.count === 1) {
          this.tail = null;
        } else {
          this.head.prev = null;
        }
      } else if (index === this.count) {
        current = this.tail;
        this.tail = current.prev;
        this.tail.next = null;
      } else {
        let previous = this.getElementAt(index - 1);
        current = previous.next;
        previous.next = current.next;
        current.next.prev = previous;
      }

      this.count--;
      return current;
    }

    return undefined;
  }

  /** 查看指定位置的元素 */
  getElementAt(index: number) {
    if (index >= 0 && index < this.count) {
      let current = this.head;

      for (let i = 0; i < index; i++) {
        current = current.next;
      }

      return current;
    }

    return undefined;
  }
}
```

总结：与单项链表的不同之处，处理关联关系的时候需要处理前后两个指针。
