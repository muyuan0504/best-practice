/**
 * 迭代的原理：
 * 普通对象要想转换成可迭代对象，必须遵守一个协议：
 * 给这个对象的Symbol.iterator属性赋值一个函数；如果这个函数需要迭代，那么每次迭代都会调用赋给Symbol.iterator的可迭代协议方法。
 * 
 * 赋值给Symbol.iterator的方法必须返回一个对象，这个对象必须有一个next方法，next方法不接受参数，并且返回一个包含以下两个属性的对象：
 * value: 序列中的当前值；
 * done：布尔值，表明序列是否结束。
 * 
 * 可迭代对象不能利用已有的forEach和for...in进行迭代，ES6为迭代可迭代对象提供了以下几种方式：
 * for...of, Array.from，和扩展操作符...
 * 
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
