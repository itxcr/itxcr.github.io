class DateUtil {
    static formDate() {
        console.log('格式化代码 DateUtil')
    }
    static diffDateByDay() {}
    static diffDateByHour() {}
    static timeConversion(restTime: number) {}
}
// DateUtil.timeConversion(+new Date())


// 单例模式
// class DateUtil1 {
//     // 立即创建单例模式
//     static dateUtil = new DateUtil1()
//     private constructor() {
//         console.log('111111')
//     }
//     formDate() {
//         console.log('格式化日期')
//     }
//     diffDateByDay() {}
//     diffDateByHour() {}
//     timeConversion(restTime: number) {}
// }

// console.log('222222')
// const dateUtil1 = DateUtil1.dateUtil
// const dateUtil2 = DateUtil1.dateUtil
// const dateUtil3 = DateUtil1.dateUtil
// const dateUtil4 = DateUtil1.dateUtil
// const dateUtil5 = DateUtil1.dateUtil
// console.log(dateUtil1 === dateUtil2)
// dateUtil1.formDate()



class DateUtil2 {
    // 立即创建单例模式
    static dateUtil: any = null
    static getInstance() {
        if (this.dateUtil === null) {
            this.dateUtil = new DateUtil2()
        }
        return this.dateUtil
    }
    private constructor() {
        console.log('111111')
    }
    formDate() {
        console.log('格式化日期')
    }
    diffDateByDay() {}
    diffDateByHour() {}
    timeConversion(restTime: number) {}
}

console.log('22222222222')
const date1 = DateUtil2.getInstance()
date1.formDate()
// const date2 = DateUtil2.getInstance()
// const date3 = DateUtil2.getInstance()
// const date4 = DateUtil2.getInstance()
// const date5 = DateUtil2.getInstance()
// console.log(date1 === date2)
// date5.formDate()


export {
    // DateUtil,
    // dateUtil1
}


