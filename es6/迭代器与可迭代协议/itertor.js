/**
 * 迭代对象以生成键值对
 */

function generateKv() {
    const score = {
        a: 89,
        b: 87,
        c: 99,
        /**
         * 用一堆实现迭代器协议的代码‘污染’本来很简单的对象映射关系是有问题的，
         * 所以最好的办法是将添加键值对迭代器的逻辑提取到一个可重用的函数里，从而使其与score对象映射解耦。
         */
        [Symbol.iterator]() {
            const keys = Object.keys(score)
            return {
                next() {
                    const done = keys.length === 0
                    const key = keys.shift()
                    return {
                        done,
                        value: [key, score[key]],
                    }
                },
            }
        },
    }
    // 通过扩展运算符拿到键值对
    console.log('score 键值对：', [...score])

    const scoreBetter = keyValIterable({
        a: 1,
        b: 2,
        c: 3,
    })
    console.log('scoreBetter 键值对：', [...scoreBetter])
}

generateKv()

function keyValIterable(target) {
    target[Symbol.iterator] = function () {
        const keys = Object.keys(target)
        return {
            next() {
                const done = keys.length === 0
                const key = keys.shift()
                return {
                    done,
                    value: [key, target[key]],
                }
            },
        }
    }
    return target
}
