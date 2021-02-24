---
id: reactive
title: 响应式原理
---

Vue 的数据驱动除了数据渲染 DOM 之外，还有一个很重要的体现就是数据的变更会触发 DOM 的变化。

## 响应式对象

Vue.js 2.0 实现响应式的核心是利用了 ES5 的 `Object.defineProperty`。该方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

```js
Object.defineProperty(obj, prop, descriptor);
```

`obj` 是要在其上定义属性的对象；`prop` 是要定义或修改的属性的名称；`descriptor` 是将被定义或修改的属性描述符。

比较核心的是 `descriptor`，它有很多可选键值，具体的可以去参阅它的[文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 。而在 Vue.js 中 主要是通过 `get` 和 `set` 劫持数据。

### initState

前面讲到，在初始化阶段会执行 `_init` 方法进行一系列初始化，其中一项就是执行 `initState` 方法，它的主要作用就是实现数据响应式。

```js title="src/core/instance/state.js"
export function initState(vm: Component) {
  vm._watchers = [];
  const opts = vm.$options;
  // highlight-next-line
  if (opts.props) initProps(vm, opts.props);
  if (opts.methods) initMethods(vm, opts.methods);
  if (opts.data) {
    // highlight-next-line
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
  // highlight-next-line
  if (opts.computed) initComputed(vm, opts.computed);
  if (opts.watch && opts.watch !== nativeWatch) {
    // highlight-next-line
    initWatch(vm, opts.watch);
  }
}
```

`initState` 方法主要是对 `props`、`methods`、`data`、`computed` 和 `wathcer` 等属性做了初始化操作。

#### initProps

```js title="src/core/instance/state.js"
function initProps(vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {};
  const props = (vm._props = {});
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = (vm.$options._propKeys = []);
  const isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  for (const key in propsOptions) {
    keys.push(key);
    const value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key);
      // ...
      // highlight-next-line
      defineReactive(props, key, value);
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      // highlight-next-line
      proxy(vm, `_props`, key);
    }
  }
  toggleObserving(true);
}
```

`props` 的初始化主要过程主完成两件事，一是调用 `defineReactive` 方法定义响应式，一是通过 `proxy` 把 `vm._props.xxx` 的访问代理到 `vm.xxx` 上。

#### initData

```js title="src/core/instance/state.js"
function initData(vm: Component) {
  let data = vm.$options.data;
  // highlight-next-line
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
  if (!isPlainObject(data)) {
    data = {};
  }
  // proxy data on instance
  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    // ...
    // highlight-next-line
    proxy(vm, `_data`, key);
  }
  // observe data
  // highlight-next-line
  observe(data, true /* asRootData */);
}
```

`data` 的初始化主要过程也是做两件事，一个是对定义 `data` 函数返回对象的遍历，通过 `proxy` 把每一个值 `vm._data.xxx` 都代理到 `vm.xxx` 上；另一个是调用 `observe` 方法劫持数据，定义响应式，可以通过 `vm._data.xxx` 访问到定义 `data` 返回函数中对应的属性。

可以看到，`props` 和 `data` 都在初始化阶段，遍历键值定义数据响应式，并把他们的访问方式通过 `proxy` 作了代理。

### proxy

```js title="src/core/instance/state.js"
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
```

通过 `Object.defineProperty` 把 `target[sourceKey][key]` 的读写变成了对 `target[key]` 的读写。

### observe

`observe` 的功能就是用来监测数据的变化。

```js title="src/core/observer/index.js"
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe(value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob: Observer | void;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    // highlight-next-line
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}
```

`observe` 方法的作用就是给非 VNode 的**对象类型数据**添加一个 `Observer`，如果已经添加过则直接返回，否则在满足一定条件下去实例化一个 `Observer` 对象实例。

### Observer

`Observer` 是一个类，它的作用是给对象的属性添加 `getter` 和 `setter`，用于**依赖收集**和**派发更新**。

```js title="src/core/observer/index.js"
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor(value: any) {
    this.value = value;
    // highlight-next-line
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      // highlight-next-line
      this.observeArray(value);
    } else {
      // highlight-next-line
      this.walk(value);
    }
  }

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      // highlight-next-line
      defineReactive(obj, keys[i]);
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}
```

首先会实例化 `Dep` 对象，接下来会对 `value` 做判断，对于数组会调用 `observeArray` 方法，否则对纯对象调用 `walk` 方法。他们最终都会通过调用 `defineReactive` 方法定义响应式对象。

### defineReactive

`defineReactive` 的功能就是定义一个响应式对象，给对象动态添加 `getter` 和 `setter`。

```js title="src/core/observer/index.js"
/**
 * Define a reactive property on an Object.
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  // highlight-next-line
  const dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  // highlight-next-line
  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        // highlight-next-line
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      // ...
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      // highlight-next-line
      dep.notify();
    },
  });
}
```

这个过程有以下几个步骤：

1. 初始化 `Dep` 对象的实例；
2. 对子对象递归调用 `observe` 方法，这样就保证了无论 `obj` 的结构多复杂，它的所有子属性也能变成响应式的对象；
3. 利用 `Object.defineProperty` 去给 `key` 添加 getter 和 setter 进行数据劫持。

:::important
响应式对象的核心就是利用 `Object.defineProperty` 给数据添加了 getter 和 setter，目的就是为了在我们访问数据以及写数据的时候能自动执行一些逻辑：getter 处理依赖收集，setter 处理派发更新。
:::

## 依赖收集

### Dep

在执行 `defineReactive` 方法定义数据响应式时，初始化了一个 `Dep` 对象的实例，它的作用是整个 getter 依赖收集的核心。

```js title="src/core/observer/dep.js"
import type Watcher from './watcher';
import { remove } from '../util/index';

let uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub: Watcher) {
    this.subs.push(sub);
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice();
    // highlight-start
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
    // highlight-end
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
// highlight-next-line
Dep.target = null;
const targetStack = [];

export function pushTarget(_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}

export function popTarget() {
  Dep.target = targetStack.pop();
}
```

`Dep` 是一个 Class，它定义了一些属性和方法，这里需要特别注意的是它有一个静态属性 `target`，这是一个全局唯一 `Watcher`，这是一个非常巧妙的设计，因为在同一时间只能有一个全局的 `Watcher` 被计算，另外它的自身属性 `subs` 也是 `Watcher` 的数组。

`Dep` 实际上就是对 `Watcher` 的一种管理，`Dep` 脱离 `Watcher` 单独存在是没有意义的。

### Watcher

```js title="src/core/observer/watcher.js"
let uid = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  computed: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  dep: Dep;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;

  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.computed = !!options.computed;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.computed = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid; // uid for batching
    this.active = true;
    // highlight-next-line
    this.dirty = this.computed; // for computed watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new Set();
    this.newDepIds = new Set();
    this.expression = process.env.NODE_ENV !== 'production' ? expOrFn.toString() : '';
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = function () {};
        // ...
      }
    }
    // highlight-start
    if (this.computed) {
      this.value = undefined;
      this.dep = new Dep();
    } else {
      this.value = this.get();
    }
    // highlight-end
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get() {
    pushTarget(this);
    let value;
    const vm = this.vm;
    try {
      // highlight-next-line
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`);
      } else {
        throw e;
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      // highlight-start
      if (this.deep) {
        traverse(value);
      }
      // highlight-end
      popTarget();
      this.cleanupDeps();
    }
    return value;
  }

  /**
   * Add a dependency to this directive.
   */
  addDep(dep: Dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps() {
    let i = this.deps.length;
    while (i--) {
      const dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    let tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update() {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      // highlight-next-line
      queueWatcher(this);
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  run() {
    if (this.active) {
      const value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`);
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate() {
    this.value = this.get();
    this.dirty = false;
  }
}
```

`Watcher` 是一个 Class，在它的构造函数中，定义了一些与依赖收集相关的属性。

### 过程分析

以渲染 Watcher 为例：

```js
let updateComponent = () => {
  // highlight-next-line
  vm._update(vm._render(), hydrating);
};

new Watcher(
  vm,
  updateComponent,
  noop,
  {
    before() {
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate');
      }
    },
  },
  true /* isRenderWatcher */
);
```

1. 在执行 `mountComponent` 方法时，会先实例化一个渲染 Watcher，并且更新组件的方法以 `expOrFn` 参数的形式传入，即之后 Watcher 内部的 `getter` 实例方法。
2. 接着执行它的 `this.get()` 方法，这里会通过 `pushTarget` 把当前 `watcher` 压入 `targetStack` 栈顶。
3. 然后执行 `this.getter` 方法，即 `updateComponent` 方法，创建 VNode 并渲染到页面。
4. 其中，在执行 `vm._render()` 方法生成 VNode 时，会访问 `vm` 上定义的响应式数据，此时触发数据对象的 getter。进而执行 `dep.depend`，这个方法的作用是执行 `Dep.target.addDep(this)` 方法，先在订阅者渲染 Watcher 内部保存当前 `dep` 实例；然后再反过来执行 `dep.addSub(this)` 方法，即把当前的 `watcher` 订阅者保存到这个数据持有的 `dep` 中。
5. 以上依赖收集完成后，还要深度触发所有子项的 getter。
6. 接下来执行 `popTarget` 将当前 Watcher 弹出栈，将 `Dep.target` 恢复成上一个状态。
7. 最后执行 `this.cleanupDeps()` 方法，清空依赖。

由于在执行 `vm_render` 方法时，会触发所有视图中用到的数据的 getter，这样实际上就完成了一个依赖收集的过程。其实这里是双向收集的过程，先是订阅者收集依赖，然后依赖又收集了订阅者，这样做的目的是为后续数据变化时候能通知到哪些 `subs` 做准备。

考虑到 Vue.js 是数据驱动，所以每次数据变化都会重新 render，那么 `vm._render()` 方法又会再次执行，并再次触发数据的 getters，为避免重复收集依赖 Watcher 在构造函数中会初始化 2 个 Dep 实例数组，`newDeps` 表示新添加的 Dep 实例数组，而 `deps` 表示上一次添加的 Dep 实例数组。

其实 `Watcher` 和 `Dep` 就是一个非常经典的**观察者设计模式**的实现。

## 派发更新

### 过程分析

当我们在组件中对响应的数据做了修改，就会触发 setter 的逻辑，调用 `dep.notify()` 方法进行更新。它的作用是遍历所有的 `subs`，也就是 Watcher 的实例数组，执行每一个 `watcher.update` 方法。对于一般的 Watcher 更新场景，会执行到 `queueWatcher(this)` 方法。

```js title="src/core/observer/scheduler.js"
const queue: Array<Watcher> = [];
let has: { [key: number]: ?true } = {};
let waiting = false;
let flushing = false;
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
export function queueWatcher(watcher: Watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      // highlight-next-line
      nextTick(flushSchedulerQueue);
    }
  }
}
```

这里引入了一个队列的概念，这也是 Vue 在做派发更新的时候的一个优化的点，它并不会每次数据改变都触发 `watcher` 的回调，而是把这些 `watcher` 先添加到一个队列里，然后在 `nextTick` 后执行 `flushSchedulerQueue`。

```js title="src/core/observer/scheduler.js"
let flushing = false;
let index = 0;
/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue() {
  flushing = true;
  let watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  // highlight-next-line
  queue.sort((a, b) => a.id - b.id);

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    // highlight-next-line
    watcher.run();
    // ...
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice();
  const updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);
  // ...
}
```

对队列做了从小到大的排序，这么做主要有以下要确保以下几点：

1. 组件的更新由父到子；因为父组件的创建过程是先于子的，所以 Watcher 的创建也是先父后子，执行顺序也应该保持先父后子。
2. 用户的自定义 Watcher 要优先于渲染 Watcher 执行；因为用户自定义 Watcher 是在渲染 Watcher 之前创建的。
3. 如果一个组件在父组件的 Watcher 执行期间被销毁，那么它对应的 Watcher 执行都可以被跳过，所以父组件的 Watcher 应该先执行。

在对 `queue` 排序后，接着就是要对它做遍历，拿到对应的 watcher，执行 `watcher.run()` 方法。该方法会先调用 `this.get()` 获取到最新值，然后执行实例化 Watcher 时传入的回调函数，这种回调函数通常就是我们自定义 Watcher 时的函数。对于渲染 Watcher 方法而言，由于执行 `this.get()` 方法，就会触发重新渲染。

最后，等队列中的 Watcher 都更新完成，执行 `resetSchedulerState` 恢复状态。

整个派发更新的过程可以归纳为以下几个步骤：

1. 修改数据触发响应式数据 getter，遍历所有 `subs` 执行 `sub.update()` 方法派发更新。
2. 对于同一个事件循环里的更新，会维护一个队列，等本轮事件执行结束后，再清空队列执行 Watcher 更新，即执行 `watcher.run()` 方法。
3. 全部更新执行完成后，恢复状态。
