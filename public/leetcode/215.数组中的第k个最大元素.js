/*
 * @lc app=leetcode.cn id=215 lang=javascript
 *
 * [215] 数组中的第K个最大元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  const heap = nums.slice(0, k);
  for (let i = Math.floor((k - 1) / 2); i >= 0; i--) {
    heapify(heap, i, k);
  }

  for (let i = k; i < nums.length; i++) {
    if (nums[i] > heap[0]) {
      heap[0] = nums[i];
      heapify(heap, 0, k);
    }
  }

  return heap[0];
};

function heapify(heap, index, heapSize) {
  let element = index;
  const left = index * 2 + 1;
  const right = index * 2 + 2;

  if (left < heapSize && heap[left] < heap[element]) {
    element = left;
  }
  if (right < heapSize && heap[right] < heap[element]) {
    element = right;
  }
  if (element !== index) {
    [heap[element], heap[index]] = [heap[index], heap[element]];
    heapify(heap, element, heapSize);
  }
}
// @lc code=end

/**
 * 思路：
 * 1. 利用小根堆的特性，堆中只存在前k个元素，并且堆顶元素是最小元素
 * 2. 首先将原数组前k个元素堆化处理，堆顶元素是最小元素
 * 3. 从第k元素开始遍历，如果该元素大于堆顶元素，说明该元素需要替换堆顶元素，并重新堆化处理（自上而下）
 * 4. 最后的小根堆，堆顶元素就是第k大的元素
 */
