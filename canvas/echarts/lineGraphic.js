/** 折线图 */

const dataSeries = {
    xAixs: {
        data: ['1月', '2月', '3月', '4月', '5月'], // 标签
    },
    yAxis: {
        data: [0, 10, 20, 30],
    },
    series: [
        {
            data: [1, 2, 3, 4, 5],
            type: 'line',
        },
    ],
}

const xGapLen = dataSeries.xAixs.data.length
const yGapLen = dataSeries.yAxis.data.length
const xGap = 80 // X轴间距
const xPadding = 40 // X轴左边距
const yGap = 80 // Y轴间距
const yPadding = 40 // Y轴上下边距

function init() {
    const canvas = document.querySelector('#canEl')
    const ctx = canvas.getContext('2d')

    ctx.lineWidth = 1
    ctx.font = '24px serif'

    adaptDpr(canvas, 900, 600)

    console.error('---------- aiden --------------', ctx)

    drawXAxis()
    drawXGap()
    drawYAxis()

    /** 像素比适配 */
    function adaptDpr(canvas, width, height) {
        const dpr = window.devicePixelRatio
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        ctx.scale(dpr, dpr)
    }

    /** 处理X轴 */
    function drawXAxis() {
        ctx.beginPath()
        ctx.moveTo(xPadding, yPadding + yGap * yGapLen)
        ctx.lineTo(xPadding + xGap * xGapLen + 12, yPadding + yGap * yGapLen)
        ctx.stroke()
    }

    /** 处理X轴数据坐标段 */
    function drawXGap() {
        for (let i = 1; i <= xGapLen; i++) {
            ctx.beginPath()
            const baseXAxis = xPadding + xGap * i
            const baseYAxis = yPadding + yGap * yGapLen
            ctx.moveTo(baseXAxis, baseYAxis)
            ctx.lineTo(baseXAxis, baseYAxis + 6)

            ctx.fillText(dataSeries.xAixs.data[i - 1], baseXAxis, baseYAxis + 18)
            
            ctx.stroke()
            console.error('---------- aiden --------------', baseXAxis)
        }
        // ctx.textAlign = center
    }

    /** 处理Y轴 */
    function drawYAxis() {
        ctx.beginPath()
        ctx.moveTo(xPadding, yPadding + yGap * yGapLen)
        ctx.lineTo(xPadding, yPadding)
        ctx.stroke()
    }

    /** 处理Y轴数据坐标段 */
    function drawYGap() {
        for (let i = 1; i <= yGapLen; i++) {
            ctx.beginPath()
            const baseXAxis = xPadding + xGap * i
            const baseYAxis = yPadding + yGap * yGapLen
            ctx.moveTo(baseXAxis, baseYAxis)
            ctx.lineTo(baseXAxis, baseYAxis + 6)

            ctx.fillText(dataSeries.xAixs.data[i - 1], baseXAxis, baseYAxis + 18)
            // ctx.textAlign = center
            ctx.stroke()
            console.error('---------- aiden --------------', baseXAxis)
        }
    }
}

init()
