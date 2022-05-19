---
id: queue
title: 队列
---

特点：先进先出

### 实例方法

- `enqueue` --- 向队尾添加新元素
- `dequeue` --- 移除队首元素，并返回被移除的元素
- `peek` --- 查看队首元素
- `clear` --- 清空队列
- `isEmpty` --- 查看队列是否为空
- `size` --- 查看队列元素个数

### 模拟实现

```typescript
class Queue<T> {
  private count: number;
  private lowestCount: number;
  private items: any;

  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  /** 向队尾添加新元素 */
  enqueue(element: T) {
    this.items[this.count] = element;
    this.count++;
  }

  /** 移除队首元素 */
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    const element = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return element;
  }

  /** 查看队首元素 */
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }

  /** 清空队列 */
  clear() {
    while (this.count !== this.lowestCount) {
      this.dequeue();
    }
  }

  /** 查看队列是否为空 */
  isEmpty() {
    return this.count === this.lowestCount;
  }

  /** 查看队列元素个数 */
  size() {
    return this.count - this.lowestCount;
  }
}
```

总结：常见的队列结构，跟栈类似，可以使用数组模拟实现。这里采用另一种形式，通过标记队列开头和结尾两个游标，维护一个类似数组的对象，动态改变游标来模拟实现。
