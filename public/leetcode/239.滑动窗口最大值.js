/*
 * @lc app=leetcode.cn id=239 lang=javascript
 *
 * [239] 滑动窗口最大值
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function (nums, k) {
  const deque = [];
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // 把滑块范围外索引踢出去
    if (deque[0] <= i - k) {
      deque.shift();
    }

    // 从后往前，把值小于当前值的全删掉
    while (nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }

    deque.push(i);

    // 形成滑块开始输出最大值
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
};
// @lc code=end
