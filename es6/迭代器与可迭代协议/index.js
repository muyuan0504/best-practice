console.log('迭代器与可迭代协议')

const test = {
    [Symbol.iterator]: iteratorFn,
}
function iteratorFn() {
    return {
        next: () => {
            return {
                value: 1,
                done: true,
            }
        },
    }
}

for (const item of test) {
    // 循环体一次都不会执行，因为第一次调用next()时，done: true，引擎会认为“迭代已经结束”，所以循环体一次都没执行
    console.log('iteratorFn 的 test for...of', item)
}

const obj = {
    [Symbol.iterator]: iterator,
}

function iterator() {
    let count = 0
    return {
        next: () => {
            count++
            // 只有 done: false 时，for...of 才会把 value 赋给 item 并执行循环体
            // 如果 done: true，for...of 会停止迭代, 如果 return 有返回值，则该返回值会作为 for...of 循环的返回值
            // 如果 done: false，for...of 会继续迭代，直到 done: true
            // 如果第一次就返回 done: true，所以循环体一次都没执行
            if (count <= 3) {
                return { value: count, done: false } // 依次 yield 1, 2, 3
            }
            return { value: undefined, done: true } // 结束迭代
        },
        return: () => {
            return { value: undefined, done: true }
        },
    }
}

console.log(obj[Symbol.iterator]())

/** 对obj进行for...of循环 */
for (const item of obj) {
    console.log(item)
}
