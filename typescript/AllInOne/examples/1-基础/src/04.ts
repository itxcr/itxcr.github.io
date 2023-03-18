// 根类型可赋值 null 和 undefined 除外的任意数值
let data:Object= new Set([['a', 1], 2, 3, 4, 5])
// {} 为 Object 类型的简写
let data2:{}= new Set([['a', 1], 2, 3, 4, 5])

let data3:object = {name: 'xcr'}

// 联合类型
let str: string | number | boolean | object = '123'
str = {name : 'xcr'}
// console.log(str)

// 交叉类型
type Obj1={name:string}
type Obj2={age:number}
let obj1:Obj1 = {name: 'xcr'}
let obj2:Obj2 = {age: 23}
let obj3: Obj1 & Obj2 = {name: 'test', age: 18}



type A=number | string
let a:A='123'
type num=number
let b:num = 123
export {}

type num1 = 1 |2 |3
let c:num1 = 2


type check = 0 | 1 |true | false
function isTrue(type:check) {
    if (type) {
        console.log('yes')
    }else {
        console.log('close')
    }
}
// isTrue(1)


// 数字枚举
// enum Week {
//     Monday = 1,
//     Tuesday,
//     Wednesday,
//     Thursday,
//     Friday,
//     Saturday,
//     Sunday
// }
//
// console.log(Week.Friday)
// console.log(Week['Friday'])
// console.log(Week[1])
//
//
// // 字符串枚举
// enum WeekENd {
//     Monday = 'monday',
//     Tuesday = 'tuesday',
//     Wednesday = 'wednesday',
//     Thursday = 'thursday',
//     Friday = 'friday',
//     'Saturday' = 'saturday',
//     'Sunday' = 'sunday'
// }
//
// console.log(WeekENd.Monday)
// console.log(WeekENd['Monday'])

// 数字类型枚举底层
// var Week;
// (function (Week) {
//     Week[Week["Monday"] = 1] = "Monday";
//     Week[Week["Tuesday"] = 2] = "Tuesday";
//     Week[Week["Wednesday"] = 3] = "Wednesday";
//     Week[Week["Thursday"] = 4] = "Thursday";
//     Week[Week["Friday"] = 5] = "Friday";
//     Week[Week["Saturday"] = 6] = "Saturday";
//     Week[Week["Sunday"] = 7] = "Sunday";
// })(Week || (Week = {}));
//
// // 字符串类型枚举底层
// var WeekENd;
// (function (WeekENd) {
//     WeekENd["Monday"] = "monday";
//     WeekENd["Tuesday"] = "tuesday";
//     WeekENd["Wednesday"] = "wednesday";
//     WeekENd["Thursday"] = "thursday";
//     WeekENd["Friday"] = "friday";
//     WeekENd["Saturday"] = "saturday";
//     WeekENd["Sunday"] = "sunday";
// })(WeekENd || (WeekENd = {}));


// enum EnumAuditStatus {
//     MANAGER_AUDIT_FAIL = -1,
//     NO_AUDIT,
//     MANAGER_AUDIT_SUCCESS,
//     FINAL_AUDIT_SUCCESS
// }
//
//
// type Expense = {
//     id: number,
//     events: string,
//     time: Date,
//     enumAuditStatus: EnumAuditStatus
// }

// class MyAudit {
//     getAuditStatus(status: EnumAuditStatus):void {
//         if (status === EnumAuditStatus.NO_AUDIT) {
//             console.log('没有审核')
//         }else if (status === EnumAuditStatus.MANAGER_AUDIT_SUCCESS) {
//             console.log('经理审核通过')
//             const result:Expense = {
//                 id: 1,
//                 events: '测试审核',
//                 time: new Date(),
//                 enumAuditStatus: EnumAuditStatus.MANAGER_AUDIT_SUCCESS
//             }
//             console.log(result)
//         }else if (status === EnumAuditStatus.FINAL_AUDIT_SUCCESS) {
//             console.log('财务审核通过')
//         }
//     }
// }
//
// const test = new MyAudit()
// test.getAuditStatus(EnumAuditStatus.MANAGER_AUDIT_SUCCESS)



// let test1:any = ['a', 'b']
// let num:number =test1
// console.log(num)


// Vue3的 自定义守卫使用 any
export function isRef(r: any): r is Ref{
    return Boolean(r && r.__v_isRef === true) // any 类型的 r 参数 在函数内部获取属性
}


// Vue3 的 ref 的 unknown 参数
function ref(value?: unknown) {
    return createRef(value) // 函数内部只用于再次传递值，不获取属性
}

export {}



