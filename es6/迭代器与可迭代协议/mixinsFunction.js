/**
 * 生成器混入可迭代对象
 *
 * 迭代器协议函数基于生成器函数声明
 */

const fibonacci = {
    *[Symbol.iterator]() {
        let prev = 0
        let cur = 1
        while (true) {
            yield cur
            const next = cur + prev
            prev = cur
            cur = next
        }
    },
}

const g = fibonacci[Symbol.iterator]()

console.log(g.next()) // {value: 1, done: false}
console.log(g.next()) // {value: 1, done: false}
console.log(g.next()) // {value: 2, done: false}
console.log(g.next()) // {value: 3, done: false}
console.log(g.next()) // {value: 5, done: false}
console.log(g.next()) // {value: 8, done: false}
