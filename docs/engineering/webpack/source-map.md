---
id: source-map
title: Source Map 配置分析
---

## 使用场景

对于开发环境，通常希望更快速的 source map，需要添加到 bundle 文件以增加体积为代价；对于生产环境，通常希望更精确的 source map，需要从 bundle 中分离并独立存在，并且尽量保证 rebuild 速度。

## 关键字分析

书写格式 `[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map`

关键字说明：

- **source-map**: 非 cheap, eval 修饰的类型，最终都会生成 .map 文件，并在 bundle 文件中添加引用注释。
- **eval**: 使用 eval 函数包裹源代码。该关键字不会生成单独的 .map 文件。
- **cheap**: 没有列映射(column mapping)的 source map，忽略 loader source map。
- **inline**: 不会生成单独的 .map 文件，与形如 eval-\* 类型生成的代码类似都会添加到 bundle 中。
- **module**: 将 loader source map 简化为每行一个映射(mapping)。
- **hidden**: 生成 source map 文件，但不会为 bundle 增加引用注释。

注意点：

- eval, inline 都可以看作是 source map 的修饰符，并且这两者是并列关系，不会同时出现。
- eval, inline 都会将 source map 内容以注释的形式添加到 bundle 中，这会增加 bundle 文件体积，不适用生产环境。

## 代码质量说明

- **bundled**: 所有生成的代码视作一大块代码。没有相互分离的模块。
- **generated**: 每个模块相互分离，并用模块名称进行注释。可以看到 webpack 生成的代码。示例：你会看到类似 `var module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(42); module__WEBPACK_IMPORTED_MODULE_1__.a();`，而不是 `import {test} from "module"; test();`。
- **transformed**: 每个模块相互分离，并用模块名称进行注释。可以看到 loader 转译后、webpack 转换前的代码。示例：你会看到类似 `import {test} from "module"; var A = function(_test) { ... }(test);`，而不是 `import {test} from "module"; class A extends test {}`。
- **original lines**: 每个模块相互分离，并用模块名称进行注释。可以看到转译前的代码。
- **original**: source map 不包含源码内容。浏览器通常会去服务中加载源代码。

## 常见配置分析

| devtool                        | quality        | build   | rebuild |
| ------------------------------ | -------------- | ------- | ------- |
| eval                           | generated      | fast    | fastest |
| eval-source-map                | original       | slowest | ok      |
| eval-cheap-source-map          | transformed    | ok      | fast    |
| eval-cheap-module-source-map   | original lines | slow    | fast    |
| inline-source-map              | original       | slowest | slowest |
| cheap-source-map               | transformed    | ok      | slow    |
| inline-cheap-source-map        | transformed    | ok      | slow    |
| cheap-module-source-map        | original lines | slow    | slow    |
| inline-cheap-module-source-map | original lines | slow    | slow    |
| source-map                     | original       | slowest | slowest |
| hidden-source-map              | original       | slowest | slowest |
| nosources-source-map           | original       | slowest | slowest |

分析与总结：

1. eval,inline,hidden,nosources 都是不影响 source map 质量的修饰符，它们决定了 source map 以什么形式出现在什么地方。
2. 形如 \*-module-source-map 类型，source map 质量都是 original lines.
3. 形如 \*-cheap-source-map 类型，会影响 source map 质量，最终看到的都是转换后的代码。
4. 影响 source map 质量的修饰符优先级顺序是：module>cheap>eval=inline=hidden=nosources
5. source map 代码质量顺序是：original>original lines>transformed>generated
6. inline,hidden,nosources 都不影响 build/rebuild 速度。
7. 初次构建速度跟代码质量有关系，代码越精简生成速度越快，生成速度顺序是：generated>transform>original lines>original
8. 对于再次构建来说，形如 eval-\* 类型，不会生成 source map 文件，再次构建速度较快，cheap 修饰符也会大幅加快再次构建速度。module 修饰符（webpack5）对再次构建速度的影响可忽略不计。总的来说，是否生成 source map 文件起决定性作用，cheap 等影响代码质量的修饰符因素次之。
9. 虽然表中 eval 类型在 build/rebuild 两方面表现都非常突出，但由于开发环境我们需要尽可能的映射到源代码，因此尽量在 eval 的基础上选择其他更适合的类型。

## 具体应用场景分析

### 对于开发环境

**eval**

