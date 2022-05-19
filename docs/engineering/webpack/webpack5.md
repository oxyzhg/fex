---
id: webpack5
title: Webpack 5
---

Webpack5 已经正式发布了，并带来了诸多重大的变更，将会使前端的构建效率与质量大为提升。

本次版本更新重点在于以下几点：

- 尝试用持久性缓存来提高构建性能。
- 尝试用更好的算法和默认值来改进长期缓存。
- 尝试用更好的 Tree Shaking 和代码生成来改善包大小。
- 尝试改善与网络平台的兼容性。
- 尝试在不引入任何破坏性变化的情况下，清理那些在实现 v4 功能时处于奇怪状态的内部结构。

升级带来的特性有：优化持久缓存、优化长期缓存、更优的 tree-shaking、移除 Node Polyfill 脚本、Module Federation 等。

## 新特性

### 编译缓存

webpack4 及之前的版本没有持久化缓存的能力的，但可以借助 plugin 或 loader 来实现。例如：

- 使用 cache-loader 来缓存编译结果到硬盘，再次构建时在缓存的基础上增量编译长期缓存。
- 使用自带缓存的 loader，如：babel-loader，可以配置 cacheDirectory 缓存 babel 编译的结果。
- 使用 hard-source-webpack-plugin 来为模块提供中间缓存。

使用以上缓存方案的结果，默认存储在 _node_modules/.cache_ 目录。

webpack5 统一了持久化缓存的方案，有效降低了配置的复杂性。另外由于 webpack 提供了构建的 runtime，所有被 webpack 处理的模块都能得到有效的缓存，大大提高了缓存的覆盖率，因此该持久化缓存方案将会比其他第三方插件缓存性能要好很多。

webpack5 可以通过配置 [cache](https://webpack.js.org/configuration/other-options/#cache) 属性设置缓存。

```js
module.exports = {
  cache: {
    // 将缓存类型设置为文件系统
    type: 'filesystem',
    cacheDirectory: 'node_modules/.cache/webpack', // default
    buildDependencies: {
      // 将你的 config 添加为 buildDependency，以便在改变 config 时获得缓存无效
      config: [__filename],
      // 如果有其他的东西被构建依赖，你可以在这里添加它们
      // 注意，webpack.config，加载器和所有从你的配置中引用的模块都会被自动添加
    },
    version: '1.0',
  },
};
```

注意事项：

- `cache` 的属性 `type` 会在开发模式下被默认设置成 `memory`，而且在生产模式中被禁用，所以如果想要在生产打包时使用缓存需要显式的设置。
- 为了防止缓存过于固定，导致更改构建配置无感知，依然使用旧的缓存，默认情况下，每次修改构建配置文件都会导致重新开始缓存。当然也可以自己主动设置 `version` 来控制缓存的更新。

### 长效缓存

长效缓存指的是能充分利用浏览器缓存，尽量减少由于模块变更导致的构建文件 hash 值的改变，从而导致文件缓存失效。

webpack4 及之前的版本 moduleId 和 chunkId 默认是自增的，更改模块的数量，容易导致缓存的失效，这不利于浏览器进行长效缓存。

v4 之前的解决办法是使用 HashedModuleIdsPlugin 固定 moduleId，它会使用模块路径生成的 hash 作为 moduleId；使用 NamedChunksPlugin 来固定 chunkId。

其中 webpack4 中可以根据如下配置来解决此问题：

```js
optimization.moduleIds = 'hashed';
optimization.chunkIds = 'named';
```

webpack5 增加了**确定的** moduleId, chunkId 的支持，如下配置：

```js
optimization.moduleIds = 'deterministic';
optimization.chunkIds = 'deterministic';
```

此配置在生产模式下是默认开启的，它的作用是以确定的方式为 module 和 chunk 分配 3-5 位数字 id，相比于 v4 版本的选项 hashed，它会导致更小的文件 bundles。

由于 moduleId 和 chunkId 确定了，构建的文件的 hash 值也会确定，有利于浏览器长效缓存。同时此配置有利于减少文件打包大小。

在开发模式下，建议使用：

```js
optimization.moduleIds = 'named';
optimization.chunkIds = 'named';
```

此选项生产对调试更友好的可读的 id。

### 移除 Node polyfill 脚本

webpack4 版本中附带了大多数 Node.js 核心模块的 polyfill，一旦前端使用了任何核心模块，这些模块就会自动应用，但是其实有些是不必要的。

webpack5 将不再自动为 Node.js 模块添加 polyfill，而是更专注的投入到前端模块的兼容中。这是一个 Breaking Change，用户可根据提示手动添加 polyfill，或根据提示设置 `resolve.fallback` 属性。

### 更优的 tree-shaking

对于使用 `import * as module from 'module'` 引入嵌套的模块，在 v4 版本不能跟踪对导出的嵌套属性的访问，导致整个 module 模块都会被导入并输出到最终产物中，但实际上我们只用到其中的一部分，这无疑是增加了最终产物的体积。而 webpack5 现在能够跟踪对导出的嵌套属性的访问，可以清除未使用的导出和混淆导出，有效减小最终产物的体积。

对于内部模块，在 v4 版本没有分析模块的导出和引用之间的依赖关系。webpack5 新增了 `optimization.innerGraph` 选项，在生产模式下是默认启用的，它可以对模块中的标志进行分析，找出导出和引用之间的依赖关系。内部依赖算法会找出导出模块对依赖的引用，这允许将更多的出口标记为未使用，并从代码中省略很多的代码。

另外，webpack5 增加了对一些 CommonJS 构造的支持，允许消除未使用的 CommonJs 导出，并从 `require()` 调用中跟踪引用的导出名称。

### Module Federation

Module Federation 使得使 JavaScript 应用得以从另一个 JavaScript 应用中动态地加载代码，同时共享依赖。相当于 webpack 提供了线上 runtime 的环境，多个应用利用 CDN 共享组件或应用，不需要本地安装 npm 包再构建了，这就有点云组件的概念了。

官方提供了一些场景的示例，详情参考 [module-federation-examples](https://github.com/module-federation/module-federation-examples)

## 升级采坑

参考资料：

- [构建效率大幅提升，webpack5 在企鹅辅导的升级实践](https://mp.weixin.qq.com/s/P3foOrcu4StJDGdX9xavng)
- [Webpack 5 发布](https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/)
- [Webpack 5 release (2020-10-10)](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Webpack 5 Module Federation: A game-changer in JavaScript architecture](https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669)
