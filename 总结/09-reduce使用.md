```js
reduce(callback(accumulator, currentValue[, index, array])[,initialValue])
```

`reduce` 接受两个参数，回调函数和初识值，初始值是可选的。回调函数接受4个参数：积累值、当前值、当前下标、当前数组。

如果 `reduce`的参数只有一个，那么积累值一开始是数组中第一个值，如果`reduce`的参数有两个，那么积累值一开始是出入的 `initialValue` 初始值。然后在每一次迭代时，返回的值作为下一次迭代的 `accumulator` 积累值。

### 示例

```js
// 求和
[3, 5, 4, 3, 6, 2, 3, 4].reduce((a, i) => a + i);
// 30

// 有初始化值
[3, 5, 4, 3, 6, 2, 3, 4].reduce((a, i) => a + i, 5 );
// 35

// 如果看不懂第一个的代码，那么下面的代码与它等价
[3, 5, 4, 3, 6, 2, 3, 4].reduce(function(a, i){return (a + i)}, 0 );

// 乘法
[3, 5, 4, 3, 6, 2, 3, 4].reduce((a, i) => a * i);
```

```js
// 查找数组中的最大值
[3, 5, 4, 3, 6, 2, 3, 4].reduce((a, i) => Math.max(a, i), -Infinity);

Math.max(...[3, 5, 4, 3, 6, 2, 3, 4]);
```

```js
// 连接不均匀数组
let data = [
  ["The","red", "horse"],
  ["Plane","over","the","ocean"],
  ["Chocolate","ice","cream","is","awesome"], 
  ["this","is","a","long","sentence"]
]
let dataConcat = data.map(item=>item.reduce((a,i)=>`${a} ${i}`))
// 使用 map 来遍历数组中的每一项，我们对所有的数组进行还原，并将数组还原成一个字符串
// 结果
['The red horse', 
'Plane over the ocean', 
'Chocolate ice cream is awesome', 
'this is a long sentence']
```

```js
// 移除数组中的重复项
let dupes = [1,2,3,'a','a','f',3,4,2,'d','d']
let withOutDupes = dupes.reduce((noDupes, curVal) => {
  if (noDupes.indexOf(curVal) === -1) { noDupes.push(curVal) }
  return noDupes
}, [])
// 检查当前值是否在累加器数组上存在，如果没有则返回-1，然后添加它

```

```js
// 验证括号

[..."(())()(()())"].reduce((a,i)=> i==='('?a+1:a-1,0);
// 0

[..."((())()(()())"].reduce((a,i)=> i==='('?a+1:a-1,0);
// 1

[..."(())()(()()))"].reduce((a,i)=> i==='('?a+1:a-1,0);
// -1
```

```js
// 按属性分组
let obj = [
  {name: 'Alice', job: 'Data Analyst', country: 'AU'},
  {name: 'Bob', job: 'Pilot', country: 'US'},
  {name: 'Lewis', job: 'Pilot', country: 'US'},
  {name: 'Karen', job: 'Software Eng', country: 'CA'},
  {name: 'Jona', job: 'Painter', country: 'CA'},
  {name: 'Jeremy', job: 'Artist', country: 'SP'},
]
let ppl = obj.reduce((group, curP) => {
  let newkey = curP['country']
  if(!group[newkey]){
    group[newkey]=[]
  }
  group[newkey].push(curP)
  return group
}, [])
// 根据 country 对第一个对象数组进行分组，在每次迭代中，我们检查键是否存在，如果不存在，我们创建一个数组，然后将当前的对象添加到该数组中，并返回组数组。
// 可以用它做一个函数，用一个指定的键来分组对象。
```

```js
// 扁平数组
let flattened = [[3, 4, 5], [2, 5, 3], [4, 5, 6]].reduce(
  (singleArr, nextArray) => singleArr.concat(nextArray), [])

// 结果：[3, 4, 5, 2, 5, 3, 4, 5, 6]

// 一个预定的方法是使用.flat方法，它将做同样的事情
[ [3, 4, 5],
  [2, 5, 3],
  [4, 5, 6]
].flat();
```

```js
// 只有幂的正数
[-3, 4, 7, 2, 4].reduce((acc, cur) => {
  if (cur> 0) {
    let R = cur**2;
    acc.push(R);
  }
  return acc;
}, []);

// 结果
[16, 49, 4, 144]
```

```js
// 反转字符串
const reverseStr = str=>[...str].reduce((a,v)=>v+a)
```

```js
// 二进制转十进制
const bin2dec = str=>[...String(str)].reduce((acc,cur)=>+cur+acc*2,0)

// 等价于

const bin2dec = (str) => {
  return [...String(str)].reduce((acc,cur)=>{
    return +cur+acc*2
  },0)
}
```

