---
id: webpack
title: Webpack 相关题目总结
---

### 你知道 webpack 的作用是什么吗？

- **模块打包。**可以将不同模块的文件打包整合在一起，并且保证它们之间的引用正确，执行有序。利用打包我们就可以在开发的时候根据我们自己的业务自由划分文件模块，保证项目结构的清晰和可读性。
- **编译兼容。**通过 webpack 的 Loader 机制，不仅可以帮助我们对代码做 polyfill，还可以编译转换诸如 `.less, .vue, .jsx` 这类在浏览器无法识别的格式文件，让我们在开发的时候可以使用新特性和新语法做开发，提高开发效率。
- **能力扩展。**通过 webpack 的 Plugin 机制，我们在实现模块化打包和编译兼容的基础上，可以进一步实现诸如按需加载，代码压缩等一系列功能，帮助我们进一步提高自动化程度，工程效率以及打包输出的质量。

### 说一下模块打包运行原理？

首先我们应该简单了解一下 webpack 的整个打包流程：

1. 读取 webpack 的配置参数；
2. 启动 webpack，创建 `Compiler` 对象并开始解析项目；
3. 从入口文件（`entry`）开始解析，并且找到其导入的依赖模块，递归遍历分析，形成依赖关系树；
4. 对不同文件类型的依赖模块文件使用对应的 Loader 进行编译，最终转为 JS 文件；
5. 整个过程中 webpack 会通过发布订阅模式，向外抛出一些 hooks，而 webpack 的插件即可通过监听这些关键的事件节点，执行插件任务进而达到干预输出结果的目的。

其中文件的解析与构建是一个比较复杂的过程，在 webpack 源码中主要依赖于 `Compiler` 和 `Compilation` 两个核心对象实现。Compiler 对象是一个全局单例，他负责把控整个 webpack 打包的构建流程。Compilation 对象是每一次构建的上下文对象，它包含了当次构建所需要的所有信息，每次热更新和重新构建，Compiler 都会重新生成一个新的 Compilation 对象，负责此次更新的构建过程。

