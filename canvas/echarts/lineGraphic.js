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
            data: [5, 7, 23, 14, 25],
            type: 'line',
        },
    ],
}

const xGapLen = dataSeries.xAixs.data.length
const yGapLen = dataSeries.yAxis.data.length

const canPaddingX = 80 // canvas左右间距
const canPaddingY = 70 // canvas上下间距
const lineGap = 40 // 线段间距
const bottomTextGap = 60 // X轴点位间隔
const axisHeight = (yGapLen - 1) * lineGap // 内容区域高度
const axisWidth = lineGap * 2 + (xGapLen - 1) * bottomTextGap // 坐标轴线段长度
const canvasWidth = axisWidth + canPaddingX * 2
const canvasHeight = axisHeight + canPaddingY * 2

const roundData = [] // 图表圆点的位置数据

let yPos = canPaddingY

function init() {
    const baseColor = '#85c35e'
    // 更新容器的宽高
    const contain = document.querySelector('.cvs-contain')
    const oRound = document.querySelector('.round')
    contain.style.width = canvasWidth + 'px'
    contain.style.height = canvasHeight + 'px'
    // 设置完width height之后，
    const reginLeft = contain.offsetLeft
    const reginTop = contain.offsetTop

    const canvas = document.querySelector('#canEl')
    const ctx = canvas.getContext('2d')

    bindEvt()

    adaptDpr(canvas, canvasWidth, canvasHeight)

    initStyle()
    drawAxisLines()
    drawAxisXUnit()
    renderData()
    connectLine()

    /** 像素比适配 */
    function adaptDpr(canvas, width, height) {
        const dpr = window.devicePixelRatio
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        ctx.scale(dpr, dpr)
    }

    function initStyle() {
        ctx.lineCap = 'round' // 设置线条末端样式
        ctx.lineJoin = 'round' // 设定线条与线条间接合处的样式
        ctx.lineWidth = 1 // 设置线条宽度
        ctx.font = '14px serif'
    }

    function drawAxisLines() {
        for (let i = 0; i < yGapLen; i++) {
            const isLast = i === yGapLen - 1
            drawAxisLine(isLast, i)
            yPos += lineGap
        }
    }

    /** 绘制线段 */
    function drawAxisLine(isLastLine, index) {
        if (isLastLine) {
            ctx.strokeStyle = '#333'
            ctx.setLineDash([])
        } else {
            ctx.strokeStyle = '#ccc'
            ctx.setLineDash([5, 5])
        }
        ctx.beginPath()
        ctx.moveTo(canPaddingX, yPos)
        ctx.lineTo(canPaddingX + axisWidth, yPos)
        const textIndex = yGapLen - 1 - index
        const text = dataSeries.yAxis.data[textIndex]
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'end'
        ctx.fillStyle = '#666'
        ctx.fillText(text, canPaddingX - 10, yPos)
        ctx.stroke()
    }

    /** 处理X轴单元 */
    function drawAxisXUnit() {
        for (let i = 0; i < xGapLen; i++) {
            const text = dataSeries.xAixs.data[i]

            const start = canPaddingX + lineGap + bottomTextGap * i

            ctx.beginPath()
            ctx.moveTo(start, axisHeight + canPaddingY)
            ctx.lineTo(start, axisHeight + canPaddingY + 6)

            // 要么使用自带的 textAlign，要么需要借助 measureText API计算文字宽度做居中处理
            // ctx.textAlign = 'center'
            // ctx.fillText(text, start, axisHeight + canPaddingY + 16)

            const textWidth = ctx.measureText(text).width
            ctx.fillText(text, start + Math.floor(textWidth / 2), axisHeight + canPaddingY + 16)

            ctx.stroke()
        }
    }

    /** 处理X轴数据坐标段 */
    function renderData() {
        for (let i = 0; i < dataSeries.series.length; i++) {
            const data = dataSeries.series[i].data
            const len = data.length
            for (let j = 0; j < len; j++) {
                const [x, y] = generatePos(j, data)
                ctx.beginPath()
                ctx.fillStyle = baseColor
                ctx.arc(x, y, 3, 0, 2 * Math.PI)
                ctx.fill()
            }
        }
    }

    /** 生成数据点位 */
    function generatePos(index, data) {
        const x = canPaddingX + lineGap + bottomTextGap * index
        const y = canPaddingY + axisHeight - Math.floor((data[index] / 30) * axisHeight)
        roundData.push([x, y])
        return [x, y]
    }

    /** 用线段连接每个点位 */
    function connectLine() {
        const len = roundData.length
        for (let i = len - 1; i >= 1; i--) {
            const [startX, startY] = roundData[i]
            const [endX, endY] = roundData[i - 1]
            ctx.strokeStyle = baseColor
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.lineTo(endX, endY)
            ctx.stroke()
        }
    }

    /** 处理DOM人机交互
     * 如果处理鼠标移入，图表交互：
     * 1. 重绘，重新渲染整个canvas
     * 2. 脏值检查，只针对需要交互的部分进行DOM贴图
     */

    function bindEvt() {
        contain.addEventListener('mousemove', handleCanvasMove, false)
    }

    function handleCanvasMove(e) {
        const x = e.clientX
        const y = e.clientY

        const roundPos = checkInRegin(x, y)

        if (roundPos.length) {
            oRound.style.left = roundPos[0] - 3 + 'px'
            oRound.style.top = roundPos[1] - 3 + 'px'
            oRound.classList.add('show')
        } else {
            oRound.classList.remove('show')
        }
    }

    function checkInRegin(x, y) {
        const roundLen = roundData.length
        for (let i = 0; i < roundLen; i++) {
            const [rx, ry] = roundData[i]

            // 这样写会频繁触发重绘，因为获取offset属性的关系，所以这里最好处理 offsetLeft
            // const reginX = rx + contain.offsetLeft
            // const reginY = ry + contain.offsetTop

            const reginX = rx + reginLeft
            const reginY = ry + reginTop

            const inRegin = x >= reginX - 3 && x <= reginX + 3 && y >= reginY - 3 && y <= reginY + 3

            if (inRegin) {
                return [rx, ry]
            }
        }
        return []
    }
}

init()
