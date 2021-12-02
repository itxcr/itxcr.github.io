## 状态模式和策略模式

XState是状态管理工具，应对程序中状态变化切换行为的需求，是一个状态机的实现，理解状态机有必要先理解一下状态模式，说到状态模式不得不提一下策略模式，因为它们太像了，是行为设计模式中的一对亲兄弟，下面是对应的类图：

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112021140277.webp)

状态模式和策略模式有一些显著特征便于理解和区别

- 特征：
  - 策略对应行为，每一个行为都需要一种策略；
  - 策略和对象对应，不能自己更换；
  - 状态决定行为，状态绑定一个或一组行为；
  - 对象可以自己变换状态；
  - 不必过多关注行为，只需要关注状态；
  - 状态模式：
  - 策略模式：
- 区别：
  - 应用场景更偏向于有明显继承关系但行为复杂的情形，即用组合代替继承；
  - 应用场景更偏向于有明显状态流转的情形，比如红绿灯、开关、ATM机等；
  - 状态模式下，不同的状态由子类实现，通过状态注入Context，可以自行切换；
  - 策略模式下，不同的行为由子类实现，通过行为注入Context，不能自行切换；
- 联系：
  - 都是行为类设计模式的实现，都是为了处理多种情形的场景，都符合对扩展开放，对修改关闭的原则；
  - 实际上，状态模式可以看成是策略模式的进阶，策略模式更具有一般性；
- 状态模式的优点：
  - 扩展开放，修改关闭，便于维护和新增状态；
  - 行为逻辑被分散到子类中，Context中的请求动作和状态类不干扰；
- 状态模式的缺点：
  - 多了很多状态类，增加了开销；
  - 行为逻辑分散到了多个状态类中；

## 状态机

> 释义

- 一般指的是有限状态机（Finite State Machine，FSM），又可以称为有限状态自动机（Finite State Automation，FSA），简称状态机，它是一个数学模型，表示有限个状态以及在这些状态之间的转移和动作；

> ### 疑惑

- 有没有无限状态机呢？
- - 这个问题其实和永动机的答案是一样的，属于只有理论意义但不存在的模型；
  - 状态机的实质就是确定的输入和状态可以得到确定的输出，按照定义需要首先收集所有状态，而无限状态机在这个步骤就已经不满足了；
  - 关于无限状态机的更多可以了解：图灵机、下推自动机等

> ### 模型

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112021646638.webp)![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112021646330.webp)

> ### 应用

