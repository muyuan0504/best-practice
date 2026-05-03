/**
 * 就像 Map 和 WeakMap 的关系一样，WeakSet 是 Set 的弱引用版本。
 *
 * 与 Set 的不同：
 * 1. WeakSet 无法迭代：没有 Symbol.iterator，也没有 values / keys / entries / forEach / size，规范有意不暴露「枚举全部成员」的能力；
 * 2. WeakSet 的值必须是唯一的对象引用；若集合中的某个值在别处不再被引用，它可被垃圾回收，对应成员会从集合中消失；
 * 3. WeakSet 只有 .add、.delete 以及 .has；与 Set 一样没有 .get，因为是一维集合。
 *
 * 如何「获取」WeakSet 里的值：
 * - 不能遍历或列出全部成员；只能在你已持有某个对象引用 obj 时，用 weakSet.has(obj) 判断是否在其中；
 * - 若业务需要枚举全部元素，应使用 Set，或另行维护一份可迭代的强引用列表（并自行处理删除与内存）。
 *
 */

const weakSetCtx = new WeakSet()

// 不能向 WeakSet 添加基本类型的值
// weakSetCtx.add('a') // Invalid value used in weak set

const catObj = { cat: 'dog' }

weakSetCtx.add(catObj)

console.log(weakSetCtx, weakSetCtx.has(catObj))
