/**
 * 生成器函数
 * 生成器的定义方式是先创建一个函数，******调用这个函数再返回生成器对象g******
 * 这个g是一个可迭代对象，可以通过Array.from(g),[...g],或for...of循环来使用它；
 */

function* abc() {
    yield 'a'
    yield 'b'
    yield 'c'
}

const chars = abc() // 一定要先调用，直接[...abc]是不行的

console.log(typeof chars[Symbol.iterator]) // function
console.log(typeof chars.next) // function
console.log(chars[Symbol.iterator]() === chars) // true

/**
 * 由于执行的内部迭代器，当执行过Array.from之后，chars.next() 返回的状态是 done:true,此时value已经为空，再执行[...chars]，返回的会是空对象
 * 这里对应的内部执行逻辑是：
 * 1. 创建生成器对象时，会得到一个用生成器函数产生可迭代序列的迭代器；
 * 2. 每当代码执行到yield时，迭代器就会返回该表达式的值，并且生成器函数会暂停执行；
 */
// console.log(Array.from(chars)) // ['a', 'b', 'c']
// console.log([...chars])
console.log(Array.from(chars), [...chars]) // ['a', 'b', 'c'], []

/**
 * 生成器函数的副作用
 * 当生成器函数恢复执行以返回序列中的下一个元素时，每一个yield语句后面的console.log语句都会执行；
 * 扩展为：
 * 当你对生成器迭代器调用 next() 恢复执行时，执行流会从上一次 yield 暂停的位置之后继续跑，直到遇到下一个 yield（或者函数结束），因此：
 * 每一个 yield 之后的同步代码，都会在“下一次恢复执行”时执行一次
 */
function* numberLog() {
    yield 1

    // 下一个yield之后新的执行流
    console.log('a')
    yield 2

    console.log('b')
    yield 3

    console.log('c')
}

console.log([...numberLog()]) // 会先打印a,b,c，然后输出[1,2,3]
/**
 * 如果要保持numberLog函数声明的顺序，可以使用for...of循环，在for...of循环中，会逐个打印numbers序列中的每个元素
 * 第一次从生成器函数中取number时，会返回1并暂停执行；
 * 第二次，生成器函数会从上次暂停的地方恢复并打印出副作用'a'，接着返回2；
 * 第三次的副作用是'b'，并返回3；
 * 第四次的副作用是'c',此时生成器指示序列已结束。
 */
for (const str of numberLog()) {
    console.log(str)
}

/** 使用yield*委托生成序列
 * 可以通过yield* 将生成序列的任务委托给任何遵守可迭代协议的对象，而不仅仅是字符串，这些对象包括：
 * · 生成器对象；
 * · 数组；
 * · arguments;
 * ` 浏览器中的NodeList;
 * (只要实现了Symbol.iterator就可以)
 */
function* salute(name) {
    yield* 'hello'
    yield* name
}
console.log('使用yield*生成序列', [...salute()]) // ['h', 'e', 'l', 'l', 'o'], 当然其实也可以[...'hello'],更加简单。这里的意义在于可以使用多条yield语句
