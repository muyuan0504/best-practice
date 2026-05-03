/**
 * [键/值]数据结构，用于构建映射关系
 *
 * 键是唯一的，值可以重复
 * 键和值可以是任何类型
 *
 * Map 也是可迭代对象（实现 [Symbol.iterator]），因此支持：
 * for...of、扩展运算符、Array.from
 * 另有 map.forEach 遍历
 * 
 * Map的构造函数可以将可迭代对象作为参数来创建新的map
 *
 * Map 实例上的核心 API（见 MDN Map）：
 * map.set(key, value) / get(key) / has(key) / delete(key) / clear() / size
 * map.keys() / values() / entries() —— 返回的迭代器本身也可迭代
 * map.forEach((value, key, map) => {}, thisArg)
 *
 * 关于「看起来像对象」的方法：
 * - toString：继承自 Object.prototype，对 Map 一般为 "[object Map]"（依赖 Symbol.toStringTag）
 * - valueOf：继承自 Object.prototype，返回 Map 实例自身
 * - Map 没有 toJSON；JSON.stringify(map) 会得到 "{}"，需自行序列化（如 Array.from(map)、Object.fromEntries）
 * - Symbol.toStringTag 在 Map.prototype 上，值为 "Map"，用 map[Symbol.toStringTag] 读取
 * - hasOwnProperty / isPrototypeOf / propertyIsEnumerable 继承自 Object.prototype，
 *   它们描述的是「对象自有属性」，不是 Map 的「键」；判断键请用 map.has(key)
 */

const map = new Map()

map.set('a', 1)
map.set('b', 2)
map.set('c', 3)

// 遍历：for...of、forEach、扩展运算符、Array.from
for (const [key, value] of map) {
    console.log('key:', key, 'value:', value)
}

console.log('map:', [...map]) // [['a', 1], ['b', 2], ['c', 3]]

console.log('map:', Array.from(map)) // [['a', 1], ['b', 2], ['c', 3]]

map.forEach((value, key) => {
    console.log('forEach key:', key, 'value:', value)
})

// map 创建的迭代器对象
const keyIterator = map.keys()
console.log('keyIterator:', Array.from(keyIterator))
const valueIterator = map.values()
console.log('valueIterator:', Array.from(valueIterator))
const entriesIterator = map.entries()
console.log('entriesIterator:', Array.from(entriesIterator))

// 创建 map 副本
const mapCopy = new Map(map)
console.log('mapCopy:', mapCopy)

// Map 核心 API
console.log('map.get(a):', map.get('a'))
console.log('map.has(a):', map.has('a'))
console.log('map.delete(a):', map.delete('a'))
console.log('map.size:', map.size)

// 与 Object 原型链相关的方法（存在，但语义不是「查键」）
console.log('Object.prototype.toString.call(map):', Object.prototype.toString.call(map))
console.log('map[Symbol.toStringTag]:', map[Symbol.toStringTag])
console.log('map.toString():', map.toString())
console.log('map.valueOf() === map:', map.valueOf(), map.valueOf() === map)

// Map 无 toJSON；需要结构化数据时自己选格式
console.log('JSON.stringify(map)（默认几乎为空对象）:', JSON.stringify(map))
console.log('序列化为数组条目:', JSON.stringify(Array.from(map)))
console.log('键均为字符串时可用 Object.fromEntries:', JSON.stringify(Object.fromEntries(map)))

// hasOwnProperty：查的是对象自有属性名，不是 Map 的键
console.log('map.has("b"):', map.has('b'))
console.log('Object.prototype.hasOwnProperty.call(map, "b"):', Object.prototype.hasOwnProperty.call(map, 'b'))

console.log('map:', map)

console.log('map.clear():', map.clear())

console.log('map:', map)
