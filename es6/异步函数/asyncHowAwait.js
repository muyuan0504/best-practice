/**
 * 当存在以下函数，如何逆向实现spawn函数，来实现 生成器函数的异步await
 */

function exercise() {
    function* useAsync() {
        const r1 = yield new Promise((resolve) => {
            setTimeout(() => {
                resolve(1)
            }, 2000)
        })
        const r2 = yield new Promise((resolve) => {
            setTimeout(() => {
                resolve(2)
            }, 1000)
        })
        // return 的值会作为最后一次 next() 的 value,此次 next() 返回的 done 为true;
        return [r1, r2]
    }
    return spawn(useAsync)
}

// exercise().then((result) => console.log('运行生成器函数后的输出：', result))

/**
 * spawn的实现 - 首先定义输入输出
 * 输入 - 接受参数：一个生成器函数
 * 输出 - 一个Promise，结果是生成器函数的内部返回值
 *
 */
function spawn(generatorFn) {
    const g = generatorFn() // 返回生成器对象g - g.next().value 是r1的Promise实例

    // const execFn = g.next()
    // execFn.value.then((res) => {
    //     console.log('打印r1: ', res, execFn.done) // 1， false
    // })
    // if (execFn.done) {
    //     // 因为生成器函数 useAsync 最终 return [r1, r2]; 所以当最终的生成器对象的done=true时，返回的value，就是[r1, r2]
    //     resolve(execFn.value)
    //     return
    // }

    return new Promise((resolve) => {
        step(() => g.next())
        /**
         * 封装执行流，切换当前生成器的next函数
         */
        function step(nextFn) {
            const next = nextFn()

            if (next.done) {
                // 说明生成器已经状态都是已完成; 并且生成器函数 useAsync 最终返回 [r1, r2]； 所以next.value会指向该return;
                resolve(next.value)
                return
            }

            // 生成器还在迭代, 通过 Promise.resolve 来保证内部Promise会在正常结束后走到.then

            // 关键点: yield 表达式的“结果”来自下一次 next(value) 传入的 value。
            // 所以这里必须把 Promise resolve 的结果 val 回传给 g.next(val)，
            // 才能让 `const r1 = yield ...` / `const r2 = yield ...` 拿到真实值。
            // 如果写成 g.next()（不传值），对应 yield 的结果就是 undefined。
            
            Promise.resolve(next.value).then(
                (val) => step(() => g.next(val)),
                (err) => step(() => g.throw(err))
            )
        }
    })
}

exercise().then((res) => {
    console.log('执行完成：', res)
})

function usePromise() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('end')
        }, 1000)
    })
}

Promise.resolve(usePromise()).then((res) => {
    console.log('usePromiseResolve: ', res)
})

Promise.resolve(5).then((res) => {
    console.log('usePromiseResolve: ', res)
})

/**
 * 示例: 演示 next(value) 如何回传到 yield
 */
function demoNextValueInjection() {
    function* demoGen() {
        const first = yield 'first-yield'
        const second = yield 'second-yield'
        return { first, second }
    }

    // 场景1: 正确传值，yield 能拿到 next(value) 的 value
    const g1 = demoGen()
    console.log('[g1] step1:', g1.next()) // { value: 'first-yield', done: false }
    console.log('[g1] step2:', g1.next(100)) // first = 100
    console.log('[g1] step3:', g1.next(200)) // second = 200

    // 场景2: 不传值，yield 对应变量会是 undefined
    const g2 = demoGen()
    console.log('[g2] step1:', g2.next()) // { value: 'first-yield', done: false }
    console.log('[g2] step2:', g2.next()) // first = undefined
    console.log('[g2] step3:', g2.next()) // second = undefined
}

demoNextValueInjection()
