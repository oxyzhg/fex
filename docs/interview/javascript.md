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

### Object.is() 与比较操作符 "==="、"==" 的区别？

- 使用双等叛等，比较时先进行类型转换再比较。
- 使用全等叛等，比较时不会进行类型转换。
- Object.is 在全等的基础上处理了特殊情况，`±0` 不再相等、两个 `NaN` 相等。

### parseInt 和 Number 的返回结果都是数字，它们之间的区别是什么？

使用 `parseInt()` 解析字符串，解析按从左到右的顺序，如果遇到非数字字符就停止。而使用 `Number()` 强制转换字符串，如果字符串含有非数字字符会失败并返回 `NaN`。

详细资料可以参考：

- [详解 JS 中 Number()、parseInt() 和 parseFloat() 的区别](https://blog.csdn.net/m0_38099607/article/details/72638678)
- [parseInt - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)
- [parseFloat - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)

### 为什么 0.1 + 0.2 != 0.3？如何解决这个问题？

JavaScript 中的小数默认遵循 [IEEE 754](https://baike.baidu.com/item/IEEE%20754) 标准，双精度浮点数使用 64 位固定长度来表示，符号位占 1 位，指数位占 11 位，小数位占 52 位。0.1 转换为二进制计算时精度丢失。

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

### JavaScript 的作用域链？

作用域链的作用是保证对执行环境中有权访问的所有变量和函数的有序访问，通过作用域链，我们可以访问到外层环境的变量和函数。

作用域链的本质上是一个指向变量对象的指针列表。变量对象是一个包含了执行环境中所有变量和函数的对象。作用域链的创建过程跟执行上下文的建立有关，执行上下文栈顶是当前执行上下文，栈底永远是全局执行上下文。

当我们查找一个变量时，如果当前执行环境中没有找到，我们可以沿着作用域链向后查找。作用域链的创建过程跟执行上下文的建立有关。

### 谈谈对 this 对象的理解。

this 是执行上下文中的一个属性，**它指向最后调用它的那个对象**。在实际开发中，this 指向的绑定有以下四种情况：

1. 默认绑定：函数直接被调用，this 指向 window/undefined。
2. 隐式绑定：函数作为对象的方法被调用，this 指向这个对象。
3. 显示绑定：函数通过 call/apply/bind 方法调用，this 指向被绑定的对象。
4. new 绑定：函数通过 new 关键字调用，this 指向新构造出来的那个对象。

### 事件委托是什么？

事件委托本质上是利用了浏览器事件冒泡的机制。因为事件在冒泡过程中会上传到父节点，并且父节点可以通过事件对象获取到目标节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件，这种方式称为事件代理。使用事件代理我们可以不必要为每一个子元素都绑定一个监听事件，这样减少了内存上的消耗。并且使用事件代理我们还可以实现事件的动态绑定，比如说新增了一个子节点，我们并不需要单独地为它添加一个监听事件，它所发生的事件会交给父元素中的监听函数来处理。

详细资料可以参考：

- [JavaScript 事件委托详解](https://zhuanlan.zhihu.com/p/26536815)

### 什么是闭包，为什么要用它？

闭包是指**有权访问另一个函数作用域中变量的函数**。闭包的本质是作用域链的一个特殊的应用。创建闭包的最常见的方式就是在一个函数内创建另一个函数，创建的函数可以访问到当前函数的局部变量。

闭包有两个常用的用途：

1. 在函数外部能够访问到函数内部的变量。我们可以通过在外部调用闭包函数，从而在外部访问到函数内部的变量，可以使用这种方法来创建私有变量。
2. 使已经运行结束的函数上下文中的变量对象继续留在内存中。因为闭包函数保留了这个变量对象的引用，所以这个变量对象不会被回收。

### new 操作符具体干了什么？如何实现？

1. 创建一个空对象
2. 设置空对象的原型，即构造函数的原型
3. 执行构造函数创建实例，并显式更改实例 this 执行空对象
4. 判断执行结果数据类型，返回结果

```js
function _new(Ctor, ...args) {
  const target = Object.create(Ctor.prototype);
  const result = Ctor.apply(target, args);
  return result !== null && (typeof result === 'object' || typeof result === 'function')
    ? result
    : target;
}
```

### Ajax 是什么? 如何创建一个 Ajax？

Ajax 是一种异步通信的方法，通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。

创建一个 Ajax 请求有以下几个步骤：

1. 创建 XMLHttpRequest 实例，包括为实例添加监听函数、设置请求头信息等
2. 发出 HTTP 请求
3. 接收服务器传回的数据
4. 更新网页数据

```js
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
  // 通信成功时，状态值为4
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    } else {
      console.error(xhr.statusText);
    }
  }
};

xhr.onerror = function (e) {
  console.error(xhr.statusText);
};

xhr.open('GET', '/endpoint', true);
xhr.send(null);
```

详细资料可以参考：

- [XMLHttpRequest 对象](https://wangdoc.com/javascript/bom/xmlhttprequest.html)

### 同步和异步的区别？

同步指的是当一个进程在执行某个请求的时候，如果这个请求需要等待一段时间才能返回，那么这个进程会一直等待下去，直到消息返回为止再继续向下执行。

异步指的是当一个进程在执行某个请求的时候，如果这个请求需要等待一段时间才能返回，这个时候进程会继续往下执行，不会阻塞等待消息的返回，当消息返回时系统再通知进程进行处理。

### 什么是前端模块化？

模块化是为了更好的组织代码和资源。常见的模块化方案有：AMD、CMD、UMD、CommonJS、ES Module 等，现代开发中后两种更常见。

AMD/CMD 的区别在于：AMD 推崇依赖前置、提前执行；CMD 推崇依赖就近、延迟执行。

CommonJS/ESM 的区别在于：CommonJS 是运行时加载，导出的是值拷贝；ESM 是编译时加载，导出的是值引用。

### DOM 操作——怎样添加、移除、移动、复制、创建和查找节点？

```js
// 创建新节点
createDocumentFragment(node);
createElement(node);
createTextNode(text);
// 添加、删除、替换、插入
appendChild(node);
removeChild(node);
replaceChild(new,old);
insertBefore(new,old);
// 查找
getElementById();
getElementsByName();
getElementsByTagName();
getElementsByClassName();
querySelector();
querySelectorAll();
// 属性操作
getAttribute(key);
setAttribute(key,value);
hasAttribute(key);
removeAttribute(key);
```

### JavaScript 类数组对象的定义？

一个拥有 **length 属性**和若干**索引属性**的对象就可以被称为类数组对象，类数组对象和数组类似，但是不能调用数组的方法。常见的类数组对象有 arguments 和 DOM 方法的返回结果，还有一个函数也可以被看作是类数组对象，因为它含有 length 属性值，代表可接收的参数个数。

### 如何理解作用域与变量声明提升？

造成变量声明提升的本质原因是 js 引擎在代码执行前有一个解析的过程，创建了执行上下文，初始化了一些代码执行时需要用到的对象。当我们访问一个变量时，我们会到当前执行上下文中的作用域链中去查找，而作用域链的首端指向的是当前执行上下文的变量对象，这个变量对象是执行上下文的一个属性，它包含了函数的形参、所有的函数和变量声明，这个对象的是在代码解析的时候创建的。这就是会出现变量声明提升的根本原因。

### 简单介绍一下 V8 引擎的垃圾回收机制

v8 的垃圾回收机制基于分代回收机制，将内存分为新生代和老生代，分别由副垃圾回收器和主垃圾回收器进行标记清除。

对于新生代对象，存储区域分为对象区域和空闲区域，数据一般存储在对象区域。当对象区域空间存满，执行 Scavenge 算法进行垃圾回收。首先，检查对象区域的存活对象，标记垃圾数据；然后，将存活对象有序复制到空闲区域，释放对象区域空间；最后，对调对象区域和空闲区域。

对于老生代对象，采用了标记清除法进行垃圾清理。首先，标记内存中存活的对象；然后，清除掉垃圾数据；最后，进行内存整理，处理内存碎片。

### 哪些操作会造成内存泄漏？

- 意外的全局变量
- 未清除的定时器或事件监听回调
- 脱离 DOM 的引用
- 闭包

### JavaScript 的事件循环是什么？

时间循环（EventLoop）是一个避免 JavaScript 单线程执行可能阻塞的机制。代码在执行过程中，通过创建不同的执行上下文，并压入执行栈中，保证代码的有序执行。执行如果遇到异步任务，线程不会等待异步任务返回结果，而是先将该事件挂起，继续执行其他任务。当异步事件有了返回结果，将其回调函数注册到相应的任务队列等待执行。

任务队列通常分为宏任务队列和微任务队列，当执行栈空闲时，引擎会先检查微任务队列是否存在待执行任务，如果存在则依次执行微任务队列中所有任务，直到微任务队列被清空；如果微任务队列为空，则继续执行宏任务队列中的任务。每轮事件循环结束都会清空微任务队列，这样就保证了一些优先级较高的任务先执行。

（列举常见的宏任务、微任务事件）

### 模拟实现防抖与节流？

```js
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimerout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

function throttle(fn, delay) {
  let previous = 0;
  return function (...args) {
    let now = +new Date();
    if (now - previous > delay) {
      fn.apply(this, args);
      previous = now;
    }
  };
}
```

### 模拟实现深拷贝？

```js
function cloneDeep(obj, map = new Map()) {
  if (obj === null || typeof obj !== 'obj') return obj;
  if (map.has(obj)) return map.get(obj);
  let cloneTarget = new obj.constructor();
  map.set(obj, cloneTarget);
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneTarget[key] = cloneDeep(obj[key], map);
    }
  }
}
```

### 模拟实现 call/apply/bind？

```js
Function.prototype._call = function (context, ...params) {
  if (typeof this !== 'function') {
  }
  context = context || window;
  const fn = Symbol('fn');
  context[fn] = this;
  const result = context[fn](...params);
  delete context[fn];
  return result;
};

Function.prototype._apply = function (context, params) {
  if (typeof this !== 'function') {
  }
  context = context || window;
  const fn = Symbol('fn');
  context[fn] = this;
  const result = context[fn](...params);
  delete context[fn];
  return result;
};

Function.prototype._bind(context, ...params) {
  if (typeof this !== 'function'){}
  const self = this;
  const fNOP = function() {}
  const fBound = function(...bindArgs) {
    return self.apply(this instanceof fNOP ? this : context, params.concat(bindArgs));
  }
  if (this.prototype) {
    fNOP.prototype = Object.create(this.prototype);
  }
  fBound.prototype = new fNOP();
  return fBound;
}
```
