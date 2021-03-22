/*
 * @lc app=leetcode.cn id=18 lang=javascript
 *
 * [18] 四数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function (nums, target) {
  const result = [];

  if (nums.length < 4) return result;

  nums.sort((a, b) => a - b);

  const length = nums.length;

  for (let i = 0; i < length - 3; i++) {
    // 跳过重复
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    // 最小的三位数大于目标值
    if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) break;

    if (nums[i] + nums[length - 1] + nums[length - 2] + nums[length - 3] < target) continue;

    for (let j = i + 1; j < length - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;

      if (nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) break;

      if (nums[i] + nums[j] + nums[length - 1] + nums[length - 2] < target) continue;

      // 三数之和 夹逼算法
      let p = j + 1;
      let q = length - 1;

      while (p < q) {
        const sum = nums[i] + nums[j] + nums[p] + nums[q];

        if (sum === target) {
          result.push([nums[i], nums[j], nums[p], nums[q]]);
          // 再次去重
          while (p < q && nums[p] === nums[p + 1]) {
            p++;
          }
          p++;
          while (p < q && nums[q] === nums[q - 1]) {
            q--;
          }
          q--;
        } else if (sum < target) {
          p++;
        } else {
          q--;
        }
      }
    }
  }

  return result;
};
// @lc code=end