每个模块都使用 eval 执行，并且都有 `//# sourceURL`。该项构建很快，但缺点也很明显，由于会映射到转换后的代码，而不是映射到原始代码（没有从 loader 中获取 source map），所以不能正确的显示行数。_这种类型一般不使用，映射不准确还不如不用。_

```js
(()=>{eval("console.log(1122);document.body.innerHTML='<h1>Hello world!</h1>';\n\n//# sourceURL=webpack://@dotlim/scripts/./example/src/index.js?")})();
```

映射形式 `index.js:1`

**eval-source-map**

每个模块使用 eval 执行，并且 source map 转换为 DataURL 添加到 eval 中。初始化 source map 时较慢，但是会在重新构建时提供较快的速度，并且生成实际的文件。行数能够正确映射，因为会映射到原始代码中。

```js
(()=>{eval("console.log(1122);document.body.innerHTML='<h1>Hello world!</h1>';//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZG90bGltL3NjcmlwdHMvLi9leGFtcGxlL3NyYy9pbmRleC5qcz8yNGE3Il0sIm5hbWVzIjpbImNvbnNvbGUiLCJkb2N1bWVudCJdLCJtYXBwaW5ncyI6IkFBQUFBLE9BQU8sQ0FBUEEsR0FBQUEsQ0FBQUEsSUFBQUEsRUFDQUMsUUFBUSxDQUFSQSxJQUFBQSxDQUFBQSxTQUFBQSxDQUFBQSx1QkFBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zb2xlLmxvZygxMTIyKTtcclxuZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnPGgxPkhlbGxvIHdvcmxkITwvaDE+JztcclxuIl0sImZpbGUiOiI0MTMuanMiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///413\n")})();
```

映射形式 `index.js?24a7:1`

**eval-cheap-source-map**

类似 eval-source-map，但没有生成列映射(column mapping)，只是映射行数。它会忽略源自 loader 的 source map，并且仅显示转译后的代码。

```js
(()=>{eval("console.log(1122);document.body.innerHTML='<h1>Hello world!</h1>';//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZG90bGltL3NjcmlwdHMvLi9leGFtcGxlL3NyYy9pbmRleC5qcz8yNGE3Il0sIm5hbWVzIjpbImNvbnNvbGUiLCJkb2N1bWVudCJdLCJtYXBwaW5ncyI6IkFBQUFBLE9BQU8sQ0FBUEEsR0FBQUEsQ0FBQUEsSUFBQUEsRUFDQUMsUUFBUSxDQUFSQSxJQUFBQSxDQUFBQSxTQUFBQSxDQUFBQSx1QkFBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zb2xlLmxvZygxMTIyKTtcclxuZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnPGgxPkhlbGxvIHdvcmxkITwvaDE+JztcclxuIl0sImZpbGUiOiI0MTMuanMiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///413\n")})();
```

映射形式 `index.js?24a7:1 `

**eval-cheap-module-source-map**

类似 eval-cheap-source-map，在这种情况下，源自 loader 的 source map 会得到更好的处理结果。

```js
(()=>{eval("console.log(1122);document.body.innerHTML='<h1>Hello world!</h1>';//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZG90bGltL3NjcmlwdHMvLi9leGFtcGxlL3NyYy9pbmRleC5qcz8yNGE3Il0sIm5hbWVzIjpbImNvbnNvbGUiLCJkb2N1bWVudCJdLCJtYXBwaW5ncyI6IkFBQUFBLE9BQU8sQ0FBUEEsR0FBQUEsQ0FBQUEsSUFBQUEsRUFDQUMsUUFBUSxDQUFSQSxJQUFBQSxDQUFBQSxTQUFBQSxDQUFBQSx1QkFBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zb2xlLmxvZygxMTIyKTtcclxuZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSAnPGgxPkhlbGxvIHdvcmxkITwvaDE+JztcclxuIl0sImZpbGUiOiI0MTMuanMiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///413\n")})();
```

映射形式 `index.js?24a7:1`

### 特定场景

**inline-source-map**

source map 转换为 DataUrl 后添加到 bundle 中。

```js
console.log(1122),document.body.innerHTML="<h1>Hello world!</h1>";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZG90bGltL3NjcmlwdHMvLi9leGFtcGxlL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjb25zb2xlIiwiZG9jdW1lbnQiXSwibWFwcGluZ3MiOiJBQUFBQSxrQkFDQUMiLCJmaWxlIjoianMvbWFpbi45Njc4ZjIwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUubG9nKDExMjIpO1xyXG5kb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICc8aDE+SGVsbG8gd29ybGQhPC9oMT4nO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9
```

