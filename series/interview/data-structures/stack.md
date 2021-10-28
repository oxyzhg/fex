---
id: stack
title: 栈
---

特点：先进后出

### 实例方法

- `push` --- 向栈顶添加新元素
- `pop` --- 移除栈顶元素，返回被移除的元素
- `peek` --- 查看栈顶元素
- `clear` --- 清空栈
- `isEmpty` --- 查看栈是否为空
- `size` --- 查看栈中元素个数

### 模拟实现

```typescript
class Stack<T> {
  protected items: T[];

  constructor() {
    this.items = [];
  }

  /** 向栈顶添加新元素 */
  push(element: T) {
    this.items.push(element);
  }

  /** 移除栈顶元素 */
  pop() {
    return this.items.pop();
  }

  /** 查看栈顶元素 */
  peek() {
    return this.items[this.items.length - 1];
  }

  /** 清空栈 */
  clear() {
    this.items = [];
  }

  /** 检查栈是否为空 */
  isEmpty() {
    return this.items.length === 0;
  }

  /** 栈中元素个数 */
  size() {
    return this.items.length;
  }
}
```

总结：常见的栈结构，可直接由数组模拟实现。
