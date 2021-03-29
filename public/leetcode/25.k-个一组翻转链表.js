/*
 * @lc app=leetcode.cn id=25 lang=javascript
 *
 * [25] K 个一组翻转链表
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
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function(head, k) {
  if (head === null) return null;
  let tail = head; // 现在定义的链尾，是反转后的链首
  for (let i = 1; i < k; i++) {
    tail = tail.next;
    if (tail === null) return head;
  }
  // 前面的迭代，是为了拆分链表
  let next = tail.next;
  tail.next = null;
  reverse(head);
  head.next = reverseKGroup(next, k); // 递归翻转
  return tail;
};

function reverse(curr) {
  let prev = null;
  while (curr !== null) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
// @lc code=end

/**
 * 解法：
 * 1. 迭代拆分前k个链表和其他，并分成两个链表
 * 2. 反转前k个链表
 * 3. 递归反转另一个链表，并将反转结果拼接在后面
 * 3. 返回反转后的链表
 */