而每个模块间的依赖关系，则依赖于 AST 语法树。每个模块文件在通过 Loader 解析完成之后，会通过 [acorn](https://github.com/acornjs/acorn) 库生成模块代码的 AST 语法树，通过语法树就可以分析这个模块是否还有依赖的模块，进而继续循环执行下一个模块的编译解析。

最终 webpack 打包出来的 bundle 文件是一个 IIFE 的执行函数。立即执行函数里边只有三个变量和一个函数方法，`__webpack_modules__` 存放了编译后的各个文件模块的 JS 内容，`__webpack_module_cache__` 用来做模块缓存，`__webpack_require__` 是 webpack 内部实现的一套依赖引入函数。最后一句则是代码运行的起点，从入口文件开始，启动整个项目。

值得一提的是，不管是 ES Module 还是 CommonJS 模块化方案，经过 webpack 打包编译之后，都会统一替换成自己的 `__webpack__require__` 来实现模块的导入和导出，从而实现模块缓存机制，以及抹平不同模块规范之间的一些差异性。

### 说一下 loader 与 plugin 的区别

对于 loader 来说，它是一个**转换器**，它负责处理加载的资源文件，把 A 文件编译转换成 B 文件，这里只做单纯的文件转换的工作。处理一个文件资源可以使用多个 loader，loader 的加载顺序和配置顺序是相反的，当前 loader 处理后的文件会传给下一个 loader 处理，最后一个 loader 返回处理后的资源。

对于 plugin 来说，它是一个**扩展器**，它拓展了 webpack 本身的能力，在 webpack 的打包过程中，两大核心模块 Compiler 和 Compilation 都会广播很多事件，而 plugin 可以监听这些事件（在 apply 方法中监听 hooks 的生命周期），在合适的时机通过 webpack 提供的 API 改变输出结果。

### 是否写过 Loader？简单描述一下编写 loader 的思路？

从上面的打包代码我们其实可以知道，Webpack 最后打包出来的成果是一份 JS 代码，实际上在 webpack 内部默认也只能够处理 JS 模块代码，在打包过程中，会默认把所有遇到的文件都当作 JS 代码进行解析，因此当项目存在非 JS 类型文件时，我们需要先对其进行必要的转换，才能继续执行打包任务，这也是 Loader 机制存在的意义。

针对每个文件类型，loader 是支持以数组的形式配置多个，因此当 webpack 在转换该文件类型的时候，会按顺序链式调用每一个 loader，前一个 loader 返回的内容会作为下一个 loader 的入参。因此 loader 的开发需要遵循一些规范，比如返回值必须是标准的 JS 代码字符串，以保证下一个 loader 能够正常工作，同时在开发上需要严格遵循单一职责，只关心 loader 的输出以及对应的输出。

```js
module.exports = function (source) {
  const content = doSomeThing2JsString(source);

  // 如果 loader 配置了 options 对象，那么this.query将指向 options
  const options = this.query;

  // 可以用作解析其他模块路径的上下文
  console.log('this.context');

  /*
   * this.callback 参数：
   * error：Error | null，当 loader 出错时向外抛出一个 error
   * content：String | Buffer，经过 loader 编译后需要导出的内容
   * sourceMap：为方便调试生成的编译后内容的 source map
   * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
   */
  this.callback(null, content);
  // or return content;
};
```

### 是否写过 Plugin？简单描述一下编写 plugin 的思路？

如果说 Loader 负责文件转换，那么 Plugin 便是负责功能扩展。

Webpack 基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件通过监听这些事件，就可以在特定的阶段执行自己的插件任务，从而实现自己想要的功能。

Webpack 解析与构建主要依赖于 Compiler 和 Compilation 两个核心对象实现。其中 Compiler 是全局单例，它暴露了 webpack 整个生命周期相关的钩子；而 Compilation 是构建上下文对象，它暴露了与模块和依赖有关的粒度更小的事件钩子。

Webpack 的事件机制基于 webpack 自己实现的一套 Tapable 事件流方案。Plugin 的开发和开发 Loader 一样，需要遵循一些开发上的规范和原则：

- 插件必须是一个函数或者是一个包含 `apply` 方法的对象，这样才能访问 compiler 实例；
- 传给每个插件的 compiler 和 compilation 对象都是同一个引用，若在一个插件中修改了它们身上的属性，会影响后面的插件；
- 异步的事件需要在插件处理完任务时调用回调函数通知 Webpack 进入下一个流程，不然会卡住。

```js
class MyPlugin {
  apply(compiler) {
    // 找到合适的事件钩子，实现自己的插件功能
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // compilation: 当前打包构建流程的上下文
      console.log(compilation);

      // do something...
    });
  }
}
```

### 你知道 sourceMap 是什么吗？

sourceMap 是一项将编译、打包、压缩后的代码映射回源代码的技术。由于打包压缩后的代码并没有阅读性可言，一旦在开发中报错或者遇到问题，直接在混淆代码中 debug 问题会带来非常糟糕的体验，sourceMap 可以帮助我们快速定位到源代码的位置，提高我们的开发效率。

### 说一下 Tree Shaking

### 说一下 Webpack Split Chunks 配置

- `chunks` 选项，决定要提取哪些模块。
  - 默认是 `async`，只提取异步加载的模块出来打包到一个文件中。
  - `initial`：提取同步加载和异步加载模块。
  - `all`：不管异步加载还是同步加载的模块都提取出来，打包到一个文件中。
- `minSize` 选项，规定被提取的模块在压缩前的大小最小值，超过这个值会被提取。
- `maxSize` 选项：把提取出来的模块打包生成的文件大小不能超过这个值，如果超过了，要对其进行分割并打包生成新的文件。
- `cacheGroups` 选项，可以指定一些特殊的自定义提取方案，多用于提取 node_modules 中的文件，或自定义其他提取方案。

### webpack 构建优化分析

在 webpack 工作过程中，真正影响整个构建效率的是 Compilation 实例的处理过程，这一阶段又可分为两个阶段：模块编译和优化处理。

编译阶段优化分析：

- 减少执行编译的模块数量
  - IgnorePlugin
  - 按需引入类库模块
  - DllPlugin
  - Externals
- 提升单个模块的编译速度
  - include/exclude
  - noParse
  - sourceMap
  - resolve
- 并行构建以提升总体效率
  - thread-loader

打包阶段优化分析：

- 提升当前任务的工作效率
  - 面向 JS 的压缩工具：TerserWebpackPlugin
  - 面向 CSS 的压缩工具：OptimizeCSSAssetsPlugin、OptimizeCSSNanoPlugin、CSSMinimizerWebpackPlugin
- 提升后续环节的工作效率
  - Split Chunks
  - Tree Shaking