- 最直接的实现就是针对有限状态机定义封装的状态机函数库，比如**[JavaScript-State-Machine](https://github.com/jakesgordon/javascript-state-machine)**、**[Xstate](https://github.com/jakesgordon/javascript-state-machine)**等
- 广义的应用还有状态管理相关的各种函数库，一般会把状态管理单独抽取出来维护，并且和行为解耦，但是实际上仍然是状态模式的体现，只不过需要人为的收集所有的状态以及绑定行为，但是实际上仍然是一个状态对应一个行为，比如**[Redux](https://redux.js.org/)**、**[Vuex](https://vuex.vuejs.org/)**等；
- 状态机也是对现实世界的抽象，现实世界的大多数场景都可以通过状态机来解释和模拟
  - 状态：{清醒，睡着}
  - 事件：{躺下闭眼，起来睁眼}
  - 动作：执行某个变换
  - 变换：{清醒=>睡着，睡着=>清醒}
  - 比如睡觉这个事情：（比较理想，实际情况可能会细分更多的状态和输入）
- 延伸
  - 作为一个数学模型，状态机体现的是规则，只要制定好了规则，就可以驱动状态机执行，听起来是一个很计算机的概念，是的，计算机设计中的很多产物都和状态机相关，有兴趣的可以继续了解**[从有限状态机、图灵机到现代计算机](https://blog.csdn.net/chenchao868/article/details/6833612)**；
  - 编译原理中经常会用到状态机的概念，在词法分析阶段根据不同的输入确定不同的行为，诸如此类，在程序设计中十分常见；
  - 触发器也是很明显的状态模式的应用；
  - Promise；

## 状态图

- 状态机的图形展示方式，类似于UML图，是一种图形语言，有自己的语法，幸运的是，XState提供了状态图的在线生成演示功能；

# XState

## 简介

XState是一个比较标准的有限状态机的实现，并可以通过图形化的方式转换为状态图的形式；

**优势**

- 有限状态
- 状态转移规则（状态过渡）
- 状态对应（绑定）行为
- 可以实现复杂嵌套
- 提供图形化界面

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112021652469.webp)

## 对比

XState是一个状态管理库，Redux、Vuex之类，也被称为状态管理库，但是他们之间的区别还是较大的，这里以Redux为例，与XState做一个简单的比较；

> ### 目标&定位

- Redux的定位是应用的数据容器，致力于维护状态，主要解决组件通信、状态共享的问题；
- XState更加关注于状态，致力于状态驱动，但是也可以实现组件通信和状态共享的功能；

> ### 功能

- Redux和XState中的状态的含义稍有不同，显然Redux的状态含义更广一些，包括所有应用数据都可以称之为“状态”，而XState中的状态则狭义一些，专指特殊定义的状态；
- Redux作为数据容器，维护公共的上下文数据，便于组件通信和状态共享，这也是使用Redux的初衷，上下文数据并没有特殊的状态，只有一个store或者state，虽然可以根据需要指定某些变量作为特殊的变量--状态；
- XState致力于状态驱动，显式区分了状态变量和上下文数据，需要同时声明context和state；

> ### 状态维护

- Redux对状态，即共享变量的维护是随意的，即便是指定的状态，因为没有规则约束变量的可变范围，总结一下就是--“状态修改”，当然，如果定义了枚举类型作为状态；
- XState对状态的修改可以称为“状态过渡”或者“状态流转”，从状态流转的说法中可以自然的品出，状态是有限的且事先定义好的，这样才能用流转这个词来形容，这也符合有限状态机的定义；

> ### 上下文内容修改

- Redux的存储的本身就是上下文信息，Redux通过dispatch的方式来修改store中的内容，但dispatch并非state触发，当然，可以自行绑定触发逻辑让dispatch随state变化触发；
- XState通过定义在state中的action来更新内容，达到对应的state会触发绑定的或者定义的actions；

> ### 组件间通信

- 组件间通信主要是为了共享；
- Redux自身就是为了解决组件间通信的问题，有自身的通信机制；
- XState自身没有没有组件间通信的功能，但是可以接入第三方，比如React的context实现（通过XState的context来初始化React的context，实现共享）；

> ### 代码组织

- Redux+React在较少的共享变量时自由精简，但是因为逻辑需要自行组织且分布在不同位置，当store变大的时候，状态管理和行为逻辑的代码往往会变得混乱，难于维护；
- XSate则相反，即便只有一个状态也需要写模板代码，代码开销较大，但是状态变多之后仍然具有较好的逻辑性，且便于扩展和维护；

> ### 逻辑可视化

- XState可以将machine声明复制到**[xstate.js.org/viz/]( https://link.juejin.cn/?target=https://xstate.js.org/viz/)** 生成状态图查看；
- Redux可以在控制台看到状态树和Action的触发，但是状态对应的逻辑不能可视化；

> ### 总结

- Redux能干的事，XState也能干，但是需要自行扩展，比如接入React.context；
- XState能干的事，Redux却不行，当然这也不是绝对（从零搭建一个状态机逻辑）；
- 没必要纠结，本来就不是做一件事的工具，按需使用就好；

## 优缺点

- 优点
  - 扩展性，模板代码，逻辑集中，对于扩充状态节点和对应的行为比较友好；
  - 通用性，XState定义的状态机和应用有一定程度的解耦，可以切换应用在不同的组件中；
  - 逻辑性，XState定义的状态机对状态和行为都具有约束，状态流转的规则是确定，状态和行为的对应关系也是确定的，因此当前状态的下一个状态及行为都是可预测和观测的；
  - 可视性，确定的状态机就有唯一的状态图，通过状态图可以确认当前应用的逻辑是否符合预期，或者说，可以首先按照需求确定状态图，按照状态图开发，降低风险；
  - 方便使用路径算法进行自动化测试；
- 缺点
  - 学习成本较高，国内缺乏教程和最佳实践，但是有很好的官方文档（英文）；
  - 提前关注逻辑，完成状态图并确保符合预期，这部分投入较高，存在思维转换的过程；
  - 状态和上下文需要分开关注，同样需要转换思维，将状态分离出来；
  - 状态不能无限扩充（本来就是有限状态机），需要适当拆分（XState本身就是可嵌套的过程）；

## 实例

XState定位为一个通用的工具，官方给出了在不同的语言框架中的使用示例，这里从基本的状态机开始，给出一些简单实例；

> ### 简单的状态机

```js
import { createMachine, interpret } from 'xstate';
const lightMachine = createMachine({
    initial:'red',
    states: {
        red: {
            on:{
                click:'green',
            }
        },
        green: {
            on:{
                press:'yellow',
            }
        },
        yellow: {
            on:{
                keyup:'red',
            }
        },
    },
});
//获取初试状态
const state0 = lightMachine.initialState;
console.log(state0);
//通过transition函数切换状态，第一个参数为原状态，第二个参数为自定义操作
const state1 = lightMachine.transition(state0, 'click');
console.log(state1);
const state2 = lightMachine.transition(state1, 'press');
console.log(state2);
const state3 = lightMachine.transition(state2, 'keyup');
console.log(state3);
```

- 通过createMachine函数可以创建一个状态机，并将其赋值给lightMachine；
- lightMachine持有状态机实例，有很多属性和方法；
- - 原状态 + 对应的操作 => 新状态；
- 如果原状态和对应的操作不匹配，不报错但切换不生效，返回值仍为原状态；
  - - lightMachine.initialState可以获取初始化状态；
  - lightMachine.transition(arg1, arg2)可以手动切换状态，入参为原状态和状态对应的操作，返回值为新状态；

```js
const state0 = lightMachine.initialState; 
const state1 = lightMachine.transition(state0, 'click'); 
console.log('state1',state1); 
const state2 = lightMachine.transition(state1, 'click'); 
console.log('state2',state2); 
```

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112021656587.webp)

- 通过initialState或者或者transition返回值持有的状态实例也有很多属性方法
- - state.value 可以获取状态的value；
  - state.matches(arg)可以检查状态值，入参为状态的value，匹配则返回true，否则为false，可以用于判断当前状态，等于state.value === arg；
  - state.nextEvents可以列举状态的可触发操作，比如red的click；

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112021656034.webp)

虽然通过machine可以创建状态机，并配合一些api和property可以使用，但是却有很多不方便，最关键的缺少一个管理者的角色，最直接的问题，如何获得当前状态呢？

> ### 接入服务

XState提供了Interpret来创建服务作为状态机的管理者角色

```js
import { createMachine, interpret } from 'xstate'; 
const lightMachine = createMachine({ 
    initial:'red', 
    states: { 
        red: { 
            on:{ 
                click:'green', 
            } 
        }, 
        green: { 
            on:{ 
                press:'yellow', 
            } 
        }, 
        yellow: { 
            on:{ 
                keyup:'red', 
            } 
        }, 
    }, 
}); 
//包装服务 
const service  = interpret(lightMachine); 
//启动服务 
service.start(); 
//通过send切换状态，相当于lightMachine.transition函数 
service.send('click'); 
//获取当前状态 
console.log('service.state',service.state) 
service.send('press'); 
console.log('service.state',service.state) 
console.log('state.value',service.state.value); 
console.log('matches green',service.state.matches('green',)); 
console.log('state.nextEvents',service.state.nextEvents); 
service.stop(); 
```

- 通过interpret函数创建服务，返回值为interpret实例

- - 从管理者角度提供了一些api和property，比如启动和停止；
  - service.state可以获得当前状态，从下图可以看出，state实例和没有interpret时候没有区别；

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112021657238.webp)

