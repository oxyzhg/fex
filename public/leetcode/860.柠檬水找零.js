/*
 * @lc app=leetcode.cn id=860 lang=javascript
 *
 * [860] 柠檬水找零
 */

// @lc code=start
/**
 * @param {number[]} bills
 * @return {boolean}
 */
var lemonadeChange = function (bills) {
  let coinFive = 0;
  let coinTen = 0;

  for (let i = 0; i < bills.length; i++) {
    if (bills[i] === 5) coinFive++;

    if (bills[i] === 10) {
      coinTen++;
      coinFive--;
    }

    if (bills[i] === 20) {
      if (coinTen > 0) {
        coinTen--;
        coinFive--;
      } else {
        coinFive -= 3;
      }
    }

    if (coinFive < 0 || coinTen < 0) return false;
  }

  return true;
};
// @lc code=end
