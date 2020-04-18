# 题目

设计一个页面，利用控件显示3个维度（x,y,z）数据图。

三个要求：

* 可对该图进行旋转、缩放等可视操作；
* 绘制三维散点图；
* 输入公式，绘制 3d 曲面图


## 题目分析

#### 问题1：3D图

两种方案

第一种是自己写引擎，可以利用 canvas 或者 css3 来实现，但考虑到散点可能会比较多，因此选用canvas比较合适。缺点是自己写开发的工作量会比较大。

第二种方案是使用已有的库来实现，比如 

echarts：示例 https://www.echartsjs.com/examples/zh/editor.html?c=line3d-orthographic&gl=1

优点是现成的，二次开发成本低，缺点是限死只能画三维数据图，若想要扩展更多功能难。

three.js：示例 https://threejs.org/examples/#webgl_interactive_raycasting_points

优点是功能强大，二次开发容易，缺点是比如坐标轴之类的需要自己绘制。
