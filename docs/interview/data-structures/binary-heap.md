---
id: binary-heap
title: 二叉堆
---

特点：

- 结构特性：二叉堆是一种特殊的二叉树，即完全二叉树。表示树的每一层都有所有子树（除了最后一层的叶子节点），并且最后一层的叶节点尽可能都是左侧子节点。
- 堆特性：二叉堆不是最大堆就是最小堆。最小堆允许你快速导出树的最小值，最大堆允许你快速导出树的最大值。所有的节点都大于等于（最大堆）或小于等于（最小堆）每个它的子节点。

### 实例方法

- `insert` --- 向二叉堆插入新元素
- `extract` --- 导出堆中最值（根元素）
- `size` --- 查看堆中元素个数
- `isEmpty` --- 查看堆是否为空
- `findMinimum` --- 查询堆中最值（根元素）

### 模拟实现

```js
class MinHeap {
  constructor() {
    this.heap = [];
  }

  /** 向二叉堆插入新元素 */
  insert(value) {
    if (value !== null) {
      this.heap.push(value);
      this.shiftUp(this.heap.length - 1);
      return true;
    }
    return false;
  }

  /** 导出堆中最值（根元素） */
  extract() {
    if (this.isEmpty()) return undefined;
    if (this.size() === 1) return this.heap.shift();
    const removedValue = this.heap.shift();
    this.shiftDown(0);
    return removedValue;
  }

  /** 上移操作 */
  shiftUp(index) {
    let parent = this.getParentIndex(index);

    while (index > 0 && this.heap[parent] > this.heap[index]) {
      swap(this.heap, index, parent);
      index = parent;
      parent = this.getParentIndex(index);
    }
  }

  /** 下移操作（堆化） */
  shiftDown(index) {
    let element = index;
    const left = this.getLeftIndex(index);
    const right = this.getRightIndex(index);
    const size = this.size();

    if (left < size && this.heap[element] > this.heap[left]) {
      element = left;
    }
    if (right < size && this.heap[element] > this.heap[right]) {
      element = right;
    }
    if (element !== index) {
      swap(this.heap, index, element);
      this.shiftDown(element);
    }
  }

  size() {
    return this.heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  findMinimum() {
    return this.isEmpty() ? undefined : this.heap[0];
  }
  getLeftIndex(index) {
    return 2 * index + 1;
  }
  getRightIndex(index) {
    return 2 * index + 2;
  }
  getParentIndex(index) {
    if (index === 0) return undefined;
    return Math.floor((index - 1) / 2);
  }
}

function swap(array, i, j) {
  [array[i], array[j]] = [array[j], array[i]];
}
```

### 实际应用

在实际应用中，通常需要基于数组快速建堆，建堆的方式有两种：插入式建堆和原地建堆。

#### 插入式建堆

1. 将节点插入到堆尾。
2. 自下而上堆化：将插入节点与其父节点比较，如果插入节点大于父节点（大顶堆）或插入节点小于父节点（小顶堆），则插入节点与父节点调整位置。
3. 重复上一步，直到不需要交换或交换到根节点，此时插入完成。

代码实现：

```js
function insert(value) {
  heap.push(value);
  let index = heap.length - 1;
  let parent = Math.floor((index - 1) / 2);

  while (index > 0 && heap[index] < heap[parent]) {
    swap(heap, index, parent);
    index = parent;
    parent = Math.floor((index - 1) / 2);
  }
}
```

#### 原地建堆

原地建堆的方法有两种：一种是承袭上面插入的思想，即从前往后、自下而上式堆化建堆；与之对应的另一种是，从后往前、自上往下式堆化建堆。

- **自下而上式堆化**：将节点与其父节点比较，如果节点大于父节点（大顶堆）或节点小于父节点（小顶堆），则节点与父节点调整位置。
- **自上往下式堆化**：将节点与其左右子节点比较，如果存在左右子节点大于该节点（大顶堆）或小于该节点（小顶堆），则将子节点的最大值（大顶堆）或最小值（小顶堆）与之交换。

自下而上式堆化是调整节点与父节点（往上走），自上而下式堆化是调整节点与左右子节点（往下走）。

自上而下堆化代码实现：

```js
function buildHeap(items, heapSize) {
  while (heapSize < items.length) {
    heapify(items, heapSize); // 保证最后一个元素进入堆化操作
    heapSize++;
  }
}
function heapify(items, index) {
  let parent = Math.floor((index - 1) / 2);
  while (index > 0 && items[index] < items[parent]) {
    swap(items, index, parent);
    index = parent;
    parent = Math.floor((index - 1) / 2);
  }
}

// 测试
const items = [5, 2, 3, 4, 1];
buildHeap(items, 0); // 起始索引
console.log(items); // [1, 2, 3, 5, 4]
```

自下而上堆化代码实现：

```js
function buildHeap(items, heapSize) {
  for (let i = Math.floor(heapSize / 2); i >= 0; i--) {
    heapify(items, i, heapSize); // 倒序，保证第一个元素进入堆化操作
  }
}
function heapify(items, index, size) {
  let element = index;
  let left = index * 2 + 1;
  let right = index * 2 + 2;
  if (left < size && items[element] > items[left]) {
    element = left;
  }
  if (right < size && items[element] > items[right]) {
    element = right;
  }
  if (element !== index) {
    swap(items, index, element);
    heapify(items, element, size);
  }
}

// 测试
const items = [5, 2, 3, 4, 1];
buildHeap(items, items.length); // 元素个数
console.log(items); // [1, 2, 3, 4, 5]
```