- service.send(arg)提供了状态转换功能，替代了lightMachine.transition；

这样一个简单的machine好像做不了什么，和Redux相比，基本的上下文数据都没有，别急。。。

> ### 接入上下文和行为

```js
import { createMachine, interpret, assign} from 'xstate'; 
const lightMachine = createMachine({ 
    id:'lightMachine', 
    initial:'red', 
    context:{ 
        redCount: 0, 
        greenCount: 0, 
        yellowCount: 0, 
    }, 
    states: { 
        red: { 
            //退出action 
            exit: assign({ redCount: (ctx) => ctx.redCount + 1 }), 
            on:{ 
                click:'green', 
            } 
        }, 
        green: { 
            on:{ 
                press:{ 
                    target:'yellow', 
                    actions: assign({ greenCount: (ctx) => ctx.greenCount + 1 }),//单个action 
                }, 
            }, 
        }, 
        yellow: { 
            //进入action 
            entry: assign({ yellowCount: (ctx) => ctx.yellowCount + 1 }), 
            on:{ 
                keyup:{ 
                    target:'red', 
                    actions: ['countAction','doSomething'],//actions数组 
                }, 
            } 
        }, 
    }, 
},{ 
    actions:{ 
        countAction: assign({ count: (ctx) => ctx.greenCount + ctx.redCount + ctx.yellowCount}), 
        doSomething: () => console.log("为所欲为"), 
    } 
}); 
 
 
//包装服务 
const service  = interpret(lightMachine); 
//启动服务 
service.start(); 
//获取当前上下文数据 
console.log('service.state.context',service.state.value,service.state.context) 
service.send('click'); 
console.log('service.state.context',service.state.value,service.state.context) 
service.send('press'); 
console.log('service.state.context',service.state.value,service.state.context) 
service.send('keyup'); 
console.log('service.state.context',service.state.value,service.state.context) 
service.stop(); 
```

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112021658184.webp)

