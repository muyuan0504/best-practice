/**
 * 实现一个类，支持：
 * 1. enquene(promise, priority): 添加异步任务，并支持传入优先级参数，priority越小意味着优先级越高，默认为0
 * 2. start(limit): 开启异步任务，支持传入limit参数，表示并发量, 并返回一个Promise，当所有任务都执行完成后，将任务结果按顺序排序保存到数组中并返回
 * 3. stop: 暂停任务执行，不影响已经执行的任务
 * 4. resume: 恢复任务执行
 */

/** 任务结果按顺序 -> 这里针对两种情况分别处理下：
 * 1. 按照优先级顺序, 如果输出要跟优先级顺序返回，那么当调用stop，再插入异步任务后，priority的优先级会影响输出的排序, 这里除非限制 start 调用后不允许添加新任务
 * 2. 按照添加顺序
 */

class AsyncTaskModel {
    static TASK_STATUS = { wait: 0, pending: 1, success: 2, error: -1 }
    constructor() {
        // 状态相关, limit-并发量, lockFlag-执行锁
        this.limit = 10
        this.lockFlag = false

        // 数据相关 taskQueue-任务列表  taskCount-已经执行完毕的任务数  result-结果数组
        this.taskQueue = []
        this.taskCount = 0
        this.result = []
        this.index = 0
    }
    enquene(task, priority = 0) {
        // status: 任务的执行状态 0-pending  1-success  2-error
        const taskItem = {
            task,
            priority,
            index: this.index++,
            status: 0,
        }
        this.taskQueue.push(taskItem)
        this.taskQueue.sort((a, b) => a.priority - b.priority)
    }
    start(limit = 10) {
        this.limit = limit
        this.flushTask()
        return new Promise((resolve) => {
            // 这里要处理的情况包括
            // 如果允许动态插入，这里需要用setIntervel轮询任务数
            let itv = setInterval(() => {
                if (this.taskCount === this.taskQueue.length) {
                    clearInterval(itv)
                    resolve(this.result)
                }
            }, 2000)
        })
    }
    // 刷新任务队列
    flushTask() {
        // 当执行完的任务数 < 当前任务总数时
        const queueLen = this.taskQueue.length
        if (this.taskCount < queueLen && !this.lockFlag) {
            // 通过滑动窗口的形式，增加任务往后遍历的最大右区间
            const useLen = this.taskCount + this.limit > queueLen - 1 ? queueLen - 1 : this.taskCount + this.limit
            for (let i = 0; i <= useLen; i++) {
                const taskItem = this.taskQueue[i]
                // 如果状态是wait或者异常，那么取出任务执行
                if (taskItem.status === AsyncTaskModel.TASK_STATUS.wait || taskItem.status === AsyncTaskModel.TASK_STATUS.error) {
                    this.execTask(taskItem, i)
                } else {
                    continue
                }
            }
        }
    }
    // 执行任务， 如果需要更新调整后的index，那么这个函数接收index即可
    execTask(taskItem, _index) {
        taskItem.status = AsyncTaskModel.TASK_STATUS.pending
        taskItem
            .task()
            .then((res) => {
                // this.result[_index] = res
                this.result[taskItem.index] = res
                taskItem.status = AsyncTaskModel.TASK_STATUS.success
                this.taskCount++
                this.flushTask()
            })
            .catch(() => {
                taskItem.status = AsyncTaskModel.TASK_STATUS.error
            })
    }
    stop() {
        this.lockFlag = true
    }
    resume() {
        this.lockFlag = false
        this.flushTask()
    }
}

const taskModule = new AsyncTaskModel()

taskModule.enquene(() => new Promise((resolve) => setTimeout(() => resolve(1), 3000)))

taskModule.enquene(() => new Promise((resolve) => setTimeout(() => resolve(2), 1000)), 3)

taskModule.enquene(() => new Promise((resolve) => setTimeout(() => resolve(3), 2000)))

taskModule.start(2).then((res) => {
    console.log(res)
})

console.error('---------- aiden --------------', taskModule.taskQueue)
