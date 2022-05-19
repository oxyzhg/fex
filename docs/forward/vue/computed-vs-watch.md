---
id: computed-vs-watch
title: 计算属性 vs 侦听属性
---

## computed

计算属性的初始化是发生在 Vue 实例初始化阶段的 `initState` 函数中，执行了 `initComputed` 方法。

```js title="src/core/instance/state.js"
// highlight-next-line
const computedWatcherOptions = { lazy: true };
function initComputed(vm: Component, computed: Object) {
  const watchers = (vm._computedWatchers = Object.create(null));

  for (const key in computed) {
    const userDef = computed[key];
    const getter = typeof userDef === 'function' ? userDef : userDef.get;
    // ...
    // create internal watcher for the computed property.
    // highlight-next-line
    watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);

    // highlight-next-line
    defineComputed(vm, key, userDef);
  }
}

export function defineComputed(target: any, key: string, userDef: Object | Function) {
  const shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
  }
  // ...
  // highlight-next-line
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      // highlight-start
      watcher.depend();
      return watcher.evaluate();
      // highlight-end
    }
  };
}
```

这里先是创建了内部 computed watcher，并不会立刻求值。然后是利用 `Object.defineProperty` 给计算属性对应的 `key` 值添加 getter 和 setter，setter 通常是计算属性是一个对象，并且拥有 `set` 方法的时候才有，否则是一个空函数。当访问该计算属性时触发 getter 进而计算返回值，计算的方法就是实例化 computed watcher 时用户自定义的方法。

注意在实例化 computed watcher 时传入的 `computedWatcherOptions` 参数，这里 `lazy` 字段作为 computed watcher 的标识是后续执行一些方法的判断条件。

下面是简化版的 Watcher 类。

```js title="src/core/observer/watcher.js"
export default class Watcher {
  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    // ...
    this.lazy = !!options.lazy;
    this.dirty = this.lazy; // for lazy watchers
    // ...
    // highlight-next-line
    this.value = this.lazy ? undefined : this.get();
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update() {
    // highlight-next-line
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate() {
    // highlight-next-line
    this.value = this.get();
    this.dirty = false;
  }
}
```

这里注意 `this.dirty` 属性，初始值是 `true`，计算一次后变为 `false`，数据变化后执行 `watcher.update()` 方法再次变为 `true`。在这个变化中我们可以得出，当 `dirty=true` 时表示数据未经计算，当 `dirty=false` 时表示数据已经计算。

真实的场景是，如果计算数据依赖的某个响应式数据发生变化，通知 computed watcher 下次被访问可以重新计算新值，下次该计算属性被访问时，再计算新值。

总结：**计算属性只有被访问时才会触发计算，且如果数据没有变化，这个值是之前缓存的计算值。**

## watch

侦听属性的初始化也发生在 Vue 实例初始化阶段的 `initState` 函数中，执行了 `initWatch` 方法。

```js title="src/core/instance/state.js"
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm: Component, expOrFn: string | Function, handler: any, options?: Object) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  // highlight-next-line
  return vm.$watch(expOrFn, handler, options);
}
```

这里首先对 `hanlder` 的类型做判断，拿到它最终的回调函数，最后调用 `vm.$watch(keyOrFn, handler, options)` 函数。

```js title="src/core/instance/state.js"
Vue.prototype.$watch = function (expOrFn: string | Function, cb: any, options?: Object): Function {
  const vm: Component = this;
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options);
  }
  options = options || {};
  // highlight-next-line
  options.user = true;

  // highlight-next-line
  const watcher = new Watcher(vm, expOrFn, cb, options);
  if (options.immediate) {
    try {
      cb.call(vm, watcher.value);
    } catch (error) {
      handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`);
    }
  }
  return function unwatchFn() {
    watcher.teardown();
  };
};
```

`vm.$watch` 方法最终实例化了一个 user watcher，所以本质上侦听属性也是基于 Watcher 实现的。

## Watcher options

Watcher 构造函数对 `options` 做了处理：

```js
class watcher {
  constructor(vm, expOrFn, cb, options, isRenderWatcher) {
    // ...
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    // ...
  }
}
```

Watcher 分类：

- 按实例化场景：`render watcher`, `computed watcher`, `user watcher`.
- 按参数类型：`deep watcher`, `user watcher`, `lazy watcher`, `sync watcher`.

特别地，`deep watcher` 模式下会深层递归遍历一个对象，这是逐个触发它们的 getter 的过程，这样就可以收集到依赖，但有一定的性能开销，因此在开发中是否要深层次监听还得斟酌而定。`sync watcher` 模式下会同步更新而不是在队列中等待下一个 tick 再执行。

就应用场景而言，计算属性适合用在模板渲染中，某个值是依赖了其它的响应式对象甚至是计算属性计算而来；而侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑。
