---
id: lifecycle
title: 生命周期
---

React v16.3 开始，对生命周期进行调整，废弃了一些生命周期方法，添加了一些新的生命周期方法。具体参考 [React lifecycle methods diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)。

## 新生命周期

在运行过程中特定的阶段执行这些方法，达到页面灵活变化的目的。讨论 React 生命周期通常分三种过程：

- 挂载 (Mounting)
- 更新 (Updating)
- 卸载 (Unmounting)

### Mounting

当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：

1. **constructor**
2. getDerivedStateFromProps
3. **render**
4. **componentDidMount**

### Updating

当组件的 props 或 state 发生变化时会触发更新。组件的更新分为两种：一种是由父组件更新触发的更新；另一种是组件自身调用自己的 setState 触发的更新。组件更新的生命周期调用顺序如下：

1. getDerivedStateFromProps
2. shouldComponentUpdate
3. **render**
4. getSnapshotBeforeUpdate
5. **componentDidUpdate**

### Unmounting

当组件从 DOM 中移除时会调用如下方法：

1. **componentWillUnmount**

## 生命周期解读

各生命周期钩子函数相关事件标识：

| 阶段                     | 作用                                                                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| constructor              | 该方法仅在挂载前被调用一次。通常构造函数仅用于两种情况：一是初始化内部 state，二是时间处理函数绑定实例。                                                                                 |
| componentDidMount        | 该方法在组件挂在后立即调用。此时因为真实 DOM 已经挂载到了页面上，我们可以在这个生命周期里执行真实 DOM 相关的操作。此外，类似于异步请求、数据初始化这样的操作也可以放在这个生命周期来做。 |
| componentDidUpdate       | 该方法在组件更新后立即调用。可以在此处操作 DOM，也可以进行网络请求。此处谨慎调用 setState，否则可能会导致死循环。                                                                        |
| componentWillUnmount     | 该方法在组件卸载前调用。通常用于执行必要的清理操作。组件销毁常见的原因有两个：一个是组件在父组件中被移除；另一个是父组件重新渲染，发现组件 key 与上次不一样。                            |
| render                   | 该方法把需要渲染的内容返回出来。真实 DOM 的渲染工作，在挂载阶段是由 ReactDOM.render 来承接的。                                                                                           |
| shouldComponentUpdate    | 组件会根据该方法的返回值，来决定是否执行之后的生命周期，进而决定是否对组件进行重渲染。此方法仅作为性能优化的方式而存在，必要情况下可以考虑使用内置的 PureComponent 组件。                |
| getDerivedStateFromProps | 组件静态方法，在调用 render 方法前调用，内部无法访问 this。仅有一个用途：使用 props 来派生 state。这可以减少产生副作用的操作，避免生命周期的滥用，同时也是在为新的 Fiber 架构铺路。      |
| getSnapshotBeforeUpdate  | 它的执行时机是在 render 方法之后，真实 DOM 更新之前。在这个阶段里，我们可以同时获取到更新前的真实 DOM 和更新前后的 state&props 信息。                                                    |

Fiber 架构的重要特征就是**可以被打断**的异步渲染模式。根据能否被打断，声明周期又可以划分为 render 和 commit 两个阶段，而 commit 阶段又被细分为了 pre-commit 和 commit 两个阶段。具体可参考生命周期图谱，特征如下：

- **render**: 纯净且没有副作用，可能会被 React 暂停、终止或重新启动。
- **pre-commit**: 可以读取 DOM。
- **commit**: 可以使用 DOM，运行副作用，安排更新。

总的来说，**render 阶段在执行过程中允许被打断，而 commit 阶段则总是同步执行的。**

## 生命周期变化

React 在 v16.3 版本之后，更新了一批生命周期函数，当然一些旧的生命周期在过渡阶段仍然可以通过其它方式调用，只不过接下来的版本会逐渐废弃这些旧的生命周期。

新添加的生命周期方法：

- static getDerivedStateFromProps
- getSnapshotBeforeUpdate

逐渐废弃的生命周期方法：

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

在 Fiber 机制下，**render 阶段是允许暂停、终止和重启的**。当一个任务执行到一半被打断后，下一次渲染线程抢回主动权时，这个任务被重启的形式是重复执行一遍整个任务而非接着上次执行到的那行代码往下走。这就导致 render 阶段的生命周期都是有可能被重复执行的。

上述 3 个被废弃的生命周期有个共性，就是它们都处于 render 阶段，都可能重复被执行，而且由于这些 API 常年被滥用，它们在重复执行的过程中都存在着不可小觑的风险。

React 16 改造生命周期的主要动机是为了配合 Fiber 架构带来的异步渲染机制。这些调整，首先是确保了 Fiber 机制下数据和视图的安全性，同时也确保了生命周期方法的行为更加纯粹、可控、可预测。

参考资料：

- [React – A JavaScript library for building user interfaces](https://reactjs.org/)
- [React lifecycle methods diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
- [You Probably Don't Need Derived State](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)
