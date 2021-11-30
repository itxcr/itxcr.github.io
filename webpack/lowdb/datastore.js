import {LocalStorage, LowSync} from 'lowdb/lib'
import lodash from 'lodash'

export class DB {
  static _db = null

  static setDB(dbName) {
    if (DB._db !== null) {
      return DB._db
    }
    return DB._db = this.initDB(dbName)
  }

  static initDB(dbName) {
    const adapter = new LocalStorage(dbName)
    const db = new LowSync(adapter)
    db.read()
    db.chain = lodash.chain(db.data)
    return db
  }

  static getDB(dbName) {
    return DB.setDB(dbName)
  }
}
