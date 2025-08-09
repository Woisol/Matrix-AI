import { input } from "@angular/core";
import { AssigData } from "../type/assigment";

export const testAssigData: AssigData = {
  assigId: '1',
  title: 'T1 二叉树',
  description: `# 题目描述
  给定一个整数数组，请你根据该数组构建一个**最大二叉树**。
  最大二叉树定义如下：
  - 二叉树的根是数组中的最大元素。
  - 左子树是通过数组中最大元素左边部分构建的最大二叉树。
  - 右子树是通过数组中最大元素右边部分构建的最大二叉树。
  通过给定的数组构建最大二叉树，并且输出这个树的根节点。
  > **注意**：本题的输入数组保证不为空，且所有元素互不相同。
  `,
  assigOriginalCode: [{
    fileName: 'main.cpp',
    content: `#include <iostream>
int main(){
    cout << "Hello, Matrix AI!" << endl;
}
`}],
  submit: {
    score: 60,
    time: new Date('2025-08-05T20:40:00'),
    testSample: [
      {
        input: '1,2,3,4,5',
        realOutput: '5,4,3,2,1',
        expectOutput: '5,4,3,2,1'
      },
    ],
    submitCode: [
      {
        fileName: 'main.cpp',
        content:
          `#include <iostream>

  // 找到链表的中间节点
  template<typename T>
  ListNode<T>* findMiddle(ListNode<T>* head) {
      ListNode<T>* slow = head;
      ListNode<T>* fast = head;
      ListNode<T>* prev = nullptr;

      while (fast != nullptr && fast->next != nullptr) {
          prev = slow;
          slow = slow->next;
          fast = fast->next->next;
      }

      // 断开链表
      if (prev != nullptr) {
          prev->next = nullptr;
      }

      return slow;
  }

  // 合并两个有序链表
  template<typename T>
  ListNode<T>* merge(ListNode<T>* l1, ListNode<T>* l2) {
      ListNode<T> dummy;
      ListNode<T>* tail = &dummy;

      while (l1 != nullptr && l2 != nullptr) {
          if (l1->val < l2->val) {
              tail->next = l1;
              l1 = l1->next;
          } else {
              tail->next = l2;
              l2 = l2->next;
          }
          tail = tail->next;
      }

      if (l1 != nullptr) {
          tail->next = l1;
      }

      if (l2 != nullptr) {
          tail->next = l2;
      }

      return dummy.next;
  }

  // 归并排序链表
  template<typename T>
  ListNode<T>* sortList(ListNode<T>* head) {
      if (head == nullptr || head->next == nullptr) {
          return head;
      }

      // 找到中间节点并断开链表
      ListNode<T>* middle = findMiddle(head);

      // 递归排序两部分
      ListNode<T>* left = sortList(head);
      ListNode<T>* right = sortList(middle);

      // 合并排序后的两部分
      return merge(left, right);
  }
      `},
    ],
  },
  analysis: {
    basic: {
      resolution: {
        content: [
          {
            title: 'TA 标准答案',
            content: `
            \`\`\`typescript
            function constructMaximumBinaryTree(nums: number[]) {
                if (nums.length === 0) return null;

                // 找到数组中的最大值及其索引
                let maxIndex = 0;
                for (let i = 1; i < nums.length; i++) {
                    if (nums[i] > nums[maxIndex]) {
                        maxIndex = i;
                    }
                }

                // 创建根节点
                const root = new TreeNode(nums[maxIndex]);

                // 递归构建左子树和右子树
                root.left = constructMaximumBinaryTree(nums.slice(0, maxIndex));
                root.right = constructMaximumBinaryTree(nums.slice(maxIndex + 1));

                return root;
            }
          \`\`\`
          `,
            complexity: {
              time: 'O(n^2)',
              space: 'O(n)'
            }
          },
          {
            title: '循环 | 解法1',
            content: '',
          },
        ],
        summary: `综合考虑，上述解法中，xxx 解法相对较优`,
        showInEditor: true
      }
    }
  }
}