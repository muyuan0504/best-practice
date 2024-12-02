# 场景实现: pdf

-   html2pdf.js 实现

https://www.npmjs.com/package/html2pdf.js

-   html2canvas + canvas2pdf 实现

依赖两个库分别自定义 canvas 的绘制与 pdf 的生成，其实 `html2pdf.js` 本质上也是依赖了这两个库的实现，不过在这个基础上，实现了分页切割的处理
