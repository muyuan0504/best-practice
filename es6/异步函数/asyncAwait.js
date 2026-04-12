/**
 * async...await 的常规用法
 */

async function useAsync() {
    const r1 = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(1)
        }, 2000)
    })
    const r2 = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(2)
        }, 1000)
    })
    return [r1, r2]
}

useAsync().then((res) => {
    console.log(res) // 3s后输出： [1,2]
})

/**
 * 利用生成器和Promise，分析 async...await 语法糖
 *
 * 1. 实现一个以生成器为参数的spawn辅助函数;
 * 2. 将 useAsync 函数的代码体包装到一个生成器中，再将生成器传给 spawn 函数，同时在生成器中用 yield 代替 await
 */
function spawn(generator) {
    return new Promise((resolve, reject) => {
        const g = generator()

        //运行第一步
        step(() => g.next())

        // 定义步进函数
        function step(nextFn) {
            const next = runNext(nextFn)
            if (next.done) {
                // 成功结束，解决当前Promise
                resolve(next.value)
                return
            }
            // 如果next未结束，连缀返回的Promise并运行下一步
            Promise.resolve(next.value).then(
                (value) => step(() => g.next(value)),
                (err) => step(() => g.throw(err))
            )
        }

        // 定义执行函数
        function runNext(nextFn) {
            try {
                // 继续执行生成器代码
                return nextFn()
            } catch (err) {
                // 失败，拒绝当前Promise
                reject(err)
            }
        }
    })
}

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
        return [r1, r2]
    }
    return spawn(useAsync)
}

exercise().then((result) => console.log('运行生成器函数后的输出：', result))
