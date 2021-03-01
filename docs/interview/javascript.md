---
id: javascript
title: JavaScript 面试相关总结
---

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

### 数据类型有哪些？你能画一下他们的内存图吗？

JavaScript 值可以分为两种类型，一种是基本数据类型，一种是复杂数据类型。

- 基本数据类型：`Number`, `String`, `Boolean`, `Undefined`, `Null`, `Symbol`, `BigInt`
- 复杂数据类型：`Object`

两种类型的主要区别是：存储位置不同。基本数据类型直接存储在栈（stack）中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储。复杂数据类型存储在堆（heap）中的对象，占据空间大、大小不固定。如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

### undefined 和 null 的异同点？

- `undefined` 和 `null` 都是基本数据类型，且都属于 falsy 类型。
- `undefined` 表示一个变量没有被声明，或者已声明但未赋值，即缺少值；而 `null` 表示变量已声明但值为空，即该处不应该有值。

特殊场景的运算结果如下：

```js
undefined == null; // true
undefined === null; // false
typeof undefined; // undefined
typeof null; // object
Object.is(undefined); // true
Object.is(null); // false
Number(undefined); // NaN
Number(null); // 0
parseInt(undefined); // NaN
parseInt(null); // NaN
```

### 原型，原型链？ 有什么特点？

在 js 中我们是使用构造函数来新建一个对象的，每一个构造函数的内部都有一个 `prototype` 属性值，这个属性值是一个对象，这个对象包含了可以由该构造函数的所有实例共享的属性和方法。当我们使用构造函数新建一个对象后，在这个对象的内部将包含一个指针，这个指针指向构造函数的 `prototype` 属性对应的值，在 ES5 中这个指针被称为对象的原型。尽管现代浏览器中都提供了 `__proto__` 属性让我们可以访问到实例原型，但这不符合规范。ES5 中新增了 `Object.getPrototypeOf()` 方法，我们可以通过这个方法来获取对象实例的原型。在属性确认存在的情况下，可以使用 `Object.hasOwnProperty()` 方法来判断一个属性是存在与实例中，还是存在于原型中。

当我们访问一个对象的属性时，如果这个对象内部不存在这个属性，那么它就会去它的原型对象里找这个属性，这个原型对象又存在自己的原型，于是就这样递归找下去，这就是原型链的概念。

构造函数、原型对象、实例之间的关系：

```js
function Person() {}
const people = new Person();

// 构造器
Person.prototype.constructor === Person; // true
Person.__proto__ === Function.prototype; // true
Function.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null; // true

// 实例
people.__proto__ === Person.prototype; // true
Person.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ === null; // true
```

### isNaN 和 Number.isNaN 函数的区别？

函数 `isNaN` 接收参数后，会尝试将这个参数转换为数值，任何不能被转换为数值的的值都会返回 true，因此非数字值传入也会返回 true ，会影响 `NaN` 的判断。

函数 `Number.isNaN` 会首先判断传入参数是否为数字，如果是数字再继续判断是否为 `NaN` ，这种方法判断更为准确。

### 其他值到字符串的转换规则？

（1）Null 和 Undefined 类型，null 转换为"null"，undefined 转换为"undefined"，
（2）Boolean 类型，true 转换为"true"，false 转换为"false"。
（3）Number 类型的值直接转换，不过那些极小和极大的数字会使用指数形式。
（4）Symbol 类型的值直接转换，但是只允许显式强制类型转换，使用隐式强制类型转换会产
生错误。
（3）对普通对象来说，除非自行定义 toString() 方法，否则会调用 toString()
（Object.prototype.toString()）来返回内部属性[[Class]] 的值，如"[object
Object]"。如果对象有自己的 toString() 方法，字符串化时就会调用该方法并使用其返回值。

1. Undefined 类型的值转换为 `undefined`；
2. Null 类型的值转换为 `null`；
3. Boolean 类型的值，true 转换为 `true`，false 转换为 `false`；
4. Number 类型的值直接转换，不过那些极小和极大的数字会使用指数形式；
5. Symbol 类型的值直接转换，但是只允许显式强制类型转换，使用隐式强制类型转换会产生错误；
6. 对象类型的值，除非自定义 `toString` 方法，否则会调用 `Object.prototype.toString` 来返回内部属性 `[[Class]]` 的值，如 `"[object Object]"`。

### 其他值到数字值的转换规则？

1. Undefined 类型的值转换为 `NaN`；
2. Null 类型的值转换为 `0`；
3. Boolean 类型的值，true 转换为 `1`，false 转换为 `0`；
4. String 类型的值，如果包含非数字类型的值则转换为 `NaN`，空字符串转换为 `0`；
5. Symbol 类型的值不能转换，会报错；
6. 对象类型的值首先被转换为相应的基本类型值，如果返回的是非数字的基本类型值，则再遵循以上规则将其强制转换为数字。为了将值转换为相应的基本类型值，会依次调用 `[Symbol.toPrimitive]`, `valueOf`, `toString` 方法，如果上述方法均未返回基本类型的值则报错。

引用类型的转换规则演示：

```js
var obj = {
  [Symbol.toPrimitive]() {
    return '998';
  },
  valueOf() {
    return '997';
  },
  toString() {
    return '996';
  },
};

Number(obj); // 998
```

### 其他值到布尔类型的值的转换规则？

除定义的假值 `undefined`, `null`, `false`, `±0`, `NaN`, `''` 以外的都应该是真值。

### == 操作符的强制类型转换规则？

1. 如果类型相同，无须进行类型转换；
2. 如果其中一个操作值是 `null/undefined`，那么另一个操作符也必须为 `null/undefined` 才会返回 true，否则返回 false；
3. 如果其中一个是 Symbol 类型，那么返回 false；
4. 两个操作值如果为 String 和 Number 类型，那么将字符串转换为 Number 类型；
5. 如果一个操作值是 Boolean 类型，那么将布尔值转换为 Number 类型；
6. 如果一个操作值是引用类型，另一个是 String/Number/Symbol 类型，那么将引用类型值转为原始类型再进行判断。

一般来说，隐式转换大多数最终都会转换为**数值型**进行比较。

### parseInt 和 Number 的返回结果都是数字，它们之间的区别是什么？

使用 `parseInt()` 解析字符串，解析按从左到右的顺序，如果遇到非数字字符就停止。而使用 `Number()` 强制转换字符串，如果字符串含有非数字字符会失败并返回 `NaN`。

详细资料可以参考：

- [详解 JS 中 Number()、parseInt() 和 parseFloat() 的区别](https://blog.csdn.net/m0_38099607/article/details/72638678)
- [parseInt - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
- [parseFloat - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)

### + 操作符什么时候用于字符串的拼接？

简单来说就是，如果+ 的其中一个操作数是字符串（或者通过以上步骤最终得到字符串），则执行字符串拼接，否则执行数字加法。

### 如何将浮点数点左边的数每三位添加一个逗号

```js
function format(num) {
  return num && String(num).replace(/(\d)(?=(?:\d{3})+(?:\.\d+)?$)/g, '$1,');
}
```

详细资料可以参考：

- [JS 正则之正向预查与数字转换千分位](https://gaopinghuang0.github.io/2020/10/23/JS-regexp-number-conversion)
- [前端表单验证常用的 15 个 JS 正则表达式](http://caibaojian.com/form-regexp.html)
- [JS 常用正则汇总](https://www.jianshu.com/p/1cb5229325a7)

### JavaScript 继承的几种实现方式？

原型链继承、构造函数继承、组合继承、寄生式继承、寄生组合式继承、ES6 extends 继承等。
