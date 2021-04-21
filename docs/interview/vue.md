---
id: vue
title: Vue 相关题目总结
---

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

### v-show 与 v-if 有什么区别？

- **v-if** 是真正的条件渲染，因为它会涉及切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；也是惰性的，如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
- **v-show** 是基于 CSS display 属性的简单切换，不管初始条件是什么，元素总是会被渲染。

因此，v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景。

### class 与 style 如何动态绑定？

动态绑定实质上是传入表达式值，可接收的参数可以是数组或对象。市面上开源库也有 clsx 库支持动态绑定。

### 怎样理解 Vue 的单向数据流？

父子组件之间 prop 之间形成了一个**单向下行绑定**：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外改变父级组件的状态，从而导致某个模块的数据流向难以理解。

如果修改 prop 值是必要的，建议在子组件内部拷贝一份新值，但也要特别主要引用数据类型。

### computed 和 watch 的区别和运用的场景？

区别：

- `computed` 是计算属性，属于 **lazy watcher**， 它依赖其它属性值，且有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会触发重新计算。
- `watch` 是侦听属性，属于 **user watcher**，更多的是观察的作用，类似于某些数据的监听回调，每当监听的数据变化时都会执行回调进行后续操作。

运用场景：

- 当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用其缓存特性，避免每次获取值时，都要重新计算。
- 当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许我们执行异步操作，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

### 谈谈你对 Vue 生命周期的理解？

Vue 实例的生命周期是指组件实例从创建到销毁的过程，中间可能会有实例更新过程。具体有：初始化、模板编译、挂载 DOM、渲染更新、卸载等。生命周期钩子函数实际上是在这个过程某些特殊的点执行的自定义函数。

- 在 beforeCreate 阶段组件实例被创建，但还不可用；
- 在 created 阶段组件实例已完成数据响应式定义，但真实节点还未生成，`$el` 无值；
- beforeMount 在挂载开始前调用，相关 render 函数首次被调用；
- 在 mounted 阶段组件实例首次被挂载到页面，`$el` 有值；
- beforeUpdate 在数据更新后视图更新前调用，发生在 VNode 打补丁前；
- 在 updated 阶段完成视图更新；
- beforeDestory 在组件销毁前调用；
- 在 destoryed 阶段前，完成从父实例移除自身、销毁 Watcher、销毁已渲染节点等操作。

通常我们可以在 created、beforeMount、mounted 三个钩子函数中执行异步操作，因为在这三个阶段，响应式数据已经创建和代理，异步请求返回的数据可赋值报错。

### Vue 的父组件和子组件生命周期钩子函数执行顺序？

父子组件生命周期钩子函数执行顺序可以归纳为先子后父，即先完成子组件再完成父组件，具体可归类为以下几部分：

加载渲染过程：父 beforeCreate -> 父 created -> 父 beforeMount -> 子 beforeCreate -> 子 created -> 子 beforeMount -> 子 mounted -> 父 mounted

组件更新过程：父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

销毁过程：父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

### 谈谈你对 keep-alive 的了解？

keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，避免重新渲染，其有以下特性：

- keep-alive 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
- keep-alive 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。
- 当组件在 keep-alive 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被调用。

### 组件中 data 为什么是一个函数？

因为组件是用来复用的，同一个组件的构造函数只会创建一次并缓存，如果组件中 data 是一个对象，那么每次组件实例化后 data 是共享的，如果组件中 data 是一个函数，那么每次组件实例化后都会执行函数返回新的数据，从而实现作用域隔离，消除组件复用时相互影响的隐患。而 new Vue 的实例，是不会被复用的，因此不存在数据共用的问题。

### v-model 的原理？

我们知道，Vue 是数据驱动视图，而 DOM 的变化也能影响数据，这是一个双向关系。`v-model` 是数据双向绑定的语法糖，它即可以作用在普通表单元素上，又可以作用在组件上。

### Vue 组件间通信有哪几种方式？

Vue 组件间通信只要指以下 3 类通信：父子组件通信、隔代组件通信、兄弟组件通信。

- `prop/$emit` 适用父子组件通信
- `ref/$parent/$children` 适用父子组件通信
- `$attrs/$listeners` 适用于隔代通信（透传）
- `provide/inject` 适用于隔代通信
- `EventBus($emit/$on)` 普适
- `vuex` 普适

其中一部分属性在 vue3 中已经移除，包括：`$children`, `$listeners`, `$on`, `$off`, `$once` 等，因此部分通信方式在 vue3 中发生变化。

### vue-router 有哪些钩子函数

全局守卫：

- `beforeEach`
- `beforeResolve`
- `afterEach`

路由独享守卫：

- `beforeEnter`

组件内钩子函数：

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

完整的导航解析流程：

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### vue-router 路由模式有几种？

vue-router 有三种路由模式：hash、history、abstract，默认是 hash 模式。

- **hash**: 使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History API 的浏览器。
- **history**: 依赖 HTML5 History API 和服务器配置。
- **abstract**: 支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式。

### vue-router 中常用的 hash 和 history 路由模式实现原理？

默认情况下，当地址栏的 URL 发生变化时，浏览器会向服务端发起新的请求。所以实现前端路由的重要基础就是在修改 URL 时，不引起浏览器向后端请求数据。

**基于 hash 实现**

1. hash 值的变化不会触发浏览器发起请求。
2. 通过 location.hash 属性可以读写 hash 值。
3. 通过监听 window 对象的 hashchange 事件就可以感知到它的变化。

**基于 history 实现**

