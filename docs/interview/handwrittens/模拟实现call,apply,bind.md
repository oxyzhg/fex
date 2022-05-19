---
id: call-apply-bind
title: 模拟实现call/apply/bind
---

面试对 call/apply/bind 源码实现的考察，实际上是对基础知识的综合考核，相关知识点：作用域、this、函数柯里化、原型与原型链。

## 三者异同点

- 作用都是显示绑定 **this**，改变 this 指向
- `call` 和 `apply` 区别在于传参形式不同
- 第 1 个参数都是执行函数体内 this 的指向；第 2 个参数开始不同， `apply` 是传入参数数组， `call` 是传入参数列表
- `bind` 返回待执行函数，是函数柯里化的应用，而 `call`/`apply` 是立即执行函数

## 模拟实现 call/apply

**call** 方法使用一个具有给定 this 值的函数，以及单独给出的一个或多个参数。
**apply** 方法调用一个具有给定 this 值的函数，以及作为一个数组（或类似数组对象）提供的参数。

### 实现原理

- 待执行函数隐式绑定作用域，改变 this 指向
- 在新作用域中执行函数

```js
func.call(thisArg, arg1, arg2, ...)
func.apply(thisArg, [argsArray])
```

### 实现思路

1. 判断调用实例 (this) 是否为函数类型，若不是则报错
2. 初始化目标对象 (context)
3. 将实例函数以键值对的形式添加到目标对象上，防止键名重复可使用 symbol
4. 在目标对象上执行当前实例函数，并传入其余参数
5. 执行后从目标对象上删除该实例函数
6. 返回函数执行结果

### 代码实现

模拟实现 call：

```js
Function.prototype.mycall = function (context, ...params) {
  // 1.判断实例函数是否为函数类型，this 即实例函数
  if (typeof this !== 'function') {
    throw new TypeError(`${this}.call is not a function`);
  }
  // 2.目标对象初始化
  context = context || window;
  // 防止目标对象参数重复，使用 symbol 生成唯一键值（后续删除）
  const fn = Symbol('fn');
  // 3.this 指向调用对象，即目标对象增加键名为 fn 的函数属性
  context[fn] = this;
  // 4.在目标对象上执行当前实例函数
  const result = context[fn](...params);
  // 5.执行后删除新增的 fn 属性
  delete context[fn];
  // 6.返回执行结果
  return result;
};
```

模拟实现 apply：

```js
Function.prototype.myapply = function (context, params) {
  if (typeof this !== 'function') {
    throw new TypeError(`${this}.apply is not a function`);
  }

  context = context || window;
  const fn = Symbol('fn');
  context[fn] = this;

  const result = context[fn](...params); // 数组传参
  delete context[fn];

  return result;
};
```

## 模拟实现 bind

**bind** 方法创建一个新的函数，在 bind 被调用时，这个新函数的 this 被 bind 的第一个参数指定，其余的参数将作为新函数的参数供调用时使用。

### 实现原理

- 结合 call/apply 给返回函数显示绑定 this
- 返回待执行函数
- 区别 new 方式调用，将原函数的原型绑定到返回函数

```js
func.bind(thisArg, arg1, arg2, ...)
```

### 实现思路

1. 判断调用实例 (this) 是否为函数类型，若不是则报错
2. 保存原函数实例对象 (this)
3. 创建一个空函数作为中介，用于保存函数原型
4. 创建新函数用作闭包返回
   - 判断是否通过 new 调用，是则指向新函数，否则指向之前给定的作用域
   - 返回原函数给定指向和参数后的执行结果
5. 保存实力函数的原型（箭头函数无原型）
6. 将实例函数的原型对象拷贝到新函数中
7. 返回新函数

### 代码实现

```js
Function.prototype.mybind = function (context, ...args) {
  // 1.判断实例函数是否为函数类型，this 即实例函数
  if (typeof this !== 'function') {
    throw new TypeError(`${this}.bind is not a function`);
  }
  // 2.保存原函数实例对象
  const self = this;
  // 3.创建一个纯净函数，用于保存函数原型
  const fNOP = function () {};
  // 4.创建新函数用作闭包返回
  const fbound = function () {
    // 判断是否通过new调用函数
    // 是 -> this 指向其实例
    // 否 -> this 指向显示指向的目标对象
    return self.apply(this instanceof fNOP ? this : context, params.concat(arguments));
  };
  // 5.保存实例函数的原型对象
  if (this.prototype) {
    fNOP.prototype = this.prototype;
  }
  // 6.将实例函数的原型对象拷贝到新函数中
  fbound.prototype = new fNOP();
  // 7.返回新函数，由外部按需引入
  return fbound;
};
```

注意：

1. `new` 操作符能够访问构造函数内的属性，并且通过 `new` 方式绑定的 this 优先级高于显示绑定。所以通过 `new` 方式调用时，this 指向原函数。
2. 原函数如果是箭头函数，则不存在原型，因此改变 fNOP 原型时要先判断。

## 总结

call/aplly/bind 本质都是改变 **this** 的指向，不同点是立即调用还是返回可执行函数。

---

参考：

- [各种源码实现，你想要的这里都有](https://juejin.im/post/5dc3894051882517a652dbd7)
- [2 万字|前端基础拾遗 90 问](https://juejin.im/post/5e8b261ae51d4546c0382ab4#heading-3)
