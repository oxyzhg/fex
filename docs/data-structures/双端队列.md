---
id: deque
title: 双端队列
---

特点：前后两端都可以增删的特殊队列

### 实例方法

- `addFront` --- 向队首添加新元素
- `addBack` --- 向队尾添加新元素
- `removeFront` --- 移除队首元素，并返回被移除的元素
- `removeBack` --- 移除队尾元素，并返回被移除的元素
- `peekFront` --- 查看队首元素
- `peekBack` --- 查看队尾元素
- `clear` --- 清空队列
- `isEmpty` --- 查看队列是否为空
- `size` --- 查看队列元素个数

### 模拟实现

```typescript
class Deque<T> {
  private count: number;
  private lowestCount: number;
  private items: any;

  constructor() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }

  /** 向队首添加新元素 */
  addFront(element: T) {
    if (this.isEmpty()) {
      this.addBack(element);
    } else if (this.lowestCount > 0) {
      this.lowestCount--;
      this.items[this.lowestCount] = element;
    } else {
      // lowestCount=0 的情况
      for (let i = this.count; i > 0; i--) {
        this.items[i] = this.items[i - 1];
      }
      this.count++;
      this.lowestCount = 0;
    }
  }

  /** 向队尾添加新元素 */
  addBack(element: T) {
    this.items[this.count] = element;
    this.count++;
  }

  /** 移除队首元素 */
  removeFront() {
    if (this.isEmpty()) {
      return undefined;
    }
    const element: T = this.items[this.lowestCount];
    delete this.items[this.lowestCount];
    this.lowestCount++;
    return element;
  }

  /** 移除队尾元素 */
  removeback() {
    if (this.isEmpty()) {
      return undefined;
    }
    const element: T = this.items[this.count - 1];
    delete this.items[this.count];
    this.count++;
    return element;
  }

  /** 查看队首元素 */
  peekFront() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }

  /** 查看队尾元素 */
  peekBack() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.count - 1];
  }

  /** 查看队列是否为空 */
  isEmpty() {
    return this.count === this.lowestCount;
  }

  /** 清空队列 */
  clear() {
    while (this.lowestCount !== this.count) {
      this.removeback();
    }
  }
}
```