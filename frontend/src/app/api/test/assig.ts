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
  `,
  submit: {
    time: new Date('2025-08-05T20:40:00'),
    submitCode: `function constructMaximumBinaryTree(nums: number[]): TreeNode | null {
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
  }`,
    score: 60
  },
  analysis: `# 题解`
}