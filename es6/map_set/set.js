/**
 * Set与Map类似：
 * 1. Set也是可迭代的；
 * 2. Set构造函数也接受一个可迭代对象；
 * 3. Set也有一个.size属性；
 * 4. 与Map中的键一样，Set的值可以是任意值或对象引用；
 * 5. 与Map中的键一样，Set的值必须是唯一的；
 * 6. NaN在Set中也等于NaN;
 * 7. Set同样拥有：.keys, .values, .entries, .forEach, .has, .delete 和 .clear 方法；
 *
 * 区别：
 * 1. Set没有键/值对，它只有一个维度；可以将Set视为元素彼此不同的数组。
 * 2. 由于只有一个维度，所以也就没有.get方法；要检查一个value是否在Set中，可以使用.has(value) API；
 * 3. Set也没有.set api，要添加元素，通过.add(value);
 * 4. Set是可迭代的，但是只能迭代值，不能迭代键/值对；
 * 5. Map默认的迭代器是Map#entries(返回[key.value]的迭代器), Set默认的迭代器是Set#values(返回[value]的迭代器)
 *   作为类似一维数组的集合，Set#entries返回的[value, value]的值在for...of/Array.from中展开set的操作场景下并不是很有价值；
 *
 * 利用Set唯一性原则，可用于数组去重；Array.from(new Set(array))
 */

const setCtx = new Set()

// setCtx.set('123') // setCtx.set is not a function

setCtx.add('123')

// 由于没有键值对，所以entries方法为集合中的每个元素返回[value, value]的迭代器，eg: ['123', '123']
console.log(setCtx, [...setCtx], [...setCtx.entries()], [...setCtx.values()])

console.log(setCtx[Symbol.iterator] === setCtx.values) // true
console.log(setCtx[Symbol.iterator] === setCtx.entries) // false

const setIterator = setCtx.values()
console.log(setIterator.next()) // {value: '123', done: false}
console.log(setIterator.next()) // {value: undefined, done: true}

const list = [1, 2, 2, 3, 3, 5]
console.log(Array.from(new Set(list)))
