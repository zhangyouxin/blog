---
title: (每日一题)最小体力消耗路径
author: shinya
date: 2021-01-29
description: LeetCode 1631. 最小体力消耗路径
tags: ["LeetCode", "每日一题", "中等", "图", "并查集", "Dijkstra"]
---

## 1631. 最小体力消耗路径

你准备参加一场远足活动。给你一个二维 `rows x columns` 的地图 `heights` ，其中 `heights[row][col]` 表示格子 `(row, col)` 的高度。一开始你在最左上角的格子 `(0, 0)` ，且你希望去最右下角的格子 `(rows-1, columns-1)` （注意下标从 `0` 开始编号）。你每次可以往 上，下，左，右 四个方向之一移动，你想要找到耗费 体力 最小的一条路径。

一条路径耗费的 体力值 是路径上相邻格子之间 高度差绝对值 的 最大值 决定的。

请你返回从左上角走到右下角的最小 体力消耗值 。

示例 1：

```c
输入：heights = [[1,2,2],[3,8,2],[5,3,5]]
输出：2
解释：路径 [1,3,5,3,5] 连续格子的差值绝对值最大为 2 。
这条路径比路径 [1,2,2,2,5] 更优，因为另一条路径差值最大值为 3 。
```

示例 2：

```c
输入：heights = [[1,2,3],[3,8,4],[5,3,5]]
输出：1
解释：路径 [1,2,3,4,5] 的相邻格子差值绝对值最大为 1 ，比路径 [1,3,5,3,5] 更优。
```

示例 3：

```c
输入：heights = [[1,2,1,1,1],[1,2,1,2,1],[1,2,1,2,1],[1,2,1,2,1],[1,1,1,2,1]]
输出：0
解释：上图所示路径不需要消耗任何体力。
```

提示：

```c
rows == heights.length
columns == heights[i].length
1 <= rows, columns <= 100
1 <= heights[i][j] <= 106
```

## 解题思路

有几种解题思路都需要先画出所有的路径：

例如，若：

```c
heights = [[1,2,2],[3,8,2],[5,3,5]]
```

则路径为:

```c
[
  [ 1, 2, 0 ], [ 2, 5, 0 ],
  [ 0, 1, 1 ], [ 0, 3, 2 ],
  [ 3, 6, 2 ], [ 6, 7, 2 ],
  [ 7, 8, 2 ], [ 5, 8, 3 ],
  [ 3, 4, 5 ], [ 4, 7, 5 ],
  [ 1, 4, 6 ], [ 4, 5, 6 ]
]
```

- 二分查找：首先统计所有路径并且从小到大排序，验证只使用最大的路径长度为 n 的边是否能连通首尾，若能，则向下二分查找，不能则向上查找
- 并查集：首先统计所有路径并且从小到大排序，一条一条的合并路径，直到首尾相连为止。
- 最短路径： 使用 Dijkstra 算法

这里使用并查集：

```js
class UnionFind{
  constructor(n){
    this.parent = new Array(n).fill(0).map((item, index) => index);
    this.size = new Array(n).fill(1);
    this.setCount = n;
  }
  findSet(x) {
    if(this.parent[x] === x) {
      return x
    }
    this.parent[x] = this.findSet(this.parent[x])
    return this.parent[x]
  }
  union(x,y) {
    if(this.findSet(x) === this.findSet(y)){
      return false;
    }
    this.size[this.findSet(x)] += this.size[this.findSet(y)]
    this.parent[this.findSet(y)] = this.findSet(x)
    this.setCount--
    return true
  }
  connected(a,b){
    return this.findSet(a) === this.findSet(b)
  }
  setCount(){
    return this.setCount
  }
  show(){
    console.log(this.parent);
    console.log(this.size);
  }
}
var minimumEffortPath = function(heights) {
  let paths = []
  const n = heights.length
  const m = heights[0].length
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let index = i * m + j
      if ( j < m - 1 ){
        paths.push([index, index + 1, Math.abs(heights[i][j] - heights[i][j + 1])])
      }
      if ( i < n - 1 ){
        paths.push([index, index + m, Math.abs(heights[i][j] - heights[i + 1][j])])
      }
    }
  }
  let sorted = paths.sort((a, b) => a[2] - b[2])
  let uf = new UnionFind(n * m)
  let result = 0
  for (let i = 0; i < sorted.length; i++) {
    const element = sorted[i];
    uf.union(element[0], element[1])
    result = element[2]
    if(uf.connected(0, n*m -1)){
      break;
    }
  }
  return result
};
```