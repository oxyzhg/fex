---
id: inheritance
title: 继承
---

实现继承的方法，大多是获得父类的实例或原型的属性和方法。下面几种方法，会通过不同的方式获得父类的属性和方法，继承到当前子类，从而实现继承。

```js
// 定义父类，用于后续测试
function Super(name) {
  this.name = 'super name';
  this.sayHi = function () {
    console.log(`Hi, ${this.name}`);
  };
}
Super.prototype.sayBye = function () {
  console.log(`Bye, ${this.name}`);
};
```

## 原型链继承

实现原理：将父类的实例作为子类的原型

```js
function Sub() {}
Sub.prototype = new Super();
Sub.prototype.name = 'sub name';

// test
var sub = new Sub();
console.log(sub);
console.log(sub instanceof Super); //true
console.log(sub instanceof Sub); //true
```

特点：

1. 定义子类时实现继承，无法动态向父类传参
2. 实例是子类的实例，父类的实例不合理地挂在子类原型上，父类实例属性和方法所有子类实例共享
3. 无法实现多继承
4. 要给子类新增原型方法/属性，必须在 `new Super()` 之后执行，不能放到构造器中

## 构造函数继承

实现原理：执行父类构造函数来增强子类实例

```js
function Sub(name) {
  Super.call(this);
  this.name = name || 'sub name';
}

// test
var sub = new Sub();
console.log(sub);
console.log(sub instanceof Super); // false
console.log(sub instanceof Sub); // true
```

特点：

1. 实例化子类时实现继承，可以动态向父类传参
2. 实例是子类的实例，也是父类的实例，但没有继承父类原型的属性和方法
3. 可以实现多继承

## 组合继承

实现原理：是原型链继承和构造函数继承的组合

```js
function Sub(name) {
  Super.call(this);
  this.name = name || 'sub name';
}
Sub.prototype = new Super();

// test
var sub = new Sub();
console.log(sub);
console.log(sub instanceof Super); // true
console.log(sub instanceof Sub); // true
```

特点：

1. 定义子类时继承了父类原型，实例化子类时继承了父类的实例，可以动态向父类传参
2. 实例是子类的实例，也是父类的实例

原型链继承、构造函数继承、组合继承总结：

- 原型链继承，子类原型是父类实例，父类实例不合理地出现在子类原型，实例原型的原型才是父类构造函数原型，相当于额外多一层。
- 构造函数是执行父类增强子类，可以向父类传参，这个过程继承了父类实例。
- 组合继承没有彻底解决问题。

## 寄生式继承

实现原理：实例化父类，修改属性后返回

```js
function Sub(name) {
  var result = new Super();
  result.name = name || 'Tom';
  return result;
}

// test
var sub = new Sub();
console.log(sub);
console.log(sub instanceof Super); // true
console.log(sub instanceof Sub); // false
```

特点：

1. 实例化子类时实现继承，可以动态向父类传参
2. 实例实际上是父类的实例，子类跟原型没有什么关系

## 寄生组合式继承

实现原理：父类的原型和实例分开继承，将父类的原型作为子类的原型，执行父类构造函数来增强子类实例（完美继承）

```js
function Sub(name) {
  Super.call(this); // 只继承父类实例
  this.name = name || 'Tom';
}
Sub.prototype = Object.create(Super.prototype); // 只继承父类原型
Sub.prototype.constructor = Sub;

// test
var sub = new Sub();
console.log(sub);
console.log(sub instanceof Super); // true
console.log(sub instanceof Sub); // true
```

特点:

1. 定义子类时继承了父类原型，实例化子类时继承了父类的实例，可以动态向父类传参
2. 分别继承父类的原型和实例，继承方式没有副作用

## ES6 extends

ES6 extends 关键字实际上就是寄生组合式继承的语法糖。