- context是状态机声明的，与states同级，因此所有状态共享，context更接近Redux的store；

- XState的行为实际就是Side Effect，可以最大限度的为XState赋能，Effect的类型较多，适用于不同的场景，具体使用可以参考官方文档，本文介绍Action的用法，Activities类似，Promise等则有自己的规则；

- - 没有返回数据的Effect **点击跳转**[7]

  - - Actions 单次执行的，最常用
    - Activities 连续执行的，可将setInterval封装其内

  - 有返回数据的Effect **点击跳转**[8]

  - - Invoked Promises
    - Invoked Callbacks
    - Invoked Observables
    - invoked Machines

- Action通过在state中新增actions来添加

```js
green: { 
       on:{ 
           press:{ 
               target:'yellow', 
               actions: assign({ greenCount: (ctx) => ctx.greenCount + 1 }), 
                }, 
            }, 
        }, 
```

```js
green: { 
        on:{ 
            press:'yellow', 
        } 
        }, 
```

- 对比可以发现，之前的state为缩略写法；
- actions的执行时机是状态转换之后，可以直接在actions后面写函数，也可以通过配置的方式传入actions字符串或者数组来执行

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112021659758.webp)

- - 有两个特殊的action，与一般的action区别在于触发的时机不同

  - - entry：在进入状态时候触发
    - exit：在离开状态时候触发

  - action本身就是一个function，接收三個参数分別是context, event 以及 actionMeta，context 就是当前machine的context，event 则是触发当前状态切换的事件，actionMeta则存放当前的state 以及action。

- 上面代码出现率很高的还有assign函数，用来修改context，用法与React的setState类似；

> ### 接入React/Vue3

- React Hook和Vue3接入XState类似，都是封装成useMachine方式调用，下面以React为例说明；

