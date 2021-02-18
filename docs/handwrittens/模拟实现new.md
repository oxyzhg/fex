---
id: new
title: 模拟实现new
---

> new 运算符 创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。 ——MDN

通过 new 创建的实例有 2 个特性：

1. 访问构造函数里的属性
2. 访问原型里的属性

### 实现思路

1. 基于构造函数创建一个新对象，该对象的原型指向构造函数原型
2. 使用指定参数执行构造函数，并将 this 绑定到新建对象
3. 判断构造函数执行结果，如果是对象类型则使用第一步创建的对象，否则返回执行结果

### 代码实现

```js
/**
 * 模拟 new 关键字
 * @param {function} Ctor 构造函数
 * @param {array} params 构造函数参数
 * @returns {object}
 */
function _new(Ctor, ...params) {
  const context = Object.create(Ctor.prototype);

  const result = Ctor.apply(context, params);

  // 判断构造函数是否返回对象
  return typeof result === 'object' && result !== null ? result : context;
}
```

构造函数返回值的三种情况：

1. 返回一个对象【只能访问到返回对象中的属性】

```js
function Car(color, name) {
  this.color = color;
  return {
    name: name,
  };
}

var car = new Car('black', 'BMW');
car.color; // undefined
car.name; // "BMW"
```

2. 没有 return 即返回 undefined【只能访问到构造函数中的属性】

```js
var car = new Car('black', 'BMW');
car.color; // black
car.name; // undefined
```

3. 返回 undefined 以外的基本类型【只能访问到构造函数中的属性，结果相当于没有返回值】

```js
function Car(color, name) {
  this.color = color;
  return 'new car';
}

var car = new Car('black', 'BMW');
car.color; // black
car.name; // undefined
```

因此，需要判断返回值是不是一个对象，如果是对象就返回该对象，如果不是对象就返回新创建的对象。

注意：ES6 新增 `symbol` 类型，不可以使用 `new Symbol()`，因为 `symbol` 是基本数据类型，每个从 `Symbol()` 返回的值都是唯一的。
