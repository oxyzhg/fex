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

当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下：

1. getDerivedStateFromProps
2. shouldComponentUpdate
3. **render**
4. getSnapshotBeforeUpdate
5. **componentDidUpdate**

### Unmounting

当组件从 DOM 中移除时会调用如下方法：

1. **componentWillUnmount**

## 生命周期变化

React 在 v16.3 版本之后，更新了一批生命周期函数，当然一些旧的生命周期在过渡阶段仍然可以通过其它方式调用，只不过接下来的版本会逐渐废弃这些旧的生命周期。

逐渐废弃的生命周期方法：

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

新添加的生命周期方法：

- static getDerivedStateFromProps (使用 props 来派生/更新 state)
- static getSnapshotBeforeUpdate

参考资料：

- [React – A JavaScript library for building user interfaces](https://reactjs.org/)
- [React lifecycle methods diagram](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
- [You Probably Don't Need Derived State](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)
