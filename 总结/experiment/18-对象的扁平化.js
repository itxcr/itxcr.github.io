const obj = {
    a: {
           b: 1,
           c: 2,
           d: {e: 5}
       },
    b: [1, 3, {a: 2, b: 3}],
    c: 3
   }
   
   // {
   //  'a.b': 1,
   //  'a.c': 2,
   //  'a.d.e': 5,
   //  'b[0]': 1,
   //  'b[1]': 3,
   //  'b[2].a': 2,
   //  'b[2].b': 3
   //   c: 3
   // }

const isObject = (val) =>  typeof val === "object" && val !== null

function flatten(obj) {
  if (!isObject(obj)) return
  const res = {}
  const dfs = (cur, prefix) => {
    if (isObject(cur)) {
      if (Array.isArray(cur)) {
        cur.forEach((item, index) => {
          dfs(item, `${prefix}[${index}]`)
        })
      } else {
        for(let key in cur) {
          dfs(cur[key], `${prefix}${prefix ? '.' : ''}${key}`)
        }
      }
    } else {
      res[prefix] = cur
    }
  }
  dfs(obj, '')
  return res
}

// 测试
console.log(flatten(obj))