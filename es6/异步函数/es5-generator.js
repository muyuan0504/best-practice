/**
 * 生成器函数的 ES5 垫片（以 Babel + regeneratorRuntime 为代表）是如何工作的？
 *
 * 结论先行：
 * 1) ES5 没有原生 "暂停/恢复函数执行" 的能力；
 * 2) 编译器把 generator 编译成：状态机 + 上下文对象 + iterator 接口；
 * 3) 每次调用 next/throw/return，本质都是在驱动状态机向前走一步。
 *
 * ----------------------------
 * 一、为什么一定是“状态机”
 * ----------------------------
 * 因为 ES5 层面没有 function* / yield，也没有可直接暴露给开发者的执行上下文挂起 API。
 * 所以只能用一个状态变量（如 state/context.next）记录“下一步要执行到哪一段代码”。
 *
 * 每次 next()：
 * - 进入 switch(state)
 * - 执行当前分支
 * - 更新 state 到下一位置
 * - 返回 { value, done }
 *
 * ----------------------------
 * 二、ES6 generator 在引擎侧提供了什么
 * ----------------------------
 * 规范里可理解为（概念化描述）：
 * Generator {
 *   [[GeneratorState]]: "suspendedStart" | "suspendedYield" | "executing" | "completed"
 *   [[GeneratorContext]]: 执行上下文（由引擎内部维护）
 * }
 *
 * next() 的核心流程：
 * 1. 若当前为 executing，抛错（防止重入）
 * 2. 恢复此前挂起的执行上下文
 * 3. 从上次 yield 处继续执行
 * 4. 再遇到 yield 时再次挂起并返回 { value, done: false }
 * 5. 结束时返回 { value, done: true }
 *
 * ----------------------------
 * 三、最小可运行模型（教学版）
 * ----------------------------
 * 下方代码分三层：
 * A. 原生 generator 行为演示
 * B. 纯 ES5 状态机手写版
 * C. regenerator 风格骨架（wrap + innerFn + context + step）
 *
 * 注意：真实 regeneratorRuntime 还会处理 yield*、try/catch/finally、return/throw 等复杂路径。
 */

// A. 原生 generator 行为演示
function* nativeGen() {
    yield 1
    yield 2
    return 3
}

const nativeIt = nativeGen()
console.log('原生实现：', nativeIt.next()) // { value: 1, done: false }
console.log('原生实现：', nativeIt.next()) // { value: 2, done: false }
console.log('原生实现：', nativeIt.next()) // { value: 3, done: true }
console.log('原生实现：', nativeIt.next()) // { value: undefined, done: true }

// B. 纯 ES5 状态机手写版（只实现 next）
function stateMachineGen() {
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

const smIt = stateMachineGen()
console.log('状态机实现：', smIt.next())
console.log('状态机实现：', smIt.next())
console.log('状态机实现：', smIt.next())
console.log('状态机实现：', smIt.next())

// C. regenerator 风格骨架（教学简化版）
function genWrapper() {
    // 真实 Babel 产物一般是：regeneratorRuntime.wrap(innerFn, outerFn, self, tryLocsList)
    return regeneratorRuntime.wrap(innerFn)
}

// 状态机主体：由编译器生成，context 用于记录“执行到哪里”
function innerFn(context) {
    while (1) {
        switch ((context.prev = context.next)) {
            case 0:
                context.next = 2
                return 1
            case 2:
                context.next = 4
                return 2
            case 4:
                context.rval = 3
                return context.stop()
            default:
                return context.stop()
        }
    }
}

// 每个迭代器都应该有独立 context，不能共用全局 context
function createContext() {
    return {
        prev: 0,
        next: 0,
        done: false,
        method: 'next',
        arg: undefined,
        rval: undefined,
        stop: function () {
            this.done = true
            return this.rval
        },
    }
}

// wrap：返回符合 iterator 协议的对象
function wrap(innerFn) {
    var context = createContext()

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
        return: function (arg) {
            context.method = 'return'
            context.arg = arg
            context.rval = arg
            context.done = true
            return { value: arg, done: true }
        },
    }
}

// step：驱动状态机执行一步，并统一包装 { value, done }
function step(innerFn, context) {
    var value = innerFn(context)
    return { value: value, done: context.done }
}
