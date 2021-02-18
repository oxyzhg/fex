---
id: optimization-analysis
title: Webpack 构建优化分析
---

在 Compiler 和 Compilation 的工作流程中耗时分析：

- 对于 Compiler 实例而言，耗时最长的显然是生成编译过程实例后的 make 阶段，在这个阶段里，会执行模块编译到优化的完整过程。
- 对于 Compilation 实例的工作流程来说，不同的项目和配置各有不同，但总体而言，编译模块和后续优化阶段的生成产物并压缩代码的过程都是比较耗时的。

不同项目的构建，在整个流程的前期初始化阶段与最后的产物生成阶段的构建时间区别不大。真正影响整个构建效率的还是 Compilation 实例的处理过程，这一过程又可分为两个阶段：编译模块和优化处理。

## 编译阶段优化分析

编译模块阶段所耗的时间是从单个入口点开始，编译每个模块的时间的总和。要提升这一阶段的构建效率，大致可以分为三个方向：

1. 减少执行编译的模块
1. 提升单个模块构建的速度
1. 并行构建以提升总体效率

### 减少执行编译的模块

如果一个项目每次构建都需要编译 1000 个模块，但是通过分析后发现其中有 500 个不需要编译，显而易见，经过优化后，构建效率可以大幅提升。

#### IgnorePlugin

有的依赖包，除了项目所需的模块内容外，还会附带一些多余的模块。典型的例子是 moment 这个包，一般情况下在构建时会自动引入其 locale 目录下的多国语言包，但对于大多数情况而言，项目中只需要引入本国语言包即可。而 Webpack 提供的 IgnorePlugin 即可在构建模块时直接剔除那些需要被排除的模块，从而提升构建模块的速度，并减少产物体积。

```javascript
const config = {
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
};
```

#### 按需引入类库模块

这种方式一般适用于工具类库性质的依赖包的优化，典型例子是 lodash 依赖包。要解决这个问题，效果最佳的方式是在导入声明时只导入依赖包内的特定模块。除了在导入时声明特定模块之外，还可以使用 babel-plugin-lodash 或 babel-plugin-import 等插件达到同样的效果。

> 关于 Tree Shaking 这里要注意两点：1. 该功能依赖 ES Module 模块化方案；2.该功能在优化阶段进行，换句话说，这并不能对模块编译阶段起作用。

#### DllPlugin

DllPlugin 的核心思想是将项目依赖的框架等模块单独构建打包，与普通构建流程区分开。例如，原先一个依赖 react 与 react-dom 的项目，经过 DllPlugin 和 DllReferencePlugin 优化后，再次构建的效率会得到极大的提高。

#### Externals

Webpack 配置中的 externals 和 DllPlugin 解决的是同一类问题：将依赖的框架等模块从构建过程中移除。它们的区别在于：

1. 在配置方面，externals 更简单，而 DllPlugin 需要独立的配置文件。
1. DllPlugin 包含了依赖包的独立构建流程，而 externals 配置中不包含依赖框架的生成方式，通常使用已传入 CDN 的依赖包。
1. externals 配置的依赖包需要单独指定依赖模块的加载方式：全局对象、CommonJS、AMD 等。
1. 在引用依赖包的子模块时，DllPlugin 无须更改，而 externals 则会将子模块打入项目包中。

### 提升单个模块构建的速度

提升编译阶段效率的第二个方向，是在保持构建模块数量不变的情况下，提升单个模块构建的速度。具体来说，是通过减少构建单个模块时的一些处理逻辑来提升速度。

#### include/exclude

include 的用途是只对符合条件的模块使用指定 Loader 进行转换处理。而 exclude 则相反，不对特定条件的模块使用该 Loader. 例如不使用 babel-loader 处理 node_modules 中的模块。

#### noParse

module.noParse 是在上述 include/exclude 的基础上，进一步省略了使用默认 js 模块编译器进行编译。

#### SourceMap

