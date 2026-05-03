/**
 * 对比Map:
 * 1. WeakMap中没有迭代器协议(对比Map中是存在的),所以使用WeakMap创建的集合不像Map那样可迭代;
 * 2. Map中的key可以是对象引用或其他，但是WeakMap中的每个key都必须是一个对象；
 * 3. Symbol作为一种值类型，因此也不能作为WeakMap的key
 *
 * 为了成为一个特征有限的集合，WeakMap中键的引用是弱保持的；也就是说，如果作为WeakMap键的对象除了弱引用外没有其他的引用，则该对象将被垃圾回收清除。
 *
 * 为了高效地实现弱引用，WeamMap的API更少，但它仍然保持与Map相同的.has/.get/.delete方法。
 */

const weakMapCtx = new WeakMap()

// weakMapCtx.set('a', 1) // Invalid value used as weak map key, key必须是一个对象

const nameMap = { name: 'a' }
weakMapCtx.set(nameMap, 'nameA')

weakMapCtx.set(nameMap) // 对同一个key的重复添加，同样会覆盖，此时为 weakMapCtx.get(nameMap) 为 undefined

console.log(weakMapCtx)

weakMapCtx.delete(nameMap)

console.log(weakMapCtx)
