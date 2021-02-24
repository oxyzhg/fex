---
id: lifecycle
title: 生命周期
---

<!-- ![Vue Lifecycle](https://cn.vuejs.org/images/lifecycle.png) -->

每个 Vue 实例在被创建之前都要经过一系列的初始化过程。例如需要设置数据监听、编译模板、挂载 DOM 实例、在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，给予用户机会在一些特定的场景下添加他们自己的代码。

## 生命周期钩子

- **beforeCreate**
- **created**
- **beforeMount**
- **mounted**
- **beforeUpdate**
- **updated**
- activated
- deactivated
- **beforeDestroy**
- **destroyed**
- errorCaptured

各生命周期钩子函数事件标识：

beforeCreate: 实例初始化后，完成了配置合并、初始化生命周期、事件中心、渲染相关配置，是 Vue 实例属性装配的过程
created: 实例创建后，完成了数据初始化，此时已经可以通过 this 访问属性/方法