1. HTML5 [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) 提供了两个函数来修改 URL，即 `history.pushState` 和 `history.repalceState`，这两个 API 可以在不进行刷新的情况下，来操作浏览器的历史记录。唯一不同的是，前者是新增一个历史记录，后者是直接替换当前的历史记录。
2. 通过监听 window 对象上的 popstate 事件可监听 URL 变化。但需要注意的是，`pushState` 和 `replaceState` 不会触发 popstate 事件，这时我们需要手动触发页面渲染。
3. 虽然能通过这种方式实现前端路由功能，但并不能拦截浏览器默认的请求行为，当用户修改地址栏网址时还是会向服务端发起请求，所以还需要服务端进行设置，将所有 URL 请求转向前端页面，交给前端进行解析。

### 什么是 MVVM？

MVVM（Model–View–ViewModel）是一个软件架构设计模式，是一种简化用户界面的事件驱动的编程方式。

MVVM 的核心是 ViewModel 层，它在 Model 和 View 之间起到中转作用，其内置的 Binder（Data-binding Engine，数据绑定引擎）实现了 View 和 Model 的双向绑定，一方发生变化另一方可自动更新，操作者不必手动低效的操纵 DOM 更新视图。这样的设计使数据驱动视图变得非常容易，通常我们只需要关注数据模型正确即可确保视图正确。

### Vue 是如何实现数据双向绑定的？

Vue 数据双向绑定主要是指：数据变化更新视图，视图变化更新数据。

对于数据变化更新视图，即数据驱动，Vue 通过定义响应式数据，劫持数据 getter 和 setter 钩子，页面渲染时触发 getter 收集依赖，数据更新时触发 setter 派发更新。

对于视图变化更新数据，Vue 在编译时对一些表单元素或组件进行特殊配置，适当的绑定了数据更新监听事件，视图更新触发事件即可更新对应的数据。

Vue 中几个核心类分别是：

- **Observer**: 实现数据监听，对数据进行深度遍历，利用 `Object.defineProperty()` 给属性都加上 getter 和 setter。这样页面渲染时触发 getter 收集依赖，数据更新时触发 setter 派发更新。
- **Watcher**: 是数据驱动的核心，主要的任务是作为响应式数据的订阅者，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。
- **Dep**: 采用发布-订阅设计模式，用来收集订阅者 Watcher，对监听器 Observer 和订阅者 Watcher 进行统一管理。
- **Compile**: 解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新。

### Vue 怎么实现对象和数组的监听？

通过 `Object.defineProperty()` 方法给对象属性都加上 getter 和 setter 钩子，页面渲染时触发 getter 收集依赖，数据更新时触发 setter 派发更新。

通过劫持数组原型方法，对于新增的数据定义响应式并派发更新。被劫持的原型方法又 `push`, `pop`, `shift`, `unshift`, `splice`, `reverse`, `sort`，其中 push/unshift/splice 能拦截新增数据进而定义响应式数据。这就是为什么直接修改数组长度和修改数组索引值没法实现响应式更新的原因。

### Proxy 与 Object.defineProperty 区别

- Proxy 可以直接监听对象，而 Object.defineProperty 只能监听对象属性。
- Proxy 可以直接监听数组的变化，而 Object.defineProperty 不具备监听数组的能力。
- Proxy 有多达 13 种拦截方法；
- Proxy 作为新标准将受到浏览器厂商重点持续的性能优化。
- Proxy 存在浏览器兼容性问题，且不能通过 polyfill 实现兼容。

### Vue 怎么用 vm.$set() 解决对象新增属性不能响应的问题 ？

实现原理是：

- 如果目标是数组，直接使用数组的 `splice` 方法触发响应式；
- 如果目标是对象，先判断 key 是否是已存在属性、target 是否是响应式数据，否则就是新增响应式数据。

### 虚拟 DOM 的优缺点？

特点：

- **操作 DOM 成本降低**：搭配 MVVM 设计模式，开发者不必再去关注 DOM 操作，只需要写好 ViewModel 逻辑即可。
- **跨平台**：虚拟 DOM 本质上是普通对象，而 DOM 与平台强相关，相比之下虚拟 DOM 可以进行更方便地跨平台操作。目前 React/Vue 等框架都采用这种方式，提供了跨平台能力。
- **保证性能下限**：虚拟 DOM 往往要普适上层 API 操作，因此性能并不是最优的，但是比起粗暴的 DOM 操作性能要好很多，因此框架的虚拟 DOM 至少可以保证在你不需要手动优化的情况下，依然可以提供还不错的性能，即保证性能的下限。

### 虚拟 DOM 实现原理？

- DOM 抽象，用对象模拟真实 DOM 树；
- diff 算法，比较两棵虚拟 DOM 树的差异；
- pach 算法，将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。

### 你有对 Vue 项目进行哪些优化？

**代码层面的优化**

- v-if 和 v-show 区分使用场景
- computed 和 watch 区分使用场景
- v-for 遍历必须为 item 添加 key，且避免同时使用 v-if
- 长列表性能优化
- 事件的销毁
- 图片资源懒加载
- 路由懒加载
- 第三方插件的按需引入
- 优化无限列表性能
- 服务端渲染 SSR or 预渲染

**Webpack 层面的优化**

- Webpack 对图片进行压缩
- 减少 ES6 转为 ES5 的冗余代码
- 提取公共代码
- 模板预编译
- 提取组件的 CSS
- 优化 SourceMap
- 构建结果输出分析
- Vue 项目的编译优化

**基础的 Web 技术的优化**

- 开启 gzip 压缩
- 浏览器缓存
- CDN 的使用
- 使用 Chrome Performance 查找性能瓶颈
