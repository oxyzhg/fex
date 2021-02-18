---
id: instanceof
title: 模拟实现instanceof
---

### 实现思路

当前值的原型链上是否存在与对比构造函数原型相等，即存在 `value.__proto__ === Ctor.prototype`，**实际上是实例原型与构造函数原型的对比**。

### 代码实现

```js
function isInstanceOf(value, Ctor) {
  let prototype = Ctor.prototype;
  let proto = value.__proto__;

  // 递归向上查找 __proto__
  while (proto != null) {
    if (proto === prototype) return true;
    proto = proto.__proto__;
  }

  return false;
}
```
