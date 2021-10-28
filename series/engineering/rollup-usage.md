---
id: rollup-usage
title: Rollup 基本配置
---

rollup 采用 ES6 原生的模块机制进行模块的打包构建，它更着眼于未来，对 CommonJS 模块机制不提供内置的支持，是一款更轻量的打包工具。

rollup 另一个核心特点是 tree-shaking 优化，当然这个特性在 webpack 中也有实现。tree-shaking 的优点毋庸多言了，结合 ES6 模块，对代码进行静态分析，能更有效地剔除冗余的代码，减小编译后 js 文件的大小。

基本配置文件如下：

```js title="rollup.config.js"
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/js/main.min.js',
    format: 'umd',
    name: 'bundle',
  },
};
```

## 核心功能

### input

打包的入口点

### output.file

要写入的文件

### output.format

生成包的格式，可选模块化方案有：`cjs`, `esm`, `amd`, `umd`, `iife`, `system` 等。

### output.name

输出模块的变量名，代表你的 `iife/umd` 包，同一页上的其他脚本可以访问它。

### plugins

打包额外插件，通常是一个配置对象或配置对象数组。

常用的插件有：

- [@rollup/plugin-node-resolve](https://www.npmjs.com/package/@rollup/plugin-node-resolve)
- [@rollup/plugin-commonjs](https://www.npmjs.com/package/@rollup/plugin-commonjs)
- [@rollup/plugin-babel](https://www.npmjs.com/package/@rollup/plugin-babel)
- [@rollup/plugin-eslint](https://www.npmjs.com/package/@rollup/plugin-eslint)
- [@rollup/plugin-typescript](https://www.npmjs.com/package/@rollup/plugin-typescript) (官方提供，但感觉不太好用)
- [rollup-plugin-typescript2](https://www.npmjs.com/package/rollup-plugin-typescript2)
- [rollup-plugin-terser](https://www.npmjs.com/package/rollup-plugin-terser)

:::note
官方维护的一些插件，已经由原单仓单包变更为基于 monorepo 管理的单仓多包的形式，相应的包名称也发生了变化，原仓库基本不再维护，建议直接使用新版本依赖包。例如：rollup-plugin-node-resolve 依赖包名称已变更为 @rollup/plugin-node-resolve，具体请查阅 [rollup/plugins](https://github.com/rollup/plugins) 官方仓库。
:::

### external

外链

## 高级配置

### 配置 Babel

rollup 的模块机制是 ES6 Modules，但并不会对 ES6 其他的语法进行编译。因此如果要使用 ES6 的语法进行开发，还需要使用 babel 来帮助我们将代码编译成 ES5。

使用 [@rollup/plugin-babel](https://www.npmjs.com/package/@rollup/plugin-babel) 插件，同时也需要安装 [@babel/core](https://www.npmjs.com/package/@babel/core), [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env) 相关功能依赖包，并且配置 _.babelrc_ 文件，即可实现上述功能。

```js
import babel from '@rollup/plugin-babel';

export default {
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
```

### 代码检查

在代码中使用 Linter 无疑是一个很好的决定，尤其是在团队协作开发的项目中，它会强制执行一致的编码规范来帮助我们捕捉一些棘手不易发现的问题。

使用 [@rollup/plugin-eslint](https://www.npmjs.com/package/@rollup/plugin-eslint) 插件，在编译过程中执行代码检查。

```js
import eslint from '@rollup/plugin-eslint';

export default {
  plugins: [
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['src/**'],
      exclude: ['node_modules/**'],
    }),
  ],
};
```

该插件有两个属性需要说明：`throwOnError` 和 `throwOnWarning` 设置为 true 时，如果在 eslint 的检查过程中发现了 error 或 warning，就会抛出异常，阻止打包继续执行；如果设置为 false，就只会输出 eslint 检测结果，而不会停止打包。

### 兼容 CommonJS

npm 生态已经繁荣了多年，CommonJS 规范作为 npm 的包规范，大量的包都是基于 CommonJS 规范来开发的，因此在完美支持 ES6 模块规范之前，我们仍旧需要兼容 CommonJS 模块规范。

rollup 官方提供了 [@rollup/plugin-commonjs](https://www.npmjs.com/package/@rollup/plugin-commonjs) 插件，以便在编译过程中能正常使用 CommonJS 依赖包，同时还会搭配 [@rollup/plugin-node-resolve](https://www.npmjs.com/package/@rollup/plugin-node-resolve) 插件使用，解析模块路径。

```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  plugins: [
    resolve({
      extensions: ['.js', '.ts', '.tsx', '.json'],
      mainFields: ['module', 'main', 'browser'],
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
```

### 代码压缩

在生产环境，我们常常需要配置代码压缩功能，这不仅能极大程度减少 bundle 体积大小，也能保护代码。

使用 [rollup-plugin-terser](https://www.npmjs.com/package/rollup-plugin-terser) 插件压缩代码。

```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  plugins: [
    reoslve(),
    commonjs(),
    babel(),
    terser(), // terser
  ],
};
```

### 编译 TypeScript

现在前端已经有很多程序是使用 typescript 开发，这得益于 ts 优秀的类型检查机制，备受好评。

使用 [rollup-plugin-typescript2](https://www.npmjs.com/package/rollup-plugin-typescript2) 插件。（官方维护的 [@rollup/plugin-typescript](https://www.npmjs.com/package/@rollup/plugin-typescript) 貌似有点问题）

```js
import typescript from 'rollup-plugin-typescript2';

export default {
  plugins: [
    typescript({
      lib: ['es5', 'es6', 'dom'],
      target: 'es5', // 输出目标
      noEmitOnError: true, // 运行时是否验证ts错误
    }),
  ],
};
```

### 编译 JSX

基于组件化开发，jsx 无疑是一种很好的开发方式，随着 vue3 发布，不管是 react 还是 vue 都对 jsx 有了很好的支持。

如果是 vue3 开发的程序，还需要配置 babel [@vue/babel-plugin-jsx](https://www.npmjs.com/package/@vue/babel-plugin-jsx) 编译插件。同时，官方推荐 [acorn-jsx](https://www.npmjs.com/package/acorn-jsx) JSX 解析器将源代码解析成 JSX AST。

### CSS 预处理器

现代 web 开发，scss/less/stylus 比纯 css 有更丰富的语法支持，更有利于工程化开发。

使用 [rollup-plugin-postcss](https://www.npmjs.com/package/rollup-plugin-postcss) 插件，搭配 [cssnano](https://www.npmjs.com/package/cssnano) 插件可将 Sass/Stylus/Less 文件打包。

```js
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';

export default {
  plugins: [
    postcss({
      plugins: [cssnano],
      extract: path.resolve('dist/assets/style.css'), // only for v3
    }),
  ],
};
```

## rollup vs webpack

webpack 诞生的时候，为了解决 css、image 等静态文件的构建和使得代码能够按需加载实现了 code-splitting，在我们日常线上业务代码开发中，或多或少有一些静态资源需要打包，此时 rollup 显得不太适用。所以我们可以看到，在构建一些 lib 的时候可以选择 rollup，而在构建一些应用的时候，选择 webpack 更为合适。

## 总结

rollup 的配置是相对简单的，我们只需要关注项目打包的入口、输出文件、插件配置即可。而 webpack 配置就相对复杂了，这也得益于 webpack 社区更健壮，产生了较为完善的 webpack 生态。事实情况也是如此，rollup 更像是小众且名声在外的打包工具，适用于一些类库代码的构建，项目体量相对较小，并且更接近现代化前端开发模式，开发者不需要过多考虑代码的兼容性。
