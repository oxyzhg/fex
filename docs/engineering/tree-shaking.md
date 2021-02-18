---
id: tree-shaking
title: Tree Shaking
---

当前端项目达到一定规模后，我们一般会采用按模块方式组织代码，这样可以方便代码的组织及维护。但会存在一个问题，比如我引入一个 utils 工具类，这会在打包的时候将 utils 中不必要的代码也打包，从而使得打包体积变大，这时候就需要用到 tree-shaking 技术了。

国内外许多资料，都会将 tree-shaking 的最佳解释指向了 [webpack tree-shaking](https://webpack.js.org/guides/tree-shaking/)，实际上，webpack 文档是非常值得我们阅读与学习的，并且也是现代前端打包非常好的实践。

简单描述：Tree shaking 是一种通过**清除上下文未引用代码**(dead-code)方式来优化项目打包体积的技术。

## 原理

它依赖于 ES2015 模块语法的 [静态结构](http://exploringjs.com/es6/ch_modules.html#static-module-structure) 特性：

- 只能作为模块顶层的语句出现
- `import` 的模块名只能是字符串变量，不能动态引入模块
- `import binding` 是 `immutable` 的，引入的模块不能在进行修改

在 ES6 模块出现后 tree-shaking 才被利用起来，因为 tree-shaking 只能在静态 modules 下工作。ESM 加载是静态的，因此整个依赖树可以被静态的推导出解析语法树。tree-shaking 不仅支持 `import/export` 级别，也支持 statement 级别。

在 ESM 出现之前，我们可以使用 CommonJS 引入模块：`require` 。这种引入是动态的，也意味着可以基于条件来导入需要的代码，这种模块导入的不确定性，意味着 tree-shaking 不适用。

## 如何使用

在 webpack4 中，通过 `package.json` 的 `sideEffects` 属性作为标记，向 `compiler` 提供判断条件，表示项目中的哪些问价那是 `pure` ，由此可以安全的删除文件中未使用的部分。

webpack4 之后的版本，只需要设置 `mode:production` 即可开启 tree-shaking.

如果你的代码确实有一些副作用，可以改为提供一个数组：

```json
{
  "name": "your-project",
  "sideEffects": ["./src/some-side-effectful-file.js", "*.css"]
}
```

注意：所有导入文件都会受到 tree-shaking 的影响。这意味着，如果在项目中使用类似 css-loader 并 import 一个 CSS 文件，则需要将其添加到 sideEffects 列表中，以免在生产模式中无意中将它删除。

## sideEffects

sideEffects 指那些当 import 的时候会执行一些动作，但是不一定会有任何 export，比如 polyfill 不暴露方法给主程序使用。

tree-shaking 不能自动的识别哪些代码属于 sideEffects，因此需要手动指定这些代码，如果不指定会出现意想不到的问题。

在 webpack4 中，是通过配置 sideEffects 属性来实现的：

```json
{
  "sideEffects": false
}
```

如果所有代码都不包含副作用，那么可以简单的设置 false 即可，如果存在有副作用的代码，那么可以提供一个数组：

```json
{
  "sideEffects": ["./src/common/polyfill.js"]
}
```

## 总结

1. tree-shaking 利用了  ESM  的静态导入特性，不支持动态导入。
1. webpack4 可以在项目 `package.json` 设置 `sideEffects` 属性，手动指定副作用脚本。
1. rollup 天生支持 tree-shaking.