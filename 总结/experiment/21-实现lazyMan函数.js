class _LazyMan {
    constructor(name) {
      this.tasks = []
      const task = () => {
        console.log(`Hi! This is ${name}`)
        this.next()
      }
      this.tasks.push(task)
      setTimeout(() => {
        this.next()
      }, 0)
    }
    next() {
      const task = this.tasks.shift()
      task && task()
    }
    sleep(time) {
      this.sleepWrapper(time, false)
      return this
    }
    sleepFirst(time) {
      this.sleepWrapper(time, true)
      return this
    }
    sleepWrapper(time, first) {
      const task = () => {
        setTimeout(() => {
          console.log(`Wake up after ${time}`)
          this.next()
        }, time * 1000)
      }
      if (first) {
        this.tasks.unshift(task)
      } else {
        this.tasks.push(task)
      }
    }
    eat(food) {
      const task = () => {
        console.log(`Eat ${food}`);
        this.next();
      };
      this.tasks.push(task);
      return this;
    }
  }
  
  // 测试
  const lazyMan = (name) => new _LazyMan(name)
  
  lazyMan('Hank').sleep(1).eat('dinner')
  
  lazyMan('Hank').eat('dinner').eat('supper')
  
  lazyMan('Hank').eat('supper').sleepFirst(5)