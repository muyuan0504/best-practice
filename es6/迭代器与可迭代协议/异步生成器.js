/**
 * 异步生成器（Async Generator）学习文档
 *
 * 一句话理解：
 * - 生成器：按需产出值（yield）
 * - 异步：每次产出前后都可以等待异步任务（await）
 *
 * 声明方式：async function* fn() {}
 * 消费方式：for await...of 或者 手动调用 next()
 */

// 用于模拟网络/IO延迟
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 示例1：最基础的异步生成器
 * - 每次 yield 前等待一段时间
 * - 最终 return 的值不会被 for await...of 消费到
 */
async function* basicAsyncGenerator() {
  await sleep(200)
  yield "A"

  await sleep(200)
  yield "B"

  await sleep(200)
  yield "C"

  return "DONE"
}

/**
 * 示例2：手动迭代 next()
 * - next() 返回 Promise
 * - Promise resolve 后得到 { value, done }
 */
async function manualNextDemo() {
  console.log("\n--- 示例2：手动 next() ---")
  const it = basicAsyncGenerator()

  console.log(await it.next()) // { value: 'A', done: false }
  console.log(await it.next()) // { value: 'B', done: false }
  console.log(await it.next()) // { value: 'C', done: false }
  console.log(await it.next()) // { value: 'DONE', done: true }
}

/**
 * 示例3：for await...of
 * - 只会拿到 done: false 时的 value
 * - done: true 时本次 value（即 return 值）不会进入循环体
 */
async function forAwaitDemo() {
  console.log("\n--- 示例3：for await...of ---")
  for await (const item of basicAsyncGenerator()) {
    console.log("for await 收到：", item)
  }
  console.log("循环结束（return 值不会出现在上面的日志中）")
}

/**
 * 示例4：错误处理
 * - 生成器内部抛错会中断消费
 * - 外部可用 try/catch 捕获
 */
async function* generatorWithError() {
  yield 1
  await sleep(100)
  throw new Error("模拟请求失败")
}

async function errorDemo() {
  console.log("\n--- 示例4：错误处理 ---")
  try {
    for await (const item of generatorWithError()) {
      console.log("收到：", item)
    }
  } catch (error) {
    console.log("捕获到错误：", error.message)
  }
}

/**
 * 示例5：实战风格 - 分页拉取数据
 * 目标：把“循环请求下一页”的逻辑封装成异步生成器
 */
async function fakeFetchPage(pageNo) {
  await sleep(150)
  const db = {
    1: ["u1", "u2"],
    2: ["u3", "u4"],
    3: ["u5"],
  }
  const list = db[pageNo] || []
  return {
    list,
    hasMore: pageNo < 3,
  }
}

async function* usersByPage() {
  let pageNo = 1
  while (true) {
    const { list, hasMore } = await fakeFetchPage(pageNo)
    for (const user of list) {
      yield user
    }
    if (!hasMore) return
    pageNo += 1
  }
}

async function paginationDemo() {
  console.log("\n--- 示例5：分页流式消费 ---")
  for await (const user of usersByPage()) {
    console.log("用户：", user)
  }
}

/**
 * 统一执行
 * 注意：for await...of 需要在 async 函数里使用（或支持 top-level await 的模块环境）
 */
async function main() {
  await manualNextDemo()
  await forAwaitDemo()
  await errorDemo()
  await paginationDemo()
}

main()

