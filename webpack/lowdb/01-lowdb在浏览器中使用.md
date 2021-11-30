### lowdb和lodash一起在浏览器使用

```js
import {LocalStorage, LowSync} from 'lowdb/lib'
import lodash from 'lodash'
export class DB{
  static initDB(dbName) {
    const adapter = new LocalStorage(dbName)
    const db = new LowSync(adapter)
    db.read()
    db.chain = lodash.chain(db.data)
    return db
  }
}
```



```js
const db = DB.initDB('test')
// 设置data属性
db.data = {}
// 初始化数据
db.data.post = [{id: 1, title: 'xcr'}, {id: 2, title: 'test'}]
// 存入数据库
db.write()
// 获取数据库数据 可使用lodash查询方法
const post = db.chain.get('post').value()
```

# LOCALFORAGE离线存储

