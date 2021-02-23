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
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
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

## 派发更新