对于生产环境的代码构建而言，会根据项目实际情况判断是否开启 Source Map。在开启 Source Map 的情况下，优先选择与源文件分离的类型，例如 "source-map"。

#### Resolve

Webpack 中的 resolve 配置制定的是在构建时指定查找模块文件的规则，例如：

- **resolve.modules**：指定查找模块的目录范围。
- **resolve.extensions**：指定查找模块的文件类型范围。
- **resolve.mainFields**：指定查找模块的 package.json 中主文件的属性名。
- **resolve.symlinks**：指定在查找模块时是否处理软连接。

这些规则在处理每个模块时都会有所应用，因此尽管对小型项目的构建速度来说影响不大，但对于大型的模块众多的项目而言，这些配置的变化就可能产生客观的构建时长区别。

### 并行构建以提升总体效率

#### thread-loader

它作用于模块编译的 Loader 上，用于在特定 Loader 的编译过程中，以开启多进程的方式加速编译。

## 打包阶段优化分析

Webpack 编译过程可以细分为 12 个阶段：生成依赖项、生成 Chunk、优化 Module、优化 Chunk、优化 Tree、优化 ChunkModules、生成 Module Ids、生成 Chunk Ids、生成 Hash、生成 ModuleAssets、生成 ChunkAssets、优化 Assets。每个任务依次对数据进行一定的处理，并将结果传递给下一任务。

因此，这一阶段的优化也可以分为两个不同的方向：

1. 针对某些任务，使用效率更高的工具或配置项，从而**提升当前任务的工作效率**。
1. 提升特定任务的优化效果，以减少传递给下一任务的数据量，从而**提升后续环节的工作效率**。

### 提升当前任务的工作效率

一般在项目的优化阶段，主要耗时的任务有两个：一个是生成 ChunkAssets，即根据 Chunk 信息**生成 Chunk 的产物代码**；另一个是优化 Assets，即**压缩 Chunk 产物代码**。

第一个任务主要在 Webpack 引擎内部的模块中处理，相对而言优化手段较少，主要集中在利用缓存方面。而在压缩 Chunk 产物代码的过程中会用到一些第三方插件，选择不同的插件，以及插件中的不同配置都可能会对其中的效率产生影响。

#### 面向 JS 的压缩工具

Webpack4 内置了 TerserWebpackPlugin 作为 JS 压缩工具。（之前的版本是 UglifyJSWebpackPlugin）

TerserWebpackPlugin 工作过程中，对执行效率产生影响的配置主要分为 3 个方面：

