/*
 * @lc app=leetcode.cn id=322 lang=javascript
 *
 * [322] 零钱兑换
 */

// @lc code=start
/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function (coins, amount) {
  // 1. greedy
  // coins.sort((a, b) => b - a);

  // let res = Infinity;

  // const find = (k, amount, count) => {
  //   const coin = coins[k];

  //   if (k === coins.length - 1) {
  //     if (amount % coin === 0) {
  //       res = Math.min(res, count + ~~(amount / coin));
  //     }
  //   } else {
  //     for (let i = ~~(amount / coin); i >= 0 && count + i < res; i--) {
  //       find(k + 1, amount - coin * i, count + 1);
  //     }
  //   }
  // };

  // find(0, amount, 0);

  // return res === Infinity ? -1 : res;

  // 2. dp
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 0; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
};
// @lc code=end
