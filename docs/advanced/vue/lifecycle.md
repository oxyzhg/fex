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

各生命周期钩子函数相关事件标识：

| 阶段          | 作用                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------- |
| beforeCreate  | 实例初始化后，完成了配置合并、初始化生命周期、事件中心、渲染相关配置，是 Vue 实例属性装配的过程 |
| created       | 实例创建后，完成了数据初始化，此时已经可以通过 `this` 访问属性和方法                            |
| beforeMount   | 实例挂载前，此时还未调用 render 方法生成 VNode，因此 `vm.$vnode` 不可访问                       |
| mounted       | 实例挂载后，已生成 VNode，并且完成组件挂载在，此时页面是初次渲染                                |
| beforeUpdate  | 数据更新后，发生在清空更新队列时                                                                |
| updated       | 组件重新渲染后，完成了 DOM 更新                                                                 |
| beforeDestroy |                                                                                                 |
| destroyed     | 执行了一些销毁动作，包括从父实例移除自身、删除 watcher、销毁当前渲染的 VNode 等                 |

## 从源码解读组件生命周期

源码中最终执行生命周期的函数都是调用 `callHook` 方法。

```js title="src/core/instance/lifecycle.js"
export function callHook(vm: Component, hook: string) {
  pushTarget();
  const handlers = vm.$options[hook];
  const info = `${hook} hook`;
  if (handlers) {
    for (let i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}
```

### beforeCreate & created

beforeCreate 和 created 钩子函数都发生在实例化阶段，在 `_init` 方法中执行。

```js title="src/core/instance/init.js"
Vue.prototype._init = function (options?: Object) {
  // ...
  initLifecycle(vm);
  initEvents(vm);
  initRender(vm);
  // highlight-next-line
  callHook(vm, 'beforeCreate');
  initInjections(vm); // resolve injections before data/props
  initState(vm);
  initProvide(vm); // resolve provide after data/props
  // highlight-next-line
  callHook(vm, 'created');
  // ...
};
```

我们可以看到，在调用 beforeCreate 钩子函数时，完成了配置合并、初始化生命周期、事件中心、渲染相关配置等，属于根据与用户的配置装配构造函数的过程，因此在该钩子函数中，没有完成数据响应式定义等，我仅只能看到一些已配置属性。

在调用 created 钩子函数时，已完成数据响应式定义，包括初始化 data、props、computed、watcher 等，我们可以在实例中访问一些属性方法，此时的数据已完成代理和响应式定义。

### beforeMount & mounted

beforeMount 钩子函数发生在 DOM 挂载前，在 `mountComponent` 方法中执行。

```js title="src/core/instance/lifecycle.js"
export function mountComponent(vm: Component, el: ?Element, hydrating?: boolean): Component {
  vm.$el = el;
  // ...
  // highlight-next-line
  callHook(vm, 'beforeMount');

  let updateComponent = () => {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      },
    },
    true /* isRenderWatcher */
  );
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm;
}
```

我们可以看到，beforeMount 钩子函数在 `vm._render()` 方法执行前调用，因此在该钩子函数中，还未生成 VNode，页面也未生成。

mounted 钩子函数发生在 VNode 挂载后，在 `invokeInsertHook` 方法中执行。

```js title="src/core/vdom/patch.js"
function invokeInsertHook(vnode, queue, initial) {
  // delay insert hooks for component root nodes, invoke them after the
  // element is really inserted
  if (isTrue(initial) && isDef(vnode.parent)) {
    vnode.parent.data.pendingInsert = queue;
  } else {
    for (let i = 0; i < queue.length; ++i) {
      queue[i].data.hook.insert(queue[i]);
    }
  }
}
```

```js title="src/core/vdom/create-component.js"
const componentVNodeHooks = {
  // ...
  insert(vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      // highlight-next-line
      callHook(componentInstance, 'mounted');
    }
    // ...
  },
};
```

