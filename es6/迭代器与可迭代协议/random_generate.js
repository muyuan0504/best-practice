/** 随机数生成器 */
const random = {
    [Symbol.iterator]: function () {
        return {
            next: function () {
                return {
                    value: Math.random(),
                }
            },
        }
    },
}

// 此时通过Array.from(random)或者[...random]会构造出无穷序列，因为引擎会一直调用next()

/**
 * 以下方法可以避免无穷循环的风险
 *
 * 1. 数组结构
 * const [one, another] = random 能工作，是因为对可迭代对象做数组解构时，会按顺序从迭代器里“取”值，取够解构里的变量数就停，不会一直跑到 done: true
 *
 * 结构无穷序列不适合大量取值，特别是要设置动态条件的情况下，比如取出前i个值，或者在满足某个条件时一直取值。此时最好的办法是使用for...of循环配合break来控制，
 * 通过中断条件来避免无穷循环。
 *
 * 2. for...of循环配合break
 *
 */
const [one, another] = random
console.log(one, another)

for (const value of random) {
    console.log('打印随机数： ', value)
    if (value > 0.5) {
        break
    }
}
