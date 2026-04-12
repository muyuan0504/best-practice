/**
 * 生成器函数的es5垫片代码是如何实现的?
 *
 * ES5 本身是不支持 generator function（function* / yield）的;
 * 所以所谓“垫片（polyfill）”，本质上是把 generator 编译成一个状态机（state machine）+ 迭代器协议
 *
 * Generator 的 ES5 垫片本质就是：
 * 把函数执行过程编译成一个“状态机 + iterator 对象”，用 next() 手动驱动执行
 *
 * -- 最经典的实现就是 regenerator-runtime（由 Facebook 开源，用在 Babel 里）
 *
 * 1. 核心思想：把 yield 变成状态机，本质是：yield → return { value, done }
 *            函数暂停 → 用 state 记录执行位置；
 *            内部通过闭包实现状态控制；
 * 2. regenerator 的真实结构
 * 真正的实现比上面复杂很多，因为要支持：yield*  try/catch  return()  throw()
 *
 * 为什么必须使用状态机，因为ES5：
 * 1. 没有“函数暂停能力”；
 * 2. 没有“携程”；
 * 3. 没有“栈冻结”；
 * 所以只能：用变量模拟执行位置； 这就是：编译器把控制流写成状态机。
 *
 * 这些能力，在es6是如何体现的：
 * 1. 可暂停执行（Suspend）针对 yield 操作，js引擎会做一件 ES5 做不到的事: 暂停当前函数执行，并冻结整个执行上下文；
 * 2. 可恢复执行（Resume）当调用生成器 .next() 方法时，引擎内部：恢复之前保存的执行上下文，从“断点位置”继续执行；
 * 3. 内建程序计数器（Program Counter）
 *    在es5，你需要用变量来切换状态：switch(state) {}；
 *    在 ES6：JS 引擎内部维护：[[GeneratorState]] 和 [[GeneratorContext]]，执行位置是引擎级别的，而不是 JS 层变量
 * 4. 执行上下文可冻结（Execution Context Snapshot）「最核心的能力」，在 ES6 generator 里：
 *    当执行到第一个 yield时， eg: x = 10; yield 10, 引擎会保存：x = 10;  当前作用域链;  当前执行位置; 下次恢复时：x 还是 10；
 * 5. Generator Object（控制接口）
 *    ES6 直接内建了生成器的 next/throw/return，对应内部操作为：ResumeNormal、ResumeThrow、ResumeReturn
 * 6. 协程（Coroutine-like）：generator 本质是“半协程”，可以在多个函数之间来回切换执行权
 *    虽然 JS 不是完全协程，但 generator 已经具备：主动让出执行权（yield）；外部恢复执行；
 *
 * 「ES6 是如何在规范层面定义的」：
 * 在 ECMA International 的规范里，generator 是通过这些内部槽实现的：
 * 【Generator 内部结构】：
 * Generator {
 *   [[GeneratorState]]: "suspendedStart" | "suspendedYield" | "executing" | "completed"
 *   [[GeneratorContext]]: execution context
 * }
 * 【next() 的本质流程】：
 * 1. 如果正在执行 → 报错（防止重入）
 * 2. 恢复 [[GeneratorContext]]
 * 3. 从上次 yield 位置继续执行
 * 4. 遇到 yield → 再次 suspend
 * 5. 返回 { value, done }
 *
 * 「yield 的规范行为」：
 * YieldExpression :
 *     yield AssignmentExpression
 * 做的事情：
 * · 暂停执行
 * · 返回 value
 * · 保存当前位置
 * · 等待 next() 恢复
 *
 * 综上：
 * ES5 的 regenerator：在 JS 层模拟“执行引擎”； 你写代码 → Babel → 状态机 → JS执行 （控制流在“用户代码”）
 * ES6 的 generator：把“执行引擎能力”直接做进 JS 引擎； 你写代码 → JS引擎直接理解 yield（控制流在“引擎内部”）
 *
 */

// 1. 把 yield 变成状态机
function* gen() {
    yield 1
    yield 2
    return 3
}
const g = gen()
console.log(g.next())
console.log(g.next())
console.log(g.next())
console.log(g.next())
// 生成器函数 gen 的 es5 代码实现
function gen() {
    var state = 0
    return {
        next: function () {
            switch (state) {
                case 0:
                    state = 1
                    return { value: 1, done: false }
                case 1:
                    state = 2
                    return { value: 2, done: false }
                case 2:
                    state = 3
                    return { value: 3, done: true }
                default:
                    return { value: undefined, done: true }
            }
        },
    }
}
const gFn = gen()
console.log('状态机实现：', gFn.next())
console.log('状态机实现：', gFn.next())
console.log('状态机实现：', gFn.next())
console.log('状态机实现：', gFn.next())

/**
 * 生成器函数的核心实现：
 * 1. 包装函数 genWrapper 函数；
 * 2. 状态机函数 innerFn;
 * 3. 执行上下文 context (核心逻辑);
 * 4. wrap：生成iterator
 * 5. step: 驱动执行
 */

function genWrapper() {
    return regeneratorRunTime.wrap(innerFn)
}
function innerFn() {
    while (1) {
        switch ((context.prev = context.next)) {
            case 0:
                context.next = 2
                return 1

            case 2:
                context.next = 4
                return 2

            case 4:
                return context.stop()
        }
    }
}
// 执行上下文的作用：1. 记录执行位置： next;  2. 控制流程（next, throw, return）；  3. 保存返回值
var context = {
    prev: 0,
    next: 0,
    done: false,
    method: 'next',
    arg: undefined,
    stop: function () {
        this.done = true
        return this.rval
    },
}
// wrap函数：生成 iterator
function wrap(innerFn) {
    var context = createContext() // context是context对象的实例，这里是伪代码实现

    return {
        next: function (arg) {
            context.method = 'next'
            context.arg = arg
            return step(innerFn, context)
        },
        throw: function (arg) {
            context.method = 'throw'
            context.arg = arg
            return step(innerFn, context)
        },
    }
}
// step函数
function step(innerFn, context) {
    var value = innerFn(context)

    return {
        value: value,
        done: context.done,
    }
}
