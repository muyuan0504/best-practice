/**
 * JS的多线程是OS级别的，是直接调用系统API创建的多线程
 * 但是JS的多线程无法操作DOM，没有window对象，每个线程的数据都是独立的。
 * 【JS没有线程同步的概念
 * 
 * 
 * 
 * 
 * 
 * 
 * 】：
 * 主线程传给子线程的数据是通过拷贝复制，同样的子线程给主线程的数据也是通过拷贝复制，而不是共享同一块内存区域。
 */

var i = 0
let timeItv = null

function timedCount() {
    i = i + 1
    if (i > 10) {
        clearTimeout(timeItv)
        timeItv = null
        postMessage('end')
        return
    }
    postMessage(i)
    timeItv = setTimeout('timedCount()', 500)
}

timedCount()