```js
import "./styles.css"; 
import * as React from "react"; 
import * as ReactDOM from "react-dom"; 
import { createMachine, assign } from "xstate"; 
import { useMachine } from "@xstate/react"; 
interface ToggleContext { 
  count: number; 
} 
const toggleMachine = createMachine<ToggleContext>({ 
  id: "toggle", 
  initial: "inactive", 
  context: { 
    count: 0 
  }, 
  states: { 
    inactive: { 
      on: { TOGGLE: "active" } 
    }, 
    active: { 
      entry: assign({ count: (ctx) => ctx.count + 1 }), 
      on: { TOGGLE: "inactive" } 
    } 
  } 
}); 
function App() { 
  const [current, send] = useMachine(toggleMachine); 
  const active = current.matches("active"); 
  const { count } = current.context; 
  return ( 
    <div className="App"> 
      <h1>XState React Template</h1> 
      <h2>Fork this template!</h2> 
      <button onClick={() => send("TOGGLE")}> 
        Click me ({active ? "yes" : "no"}) 
      </button>{" "} 
      <code> 
        Toggled <strong>{count}</strong> times 
      </code> 
    </div> 
  ); 
} 
const rootElement = document.getElementById("root"); 
ReactDOM.render(<App />, rootElement); 
```

- 状态机声明方式和之前无异，但是interpret被封装成了useMachine，这一点Vue3也是类似的，同时暴露出当前状态和send方法；
- - [state, send, service] = useMachine(machine, options?)
  - - options：guards, actions, services, delays, immediate, context, state
    - state：当前的状态
    - send：向正在运行的服务发送事件的函数
    - service - 创建的服务

> ### 接入Promise

```js
import { createMachine, interpret, assign } from 'xstate'; 
const fetchMachine = createMachine({ 
  id: 'Dog API', 
  initial: 'idle', 
  context: { 
    dog: null 
  }, 
  states: { 
    idle: { 
      on: { 
        FETCH: 'loading' 
      } 
    }, 
    loading: { 
      invoke: { 
        id: 'fetchDog', 
        src: (context, event) => 
          fetch('https://dog.ceo/api/breeds/image/random').then((data) => 
            data.json() 
          ), 
        onDone: { 
          target: 'resolved', 
          actions: assign({ 
            dog: (_, event) => event.data 
          }) 
        }, 
        onError: 'rejected' 
      }, 
      on: { 
        CANCEL: 'idle' 
      } 
    }, 
    resolved: { 
      type: 'final' 
    }, 
    rejected: { 
      on: { 
        FETCH: 'loading' 
      } 
    } 
  } 
}); 
const dogService = interpret(fetchMachine) 
  .onTransition((state) => console.log(state.value)) 
  .start(); 
dogService.send('FETCH'); 
```

- Promise自身就是一个状态机的实现范例，因此Promise接入XState较为容易；
- 上面的状态机稍复杂，是一个嵌套的的状态机，这也符合Promise的运行机制，具体逻辑可以由StateCharts显示；

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202112021700406.webp)

## 总结

- XState是一个比较纯粹的有限状态机的实现，状态驱动的思维和Redux等库还是很不同的，上文也提到过：“XState可以手动扩展来实现Redux的功能，而Redux则不能”；

- XState仍处在高速发展期，国内实践较少，教程和最佳实践都比较缺乏，学习成本较大，需要依靠官网摸索；虽然XState仍在不断更新中，但是状态机的模型是确定的，因此应该不会有特别革命性的变更；

- 状态机的思维有些抽象，模板代码写起来也比较庞大，在具体实践中可能会遇到一些问题或者疑惑

- - 对于明显适合状态机的场景，比如红绿灯、点赞等，有一种杀鸡用牛刀的感觉；
  - 对于复杂的场景，需要较大的精力将状态机抽象出来，这里可能是多层嵌套的状态机，基本上需要完全理清系统的逻辑，实际做起来难度较大；

- XState的一个突出的作用是可以帮助开发者理清逻辑，尤其对于复杂的系统，一个设计完备的状态机一定是可以通过状态图展示的，这是一个充分必要条件，换句话说，如果设计好的状态机不能转化为状态图，那就是设计逻辑出现了问题，这一点可以帮助开发者在开发初期就理清逻辑，将系统流程走通；
