/** 实现一个深拷贝，考虑类型、循环引用和公共引用的问题 */

function deepClone(obj, hash = new WeakMap()) {
    // 处理常量
    if (obj === null || typeof obj !== 'object') return obj
    if (hash.has(obj)) return hash.get(obj)
    // 这里需要考虑下数组类型, 并且这里都单独声明了一个新的数组和对象，在后续 forin循环中，保证了深拷贝的处理
    const clone = Array.isArray(obj) ? [] : {}
    hash.set(obj, clone)
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            // 递归拷贝
            clone[key] = deepClone(obj[key], hash)
        }
    }

    return clone
}

const list = [1, { c: 1 }, 3]

const hasObj = {
    a: 1,
    b: list,
    c: {
        list,
    },
}

const objClone = deepClone(hasObj)
const assignObj = Object.assign({}, hasObj)
const useApiObj = { ...hasObj }
const useJsonObj = JSON.parse(JSON.stringify(hasObj))

list[1].c = 2

console.log('使用深拷贝：', objClone, objClone.c.list)
console.log('使用Object.assign：', assignObj, assignObj.c.list)
console.log('使用...扩展符号', useApiObj, useApiObj.c.list)
console.log('使用JSON解析：', useJsonObj, useJsonObj.c.list)
