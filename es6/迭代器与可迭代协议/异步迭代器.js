/**
 * 迭代器按照协议委托[Symbol.iterator]实例的next方法返回一个有value和done属性的对象；
 * value属性表示序列中当前的值；
 * done属性是一个布尔值，用于表明序列是否结束。
 *
 * 异步迭代器：
 * 协议稍有不同：next返回一个Promise,这个Promise解决后会返回包含value和done属性的对象。
 * Promise支持执行序列中的异步任务，即下一步会等上一步解决之后再执行。
 * 声明方式：[Symbol.asyncIterator]
 * 使用方式：for await...of
 */

const sequence = {
    [Symbol.asyncIterator]() {
        const item = ['a', 'b', 'c']
        return {
            next() {
                return Promise.resolve({ value: item.shift(), done: item.length === 0 })
            },
        }
    },
}

// await 只能在async的上下文中使用
// for await (const item of sequence) {
//     console.log(item)
// }

async function useAsyncIterator() {
    for await (const item of sequence) {
        console.log(item)
    }
}

useAsyncIterator()