我们可以看到，mounted 钩子函数发生在组件 VNode 插入到 DOM 中，此时已经完成了数据驱动的页面渲染，我们能在实例中访问到 `$el` 属性。`insertedVNodeQueue` 的添加顺序是先父后子，所以对于同步渲染的子组件而言，mounted 钩子的执行顺序也是先父后子。

### beforeUpdate & updated

beforeUpdate 钩子函数发生在实例数据放生变化更新 DOM 前，定义在监听器的 before 函数中。

```js title="src/core/instance/lifecycle.js"
export function mountComponent(vm: Component, el: ?Element, hydrating?: boolean): Component {
  vm.$el = el;
  // ...
  callHook(vm, 'beforeMount');

  let updateComponent = () => {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(
    vm,
    updateComponent,
    noop,
    {
      before() {
        if (vm._isMounted && !vm._isDestroyed) {
          // highlight-next-line
          callHook(vm, 'beforeUpdate');
        }
      },
    },
    true /* isRenderWatcher */
  );
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm;
}
```

此时数据已发生变化，相关渲染 Watcher 更新 DOM 之前，未发生实际变化。

updated 钩子函数的执行时机在 `flushSchedulerQueue` 函数调用时。

```js title="src/core/observer/scheduler.js"
function flushSchedulerQueue() {
  // ...
  // 获取到 updatedQueue
  callUpdatedHooks(updatedQueue);
}

function callUpdatedHooks(queue) {
  let i = queue.length;
  while (i--) {
    const watcher = queue[i];
    const vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      // highlight-next-line
      callHook(vm, 'updated');
    }
  }
}
```

之前我们提到过，组件是异步更新，即同一个事件循环中产生的更新存放到一个队列，在下一个 tick 中一起更新。

### beforeDestroy & destroyed

beforeDestroy 和 destroyed 钩子函数都发生在是组件销毁阶段，通过调用 `$destroy` 方法执行。

```js title=""
export function lifecycleMixin(Vue: Class<Component>) {
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {};

  Vue.prototype.$forceUpdate = function () {};

  Vue.prototype.$destroy = function () {
    const vm: Component = this;
    if (vm._isBeingDestroyed) {
      return;
    }
    // highlight-next-line
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    const parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    let i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    // highlight-next-line
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}
```

beforeDestroy 钩子函数的执行时机是在实例销毁前，此时还未开始进行组件销毁。destroy 钩子函数执行前，执行了一些销毁动作，包括从父实例移除自身、删除 watcher、销毁当前渲染的 VNode 等，待上述事件执行完毕触发 destroyed 钩子函数。

注意这里在执行完 `vm._patch(vm_vnode, null)` 后，先触发了 destroyed 钩子函数，然后才执行 `vm.$off()` 移除所有监听器，因此在 destroyed 阶段仍可访问组件实例。

### activated & deactivated

这两个生命周期钩子是为 **keep-alive** 内置组件专门定制的。

## 父子组件生命周期函数执行顺序

渲染过程：

1. 父 beforeCreate
2. 父 created
3. 父 beforeMount
4. 子 beforeCreate
5. 子 created
6. 子 beforeMount
7. 子 mounted
8. 父 mounted

更新过程：

1. 父 beforeUpdate
2. 子 beforeUpdate
3. 子 updated
4. 父 updated

销毁过程：

1. 父 beforeDestroy
2. 子 beforeDestroy
3. 子 destroyed
4. 父 destroyed

## 总结

组件的声明周期大致分为 4 个阶段：实例初始化、挂载、更新、销毁，每个阶段的始末又分为 2 个钩子，主要的生命周期钩子就是由这 8 个组成。

初始化阶段主要完成合并配置、初始化生命周期、事件中心、渲染相关配置、数据响应式定义等，此阶段不涉及 VNode 相关逻辑，是实例装配的过程。

组件挂载阶段主要完成渲染 Watcher 实例化、生成 VNode、渲染视图等，此阶段是将用户定义的配置渲染成页面的过程，详细逻辑很多。

组件更新阶段主要完成 DOM diff 和更新视图。

组件销毁阶段主要执行了一些销毁动作，包括从父实例移除自身、删除 watcher、销毁当前渲染的 VNode 等。
