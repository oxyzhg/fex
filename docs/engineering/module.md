---
id: module
title: 前端模块化
---

## 什么是模块化

是指将复杂的系统分解成多个独立模块的代码组织方式。

## 常见的模块化方案

- AMD (Asynchronous Module Definition)，即异步模块定义。（require.js）
- CMD (Common Module Definition)，即通用模块定义。（sea.js）
- CommonJS
- ES Module

随着 webpack/rollup/babel 等打包或编译工具在前端大放异彩，AMD/CMD 等传统模块化方案也在逐渐退出历史舞台，现代开发常用的模块化方案是 ES Module 和 CommonJS。

### AMD

AMD(Asynchronous Module Definition)，即异步模块定义，采用异步方式加载模块，模块的加载不影响它后面语句的运行。

特点：

- **依赖前置**，在定义模块的时候就要声明其依赖模块。
- **异步加载其他模块**，在客户端运行的代码，需要从服务端预先加载，因此异步加载是更合理的方案。

代表库 require.js 用法：

```js
// 指定各模块路径和引用名
require.config({
  baseUrl: 'js/lib',
  paths: {
    jquery: 'jquery.min', //实际路径为js/lib/jquery.min.js
    underscore: 'underscore.min',
  },
});

// 加载模块
require(['jquery', 'underscore'], function ($, _) {
  // some code here
});
```

### CMD

CMD(Common Module Definition)，即通用模块定义。

特点：

- **就近依赖**，只有在用到某个模块的时候再去加载。

CMD 与 AMD 的不同点在于：AMD 推崇依赖前置、提前执行，CMD 推崇依赖就近、延迟执行。

代表库 sea.js 用法：

```js
// 定义模块 math.js
define(function (require, exports, module) {
  var $ = require('jquery.js');
  var add = function (a, b) {
    return a + b;
  };
  exports.add = add;
});

// 加载模块
seajs.use(['math.js'], function (math) {
  var sum = math.add(1, 2);
});
```

### CommonJS

CommonJS 就是我们在 nodejs 中见到的模块用法，即：

```js
// 导入
const _ = require('lodash');
// 导出
module.exports = {};
exports.sayHi = () => {};
```

特点：

- **同步加载其他模块**，这是 CommonJS 与 AMD 模块化方案最大的不同之处。由于 CommonJS 规范是为服务端设计，文件在本地都可以直接访问，加载速度很快，所以不需要异步加载，而浏览器需要向服务端发起资源请求加载。
- **运行时加载**，由于这个原因，使用 CommonJS 编写的代码不支持 tree-shaking 优化。
- **模块导出值拷贝**，即一旦输出某个值，模块内部的变化就影响不到这个值。

### ES Module

ES Module 是基于语言层面的模块化解决方案，旨在成为浏览器和服务器通用的模块解决方案，也是 javascript 模块化未来的发展方向，现在主流的浏览器已经支持了。最近较火的 snowpack 和 vite 就是利用浏览器原生支持 ESM 的特点，快速编译构建开发环境可用的代码。如果不考虑低版本浏览器兼容性的话，可用直接在浏览器环境用 ESM 语法了。

```js
// 导入
import lodash from 'lodash';
// 导出
export function hello() {}
export default {};
```

特点：

- **编译时加载**，它具有声明提升效果，可在编译阶段对模块进行静态分析。因此，rollup/webapck 等打包工具都提供了 tree-shaking 优化，用于清除实际上在项目中没有用到的代码，减少构建后代码量，使代码运行更加高效。
- **模块导出值引用**，这是与 CommonJS 的不同之处。

ESM 与 CommonJS 模块化的差异：

1. ES Module 是编译时加载，CommonJS 是运行时加载。
2. ES Module 导出的是值引用， CommonJS 导出的是值拷贝。

## 几种常见的模块化方案对比

模块化方案的对比，通常是加载时机、是否异步、导入导出、运行环境几个方面。特别地，CommonJS 和 ES Module 还需要对比导出值的方式。

| 模块化方案 | 加载               | 同步/异步  | 模块定义       | 模块导入 |
| ---------- | ------------------ | ---------- | -------------- | -------- |
| IFEE       | 取决于代码         | 取决于代码 | IFEE           | 命名空间 |
| UMD        | 取决于代码         | 取决于代码 | IFEE           | 命名空间 |
| AMD        | 预加载             | 异步       | define         | require  |
| CMD        | 按需加载           | 延迟加载   | define         | define   |
| CommonJS   | 值拷贝，运行时加载 | 同步       | module.exports | require  |
| ES Module  | 值引用，编译时输出 | 同步       | export         | import   |

---

参考资料：

- [前端模块化：CommonJS,AMD,CMD,ES6](https://juejin.cn/post/6844903576309858318)
- [浅谈模块化开发](https://juejin.cn/post/6844903581661790216)
