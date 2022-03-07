// import $ from 'jQuery'
//
// class User {
//   name: string;
//   age: number;
// }
//
// console.log($.ajax)
//
// function getUsers(cb: (users: User[]) => void): void {
//   $.ajax({
//     url: 'api/users',
//     method: 'GET',
//     success: function (data) {
//       cb(data.items)
//     },
//     error: function (error) {
//       cb(null)
//     }
//   })
// }
//
// interface LoggerInterface {
//   log(arg: any): void
// }
//
// class Logger implements LoggerInterface {
//   log(arg) {
//     if (typeof console.log === 'function') {
//       console.log(arg)
//     } else {
//       alert(arg)
//     }
//   }
// }
//
// interface UserInterface {
//   name: string,
//   password: string
// }
//
// let user: UserInterface = {
//   name: '',
//   password: '' // '{ name: string; pasword: string; }' is not assignable to type 'UserInterface'
// }

// namespace Geometry {
//   interface VectorInterface {
//   }
//
//   export interface Vector2dInterface {
//   }
//
//   export interface Vector3dInterface {
//   }
//
//   export class Vector2d implements VectorInterface, Vector2dInterface {
//   }
//
//   export class Vector3d implements VectorInterface, Vector3dInterface {
//   }
// }
// const vector2dInstance: Geometry.Vector2dInterface = new Geometry.Vector2d()
// const vector3dInstance: Geometry.Vector3dInterface = new Geometry.Vector3d()

module Geometry {
  export interface Vector2dInterface {
    toArray(callback: (x: number[]) => void): void

    length(): number

    normalize()
  }

  export class Vector2d implements Vector2dInterface {
    private _x: number
    private _y: number

    constructor(x: number, y: number) {
      this._x = x
      this._y = y
    }

    toArray(callback: (x: number[]) => void): void {
      callback([this._x, this._y])
    }

    length(): number {
      return Math.sqrt(this._x * this._x + this._y * this._y)
    }

    normalize() {
      let len = 1 / this.length()
      this._x *= len
      this._y *= len
      return {a: this._x, b: this._y}
    }
  }
}

const vector: Geometry.Vector2dInterface = new Geometry.Vector2d(2, 3)
vector.normalize()
vector.toArray((vectorAsArray: number[]) => {
  console.log(vectorAsArray)
})
