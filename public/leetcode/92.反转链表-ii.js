/*
 * @lc app=leetcode.cn id=92 lang=javascript
 *
 * [92] 反转链表 II
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {

  let start = null; // 反转段起始元素
  let curr = head;
  let i  = 1;

  while (i < left) {
    start = curr;
    curr = curr.next;
    i++;
  }

  // 开始反转
  let prev = null; // 新增链首值，是反转后的链尾
  let tail = curr; // 记录反转后的末尾值
  while (i <= right) {
    let temp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = temp;
    i++;
  }

  // 反转后拼接链表
  start.next = prev;
  tail.next = curr;

  return left === 1 ? prev: head;
};
// @lc code=end

/**
 * 迭代解法：
 * 1. 先迭代快进到 left 指定的位置，保存相关节点，用于后续拼接链表
 * 2. 从 left 开始迭代反转链表
 * 3. 链表反转后首节点对应 prev 变量，尾节点对应 curr
 * 4. 将反转后的三段链表拼接并返回
 */