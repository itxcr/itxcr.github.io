nestjs 设置不生产 spec

```json
// nest-cli.json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "generateOptions": {
    "spec": false
  }
}
```

## 控制器

控制器负责处理传入的请求和向客户端返回响应。

![](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202110051519063.png)

### 路由

使用 @Controller 装饰器定义一个基本的控制器。路由的路径前缀可自定义。自定义路由前缀可使我们轻松对一组相关的路由进行分组，并最大程度地减少重复代码。

```ts
@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return '设置前缀为 cats'
  }
}
```

此函数将返回 `200` 状态代码和相关的响应，在本例中只返回了一个字符串。

Nest 使用两种不同的操作响应选项的概念：

|              |                                                              |
| ------------ | :----------------------------------------------------------- |
| 标准（推荐） | 使用这个内置方法，当请求处理程序返回一个 `JavaScript` 对象或数组时，它将自动序列化为 `JSON`。但是，当它返回一个 `JavaScript` 基本类型（例如`string、number、boolean`）时， Nest 将只发送值，而不尝试序列化它。这使响应处理变得简单：只需要返回值，其余的由 Nest 负责。 |
| 类库特有的   | 我们可以在函数签名处通过 `@Res()` 注入类库特定的响应对象（例如， `Express`）。使用此方法，你就能使用由该响应对象暴露的原生响应处理函数。例如，使用 `Express`，您可以使用 `response.status(200).send()` 构建响应 |

### Request

Nest 提供了对底层平台（默认为 `Express`）的[**请求对象**](http://expressjs.com/en/api.html#req)（`request`）的访问方式。我们可以在处理函数的签名中使用 `@Req()` 装饰器，指示 Nest 将请求对象注入处理程序。

可以使用专用的装饰器，比如开箱即用的 `@Body()` 或 `@Query()` 。 下面是 Nest 提供的装饰器及其代表的底层平台特定对象的对照列表。

|                           |                                   |
| :------------------------ | :-------------------------------- |
| `@Request()，@Req()`      | `req`                             |
| `@Response()，@Res()*`    | `res`                             |
| `@Next()`                 | `next`                            |
| `@Session()`              | `req.session`                     |
| `@Param(key?: string)`    | `req.params`/`req.params[key]`    |
| `@Body(key?: string)`     | `req.body`/`req.body[key]`        |
| `@Query(key?: string)`    | `req.query`/`req.query[key]`      |
| `@Headers(name?: string)` | `req.headers`/`req.headers[name]` |
| `@Ip()`                   | `req.ip`                          |
| `@HostParam()`            | `req.hosts`                       |

### 数据库表结构设计

![sql](https://cdn.jsdelivr.net/gh/itxcr/oss/images/sql.png)

#### User 用户表

- userId: string
- username: string
- password: string
- avatar: string
- tag: string
- createTime:  number
- role: string

#### User_Group 用户与群的中间表

- _id: number
- userId: string
- groupId: string

#### Group 群表

- groupId: string
- userId: string
- groupName: string
- notice: string
- createTime: number

#### Group_Message 群聊消息表

- _id: number
- userId: string
- groupId: string
- content: string
- time: number

#### User_Friend 用户与好友中间表

- _id: number
- friendId: string
- userId: string

#### Friend_Message 私聊消息表

_id: number

userId: string

friendId: string

content: string

time: number

数据库格式 utf8mb4   排序 utf8mb4_general_ci

### Websocket 的建立逻辑

#### 用户房间的建立

每个用户进入聊天室都会自动加入名为 public 的 Websocket 房间和以用户 id 为命名的 Websocket 房间，其中建立用户房间是为了方便系统针对用户单独广播事件。如果不了解房间的概念，可以认为只有房间内的人才能接收到房间内的广播。

#### 群聊房间的建立

以 groupId 作为 Websocket 房间的名字，每次有新用户加入群都会在群房间内广播用户进群事件并附带上新用户的详细信息，然后其他用户会存储新用户的信息。当心用户发消息的时候，其他用户收到消息后可以通过消息的 userId 找到对应用户的详细信息。这样能保证消息发出后其他用户能够快速知道消息的主人。

#### 私聊房间的建立

每当发起一个添加好友的请求，就会把用户的 userId 和好友的 userId 拼接成的字符串作为 Websocket 的房间名，从而建立私聊房间。