1. **Cache 选项**：默认开启，使用缓存能够极大程度上提升再次构建时的工作效率。
1. **Parallel 选项**：默认开启，并发选项在大多数情况下能够提升该插件的工作效率，但具体提升的程度则因项目而异。在小型项目中，多进程通信的额外消耗可能会抵消其带来的益处。
1. **terserOptions 选项**：即 Terser 工具中的 [minify](https://github.com/terser/terser#minify-options) 选项集合。这些选项是对具体压缩处理过程产生影响的配置项。

我们主要来看其中的 compress 和 mangle 选项，不同选项的压缩结果如下面的代码所示：

```javascript
//源代码./src/example-terser-opts.js
function HelloWorld() {
  const foo = '1234'
  console.log(HelloWorld, foo)
}
HelloWorld()
//默认配置项compress={}, mangle=true的压缩后代码
function(e,t){!function e(){console.log(e,"1234")}()}});
//compress=false的压缩后代码
function(e,r){function t(){var e="1234";console.log(t,e)}t()}});
//mangle=false的压缩代码
function(module,exports){!function HelloWorld(){console.log(HelloWorld,"1234")}()}});
//compress=false，mangle=false的压缩后代码
function(module,exports){function HelloWorld(){var foo="1234";console.log(HelloWorld,foo)}HelloWorld()}});
```

从上面例子可以看出：

- **compress** 参数的作用是执行特定的压缩策略，例如省略变量赋值的语句，从而将变量的值直接替换到引入变量的位置上，减小代码体积。而当 compress 参数为 false 时，这类压缩策略不再生效，对压缩质量的影响有限。
- **mangle** 参数的作用是对源代码中的变量与函数名称进行压缩，对代码压缩的效果影响非常大。

#### 面向 CSS 的压缩工具

CSS 同样有几种压缩工具可供选择：

- OptimizeCSSAssetsPlugin（在 Create-React-App 中使用）
- OptimizeCSSNanoPlugin（在 VUE-CLI 中使用）
- CSSMinimizerWebpackPlugin（2020 年 Webpack 社区新发布的 CSS 压缩插件）

这三个插件在压缩 CSS 代码功能方面，都默认基于 [cssnano](https://cssnano.co/) 实现，因此在压缩质量方面没有什么差别。在压缩效率方面，最新发布的 CSSMinimizerWebpackPlugin 支持了缓存和多进程，这是另外两个工具不具备的。

### 提升后续环节的工作效率

优化阶段的另一类优化方向是通过对本环节的处理减少后续环节处理内容，以便提升后续环节的工作效率。比如：Split Chunks（分包） 和 Tree Shaking（摇树）。

#### Split Chunks

> Split Chunks（分包）是指在 Chunk 生成之后，将原先以入口点来划分的 Chunks 根据一定的规则（例如异步引入或分离公共依赖等原则），分离出子 Chunk 的过程。

Split Chunks 有诸多优点，例如有利于缓存命中、有利于运行时的持久化文件缓存等。其中有一类情况能提升后续环节的工作效率，即通过分包来抽离多个入口点引用的公共依赖。

Webpack4 内置了 SplitChunksPlugin 插件，该插件在 production 模式下默认启用。其默认的分包规则只会分离动态引入的模块，在处理动态引入的模块时能够自动分离其中的公共依赖。而对于多入口静态引用相同依赖包的情况，则不会处理分包，因此我们需要配置 `chunks:'all'` 将所有的依赖情况都进行分包处理，从而减少了重复引入相同模块代码的情况。

#### Tree Shaking

> Tree Shaking（摇树）是指在构建打包过程中，移除那些引入但未被使用的代码（Dead-code elimination）。

注意几点：

1. **ES Module**：只有通过 ESM 导入导出的模块才能被 Tree Shaking 命中，这得益于 ESM 能在编译阶段对依赖进行静态分析。
1. **引入方式**：以 default 方式引入的模块，无法被 Tree Shaking 命中；而引入单个导出对象的方式，无论是使用 `import * as xxx` 的语法，还是 `import {xxx}` 的语法，都可以 Tree Shaking 命中。
1. **SideEffects**：在 Webpack4 中，会根据依赖模块 package.json 中的 sideEffects 属性来确认对应的依赖包代码是否会产生副作用。只有 sideEffects 为 false 的依赖包（或不在 sideEffects 对应数组中的文件），才可以实现安全移除未使用代码的功能。
1. **Babel**：在 babel7 之前的版本的 babel-preset-env 中，modules 默认是 commonjs，因此在处理模块时，即使原来是 ESM 模块化方案也会被变异成 commonjs 方案，而无法在优化阶段被 TreeShaking 命中；而在 babel7 中，modules 默认为 auto，这样在转换中如果是 ESM 模块不会被转换为 commonjs，也能在后面的优化阶段被 TreeShaking 命中。

## 优化方案总结

**编译阶段优化：**

1. 减少执行编译的模块
   - IgnorePlugin
   - 按需引入
   - DllPlugin
   - Externals
2. 提升单个模块编译速度
   - include/exclude
   - noParse
   - SourceMap
   - Resolve
3. 并行构建
   - thread-loader

**打包阶段优化：**

1. 提升当前任务的工作效率
   - 压缩 JS
   - 压缩 CSS
2. 提升后续环节的工作效率
   - Split Chunks
   - Tree Shaking