映射形式 `index.js:1`

**cheap-source-map**

没有列映射(column mapping)的 source map，忽略 loader source map。生成单独的 .map 文件。

```js
console.log(1122),document.body.innerHTML="<h1>Hello world!</h1>";
//# sourceMappingURL=main.c20330fd.js.map
```

```js
{"version":3,"file":"js/main.c20330fd.js","sources":["webpack://@dotlim/scripts/js/main.c20330fd.js"],"sourcesContent":["console.log(1122),document.body.innerHTML=\"<h1>Hello world!</h1>\";"],"mappings":"AAAA","sourceRoot":""}
```

映射形式 `main.c20330fd.js:1`

**inline-cheap-source-map**

类似 cheap-source-map，但是 source map 转换为 DataURL 添加到 bundle 中。

```js
console.log(1122),document.body.innerHTML="<h1>Hello world!</h1>";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWFpbi45Njc4ZjIwZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovL0Bkb3RsaW0vc2NyaXB0cy9qcy9tYWluLjk2NzhmMjBlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUubG9nKDExMjIpLGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MPVwiPGgxPkhlbGxvIHdvcmxkITwvaDE+XCI7Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==
```

映射形式 `main.9678f20e.js:1`

**cheap-module-source-map**

没有列映射(column mapping)的 source map，将 loader source map 简化为每行一个映射(mapping)。

```js
console.log(1122),document.body.innerHTML="<h1>Hello world!</h1>";
//# sourceMappingURL=main.c20330fd.js.map
```

```js
{"version":3,"file":"js/main.c20330fd.js","sources":["webpack://@dotlim/scripts/js/main.c20330fd.js"],"mappings":"AACA","sourceRoot":""}
```

映射形式 `main.c20330fd.js:2` 【靓仔疑惑??不准】

**inline-cheap-module-source-map**

类似 cheap-module-source-map，但是 source map 转换为 DataURL 添加到 bundle 中。

```js
console.log(1122),document.body.innerHTML="<h1>Hello world!</h1>";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvbWFpbi45Njc4ZjIwZS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovL0Bkb3RsaW0vc2NyaXB0cy9qcy9tYWluLjk2NzhmMjBlLmpzIl0sIm1hcHBpbmdzIjoiQUFDQSIsInNvdXJjZVJvb3QiOiIifQ==
```

映射形式 `main.9678f20e.js:2`

### 对于生产环境

**source-map**

整个 source map 作为一个单独的文件生成。它为 bundle 添加了一个引用注释，以便开发工具知道在哪里可以找到它。

```js
console.log(1122),document.body.innerHTML="<h1>Hello world!</h1>";
//# sourceMappingURL=main.c20330fd.js.map
```

```js
{"version":3,"sources":["webpack://@dotlim/scripts/./example/src/index.js"],"names":["console","document"],"mappings":"AAAAA,kBACAC","file":"js/main.c20330fd.js","sourcesContent":["console.log(1122);\r\ndocument.body.innerHTML = '<h1>Hello world!</h1>';\r\n"],"sourceRoot":""}
```

**hidden-source-map**

与 source-map 相同，但不会为 bundle 添加引用注释。

```js
console.log(1122),document.body.innerHTML="<h1>Hello world!</h1>";
```

```js
{"version":3,"sources":["webpack://@dotlim/scripts/./example/src/index.js"],"names":["console","document"],"mappings":"AAAAA,kBACAC","file":"js/main.d211ed7f.js","sourcesContent":["console.log(1122);\r\ndocument.body.innerHTML = '<h1>Hello world!</h1>';\r\n"],"sourceRoot":""}
```

映射形式 `main.d211ed7f.js:1`

**nosources-source-map**

创建的 source map 不包含 `sourcesContent`。它可以用来映射客户端上的堆栈跟踪，而无须暴露所有的源代码。

```js
console.log(1122),document.body.innerHTML="<h1>Hello world!</h1>";
//# sourceMappingURL=main.c20330fd.js.map
```

```js
{"version":3,"sources":["webpack://@dotlim/scripts/./example/src/index.js"],"names":["console","document"],"mappings":"AAAAA,kBACAC","file":"js/main.c20330fd.js","sourceRoot":""}
```

映射形式 `index.js:1`
