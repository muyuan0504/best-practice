# 为什么 Map 的默认迭代器是 `entries`，而 Set 的默认迭代器是 `values`？

## 规范里怎么写的

在 ECMAScript 里，`for...of`、展开语法、`Array.from` 等使用的是实例上的 **`@@iterator`**（即 `Symbol.iterator`）。

- **`Map.prototype[Symbol.iterator]`** 与 **`Map.prototype.entries`** 是同一个函数（规范里记作 `%MapProto_entries%`）。
- **`Set.prototype[Symbol.iterator]`** 与 **`Set.prototype.values`** 是同一个函数（规范里记作 `%SetProto_values%`）。

所以这不是引擎“随意实现”的，而是语言层面的约定。

---

## 为什么 Map 默认用 `entries`？

1. **Map 的语义就是「键值对」**  
   业务里最常见的用法是同时关心「键」和「值」。默认迭代器产出 **`[key, value]`**，和 `Object.entries(obj)` 那种「成对出现」的心智模型一致。

2. **和语法配合得好**  
   可以直接写成：

   ```js
   for (const [k, v] of map) { /* ... */ }
   ```

   若默认是 `values()`，只会拿到值，键还要另想办法（例如再维护一份结构或只用 `map.keys()` 再 `get`），反而别扭。

3. **`keys` / `values` / `entries` 在 Map 上彼此不同**  
   三个方法语义分明；选 **`entries` 作为默认**最能代表「整张映射表」的完整信息。

---

## 为什么 Set 默认用 `values`？

1. **Set 只有一个有意义的维度：元素本身**  
   规范里 `Set` 的「键」与「值」是同一套东西：不存在独立于值的另一套键。文档里也常说：可以把 Set 看成「元素互不相同的集合」。

2. **`keys` 与 `values` 在 Set 上是同一迭代行为**  
   规范规定：`Set.prototype.keys` 与 `Set.prototype.values` 是同一个函数。也就是说，**所谓「键」就是「值」**，没有额外信息。

3. **`entries` 在 Set 上信息量重复**  
   `set.entries()` 产生的是 **`[value, value]`**。对大多数场景来说，这和只迭代 `value` 一次相比没有增益，却更啰嗦。默认用 **`values`**，展开或 `for...of` 时直接得到元素列表，**和「数组去重」「遍历集合成员」的直觉一致**：

   ```js
   [...set]           // 等价于 [...set.values()]
   for (const x of set) { /* x 就是成员 */ }
   ```

4. **和 Array 的类比**  
   数组默认迭代的是「元素」（类似 `values` 的视角）。Set 常被当成「无重复元素的序列」来用，默认产出单个成员而不是 `[v,v]`，读起来更自然。

---

## 小结

| 结构 | 默认 `Symbol.iterator` | 直觉 |
|------|-------------------------|------|
| **Map** | 等于 `entries()` | 映射表 → 默认给出 **键值对** |
| **Set** | 等于 `values()`（也是 `keys()`） | 集合 → 默认给出 **成员本身** |

需要别的视图时，两者都可以显式调用 `.keys()`、`.values()`、`.entries()`，不会丢失能力；默认迭代器只是选了**最常见、最少冗余**的那一种。
