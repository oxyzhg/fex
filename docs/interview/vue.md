---
id: vue
title: Vue 面试相关总结
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

### 直接给一个数组项赋值，Vue 能检测到变化吗？

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

MVVM（Model–View–ViewModel）是一个软件架构设计模式，是一种简化用户界面的事件驱动编程方式。

MVVM 的核心是 ViewModel 层，它在 Model 和 View 之间起到中转作用，其内置的 Binder（Data-binding Engine，数据绑定引擎）实现了 View 和 Model 的双向绑定，一方发生变化另一方可自动更新。

### Vue 是如何实现数据双向绑定的？

Vue 数据双向绑定主要是指：数据变化更新视图，视图变化更新数据。
