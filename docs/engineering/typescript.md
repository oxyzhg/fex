---
id: typescript
title: TypeScript
---

## 基础类型

### 原始类型

原始数据类型 `number, string, boolean, symbol, bigint, null, undefined` 在 ts 中都能找到对应的类型。这些关键字可以直接作为类型使用，也可以通过组合形成更高级的类型。其中，一些类型显式声明可能没有什么太大意义，它们常用于特定场景。

### 数组和元组

TypeScript 像 JavaScript 一样可以操作数组元素。两种定义数组的方式：

1. 在元素类型后面接上 `[]`，表示由此类型元素组成的一个数组。
2. 使用数组泛型 `Array<T>`

```ts
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```

元组类型表示一个已知元素数量和类型的数组。可以把它看作是特殊的数组，各元素的类型不必相同。

```ts
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

当访问一个已知索引的元素，会得到正确的类型；当访问一个越界的元素，会使用联合类型替代。

### 枚举类型

`enum` 类型是对 JavaScript 标准数据类型的一个补充。使用枚举类型可以为一组数值赋予友好的名字。

```ts
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green; // Green -> 1
```

注意事项：

- 默认情况下，从 0 开始为元素编号。
- 如果为其中某个元素指定数字编号，那么后面的元素编号会在此基础上递增。注意如果这个成员的值被设置为已有的值，那么元素对应的元素编号就会存在重复，这在 ts 中不会报错。
- 如果为其中某个元素指定字符编号，那么后面的元素都要进行赋值，或指定起始数字编号。
- 枚举类型的枚举项是只读属性，不能被修改。
- 枚举类型能作为变量使用，因此编译后不会像其他类型那样被去掉，而是会转为相应的 js 代码，因为涉及到了运行时。元素编号是数字时，可以根据编号映射到元素，字符类型不可以。
- 最长见的用法就是用于消除魔法字符串。

```ts
export enum TableState {
  Init = -1,     // 初始
  Saved = 0,     // 保存后（待提交状态）
  Committed = 1, // 提交后（待审核状态）
  Verified = 2,  // 审核后（审核通过后）
}

class BtnComp exnteds Vue {
  public tableState: TableState = TableState.Saved
  public originBtnList = [
    {
      label: '保存',
      hasStatus: [TableState.Init, TableState.Saved],
      event: () => {}
    },
    {
      label: '提交',
      hasStatus: [TableState.Saved],
      event: () => {}
    },
    {
      label: '回退',
      hasStatus: [TableState.Committed],
      event: () => {}
    },
    {
      label: '审核',
      hasStatus: [TableState.Committed],
      event: () => {}
    },
  ]
  public get btnList() {
    return this.originBtnList.filter((btn) => btn.hasStatus.includes(this.tableState))
  }
}
```

### any & unknown

#### any

表示任何类型。它可以赋给任何类型变量，也可以接受任何类型变量，但这样就会丢失类型检查器对这些值进行检查而直接让它们通过编译阶段的检查。比如常见的 `Cannot read property 'a' of null/undefined` 错误。

```ts
let obj: any = { x: 0 };
// None of these lines of code are errors
obj.foo();
obj();
obj.bar = 100;
obj = 'hello';
const n: number = obj;
```

```ts
// 函数内对参数 val 的任何操作，都不会引发 ts 报错
function foo(val: any) {
  val(); // 可以直接当函数调用，但不保证运行时不出错
  if (typeof val === 'function') {
    val(); // 这里还是会被推断为 any 类型，类型收缩失效
  }
  throw Error('Invalid value');
}
```

#### unknown

表示未知的类型，用于不确定的变量类型。任何类型都是它的 subtype，也就是说任何类型变量都可以分配给它，但它只能分配给自身或 `any` 类型的变量。

```ts
let unkonwnVal: unknown;
unkonwnVal = 1;
unkonwnVal = 'a';
unkonwnVal = false;
unkonwnVal = null;
unkonwnVal = false;
unkonwnVal = { name: 'unknown value' };

let num: number = unkonwnVal; // Error -> Type 'unknown' is not assignable to type 'number'.
```

实际使用中通常会先对 `unknow` 类型变量进行类型收缩，然后再进行具体的操作。如下代码：

```ts
// function foo(val: unknown): string | number
function foo(val: unknown) {
  if (typeof val === 'function') {
    val(); // 这里 val 变量将会被推断为函数类型 (parameter) val: Function
  } else if (typeof val === 'number' || typeof val === 'string') {
    return val; // 这里 val 变量将会被推断为联合类型 (parameter) val: string | number
  }
  throw Error('Invalid value');
}
```

#### unknown 和 any 的区别

两者最大的区别是 `unknown` 可以确保类型检查，而 `any` 相当于完全放弃了类型检查，所以通常情况下建议使用 `unknown` 而不是 `any`。

### void & never

#### void

表示没有任何类型，像是与 `any` 类型相反。常见于没有返回值的函数声明。

```ts
function warnUser(): void {
  console.log('This is my warning message');
}
```

声明一个 `void` 类型的变量没有实际作用，因为只能为它赋予 `undefined/null`。

#### never

表示不存在的值的类型。常见于那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型。

```ts
function error(message: string): never {
  throw new Error(message);
}

// Inferred return type is never
function fail() {
  return error('Something failed');
}

// Function returning never must not have a reachable end point
function infiniteLoop(): never {
  while (true) {}
}
```

`never` 类型是所有类型的子类型，也可以赋值给任何类型。但是没有任何类型是 `never` 的子类型，也没有类型能赋值给它。

通常 `never` 类型会被用于可辨识联合类型或校验分支完全性的时候去使用。

### object

表示非原始类型，也就是除 `number/string/boolean/symbol/null/undefined` 之外的类型。它是所有引用类型的基类，也就是说其他的引用类型变量可以赋值给 `object` 类型变量，比如数组类型、函数类型等。通常，在没有属性或方法的操作情况下，可以使用 `object` 作为类型。而当有属性访问，或者方法调用，那么在类型不收缩的情况下，ts 会报错。示例：

```ts
let obj: object = {
  name: 'asd',
  num: 123,
};
obj.a = 'qwe'; // Error -> Property 'a' does not exist on type 'object'.
// 注意：当对象被声明 object 类型后，访问或者修改该对象的属性时，会报错
// 通常情况下，避免使用 object 进行类型标注，而应使用 interface 和 type alias 去进行声明，然后标注
```

如下代码，是 ts 对于 Object 构造函数的一个声明，它的 `create` 方法用于基于某个对象去创建一个新对象，可以看到其第一参数为 `object | null` 的联合类型，也就是说明该函数能接受任何引用类型的变量或者 null。

```ts
interface ObjectConstructor {
  create(o: object | null): any;
}
```

### 类型断言

通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。过类型断言这种方式可以告诉编译器：“相信我，我知道自己在干什么”。

类型断言有两种形式。

```ts
let someValue: any = 'this is a string';
// 尖括号法
let strLength: number = (<string>someValue).length;
// 使用 as 语法
let strLength: number = (someValue as string).length;
```

## 高级类型

### 对象类型 (Object Types)

与上文 object 类型不同的是，该类型表示单纯的对象（键值对）类型。

可以使用对象字面量表注，也可以使用下文 `interface` 或 `type alias` 标注类型。

特性：

- 可选属性，在属性名后面加 `?` 符号，表示可有可无。
- 只读属性，在属性名前面加 `readonly` 关键字，表示属性值不能被修改。

### 类型别名 (type alias)

### 接口 (interface)

定义及使用 `interface` 是用于声明类型规范。可用于声明对象和声明函数。

参考资料：

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
