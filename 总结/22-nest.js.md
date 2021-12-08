# Nest.js

Nest (NestJS) 是一个用于构建高效、可扩展的 `Node.js` 服务器端应用程序的开发框架。它利用`JavaScript` 的渐进增强的能力，使用并完全支持 `TypeScript` （仍然允许开发者使用纯 JavaScript 进行开发），并结合了 OOP （面向对象编程）、FP （函数式编程）和 FRP （函数响应式编程）。

在底层，Nest 构建在强大的 HTTP 服务器框架上，例如 Express （默认），并且还可以通过配置从而使用 Fastify ！

Nest 在这些常见的 Node.js 框架 (Express/Fastify) 之上提高了一个抽象级别，但仍然向开发者直接暴露了底层框架的 API。这使得开发者可以自由地使用适用于底层平台的无数的第三方模块。

- 原生支持TypeScript的框架
- 可以基于`Express`也可以选择`fastify`, 如果你对`Express`非常熟练， 直接用它的API也是没问题的

## 设置nestjs 设置不生成 spec

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

## 项目创建

```bash
npm i -g @nestjs/cli  // 全局安装Nest
nest new project-name  // 创建项目
```

| `app.controller.ts`      | 单个路由的基本控制器(Controller)                             |
| ------------------------ | ------------------------------------------------------------ |
| `app.controller.spec.ts` | 针对控制器的单元测试                                         |
| `app.module.ts`          | 应用程序的根模块(Module)                                     |
| `app.service.ts`         | 具有单一方法的基本服务(Service)                              |
| `main.ts`                | 应用程序的入口文件，它使用核心函数 `NestFactory` 来创建 Nest 应用程序的实例。 |

### 第一个接口

 首先就是找到入口文件`main.ts`

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

内容比较简单， 使用`Nest.js`的工厂函数`NestFactory`来创建了一个`AppModule`实例，启动了 HTTP 侦听器，以侦听`main.ts` 中所定义的端口。

`Nest.js`创建项目默认就给写了一个接口例子，那就通过这个接口例子来看，我们应该怎么实现一个接口。

前边看到`mian.ts`中也没有别的文件引入， 只有`AppModule`, 打开`src/app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

`AppModule`是应用程序的根模块，根模块提供了用来启动应用的引导机制，可以包含很多功能模块。

`.mudule`文件需要使用一个`@Module()` 装饰器的类，装饰器可以理解成一个封装好的函数，其实是一个语法糖（对装饰器不了解的，可以看走近MidwayJS：初识TS装饰器与IoC机制)。`@Module()` 装饰器接收四个属性：`providers`、`controllers`、`imports`、`exports`。

- providers：`Nest.js`注入器实例化的提供者（服务提供者），处理具体的业务逻辑，各个模块之间可以共享（*注入器的概念后面依赖注入部分会讲解*）；
- controllers：处理http请求，包括路由控制，向客户端返回响应，将具体业务逻辑委托给providers处理；
- imports：导入模块的列表，如果需要使用其他模块的服务，需要通过这里导入；
- exports：导出服务的列表，供其他模块导入使用。如果希望当前模块下的服务可以被其他模块共享，需要在这里配置导出；

`Nest.js`的思维方式一开始确实不容易理解，但假如你接触过`AngularJS`，就会感到熟悉，如果你用过 Java 和 Spring 的话，就可能会想，这不是抄的 Spring boot嘛！

确实`AngularJS`、`Spring`和`Nest.js`都是基于`控制反转`原则设计的,而且都使用了依赖注入的方式来解决解耦问题。

在`app.module.ts`中，看到它引入了`app.controller.ts`和`app.service.ts`，分别看一下这两个文件：

```ts
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

```

使用`@Controller`装饰器来定义控制器, `@Get`是请求方法的装饰器，对`getHello`方法进行修饰， 表示这个方法会被GET请求调用。

```ts
// app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService { 
  getHello(): string {
    return 'Hello World!';
  }
}
```

从上面，我们可以看出使用`@Injectable`修饰后的 `AppService`, 在`AppModule`中注册之后，在`app.controller.ts`中使用，我们就不需要使用`new AppService()`去实例化，直接引入过来就可以用。

## 路由装饰器

`Nest.js`中没有单独配置路由的地方，而是使用装饰器。`Nest.js`中定义了若干的装饰器用于处理路由。

#### @Controller

如每一个要成为控制器的类，都需要借助`@Controller`装饰器的装饰，该装饰器可以传入一个路径参数，作为访问这个控制器的主路径：

对`app.controller.ts`文件进行修改

```ts
// 主路径为 app
@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### HTTP 方法处理装饰器

`@Get`、`@Post`、`@Put`等众多用于HTTP方法处理装饰器，经过它们装饰的方法，可以对相应的HTTP请求进行响应。同时它们可以接受一个字符串或一个字符串数组作为参数，这里的**字符串**可以是固定的路径，也可以是通配符。

继续修改`app.controller.ts`，看下面的例子：

```ts
// 主路径为 app
@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  // 1. 固定路径：
  @Get("list")
  getHello(): string {...}
  
  // 可以匹配到 post请求
  @Post("list")
  create():string{...}
  
  // 2.通配符路径(?+* 三种通配符 )
  // 可以匹配到 get请求
  @Get("user_*")
  getUser(){return "getUser"}
  
  // 3.带参数路径
  // 可以匹配到put请求
  @Put("list/:id")
  update(){ return "update"}
}
```

这里要提一个关于路由匹配时的注意点， 当我们有一个put请求，路径为`/app/list/user`,此时，我们在`app.controller.ts`控制器文件中增加一个方法：

```ts
 @Put("list/user")
 updateUser(){
      return {userId:1}
  }
```

发现`/app/list/user`匹配到的并不是`updateUser`方法， 而是`update`方法。这就是我要说的注意点。

> 如果因为在匹配过程中， 发现`@Put("list/:id")`已经满足了,就不会继续往下匹配了，所以`@Put("list/user")`装饰的方法应该写在它之前。

### 全局路由前缀

除了上面这些装饰器可以设置路由外， 我们还可以设置全局路由前缀， 比如给所有路由都加上`/api`前缀。此时需要修改`main.ts`

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // 设置全局路由前缀
  await app.listen(9080);
}
bootstrap();
```

此时之前的路由，都要变更为：

```bash
http://localhost/api/xxxx
```

## 写项目

写代码之前首先介绍几个`nest-cli`提供的几个有用的命令：

```bash
//语法
nest g [文件类型] [文件名] [文件目录]
```

- 创建模块

> nest g mo posts 创建一个 posts模块，文件目录不写，默认创建和文件名一样的`posts`目录，在`posts`目录下创建一个`posts.module.ts`

```ts
// src/posts/posts.module.ts
import { Module } from '@nestjs/common';

@Module({})
export class PostsModule {}
```

执行完命令后，我们还可以发现同时在根模块`app.module.ts`中引入`PostsModule`这个模块，也在`@Model`装饰器的`inports`中引入了`PostsModule`

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

- 创建控制器

> nest g co posts

此时创建了一个posts控制器，命名为`posts.controller.ts`以及一个该控制器的单元测试文件.

```ts
// src/posts/posts.controller.ts

import { Controller } from '@nestjs/common';

@Controller('posts')
export class PostsController {}
```

执行完命令， 文件`posts.module.ts`中会自动引入`PostsController`,并且在`@Module`装饰器的`controllers`中注入。

- 创建服务类

> nest g service posts

```ts
// src/posts/posts.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {}
```

其实`nest-cli`提供的创建命令还有很多， 比如创建过滤器、拦截器和中间件等

> **注意创建顺序**：先创建`Module`, 再创建`Controller`和`Service`, 这样创建出来的文件在`Module`中自动注册，反之，后创建Module, `Controller`和`Service`,会被注册到外层的`app.module.ts`

## TypeORM 连接数据库

新建数据库 blog

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111301436031.webp)

首先，简单说一下什么是ORM?

我们如果直接使用`Node.js`操作`mysql`提供的接口， 那么编写的代码就比较底层， 例如一个插入数据代码：

```ts
// 向数据库中插入数据 
connection.query(`INSERT INTO posts (title, content) VALUES ('${title}', '${content}')`,
    (err, data) => {
    if (err) { 
    console.error(err) 
    } else {
    console.log(data) 
    }
})
```

考虑到数据库表是一个二维表，包含多行多列，例如一个`posts`的表：

```
mysql> select * from posts;
+----+--------+------------+
| id | title       | content      |
+----+-------------+--------------+
|  1 | Nest.js入门 | 文章内容描述 |
+----+--------+------------+
```

每一行可以用一个JavaScript对象来表示， 比如第一行:

```ts
{
    id: 1,
    title:"Nest.js入门",
    content:"文章内容描述"
}
```

这就是传说中的ORM技术（`Object-Relational Mapping`）,把关系数据库的结构映射到对象上。

所以就出现了`Sequelize`、`typeORM`、`Prisma`这些ORM框架来做这个转换, 我们这里选择`typeORM`来操作数据库。这样我们读写都是JavaScript对象，比如上面的插入语句就可以这样实现：

```ts
await connection.getRepository(Posts).save({title:"Nest.js入门", content:"文章内容描述"});
```

接下来就是真正意义上的使用typeORM操作数据库， 首先我们要安装以下依赖包：

```bash
npm install @nestjs/typeorm typeorm mysql2 -S
```

官方提供了两种连接数据库的方法， 这里分别介绍一下：

**方法1**

首先在项目根目录下创建两个文件`.env`和`.env.prod`，分别存的是开发环境和线上环境不同的环境变量：

```text
// 数据库地址
DB_HOST=localhost  
// 数据库端口
DB_PORT=3306
// 数据库登录名
DB_USER=root
// 数据库登录密码
DB_PASSWD=root
// 数据库名字
DB_DATABASE=blog
```

`.env.prod`中的是上线要用的数据库信息，如果你的项目要上传到线上管理，为了安全性考虑，建议这个文件添加到`.gitignore`中。

接着在根目录下创建一个文件夹`config`(与`src`同级)，然后再创建一个`env.ts`用于根据不同环境读取相应的配置文件。

```ts
import * as fs from 'fs';
import * as path from 'path';
const isProd = process.env.NODE_ENV === 'production';

function parseEnv() {
  const localEnv = path.resolve('.env');
  const prodEnv = path.resolve('.env.prod');

  if (!fs.existsSync(localEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('缺少环境配置文件');
  }

  const filePath = isProd && fs.existsSync(prodEnv) ? prodEnv : localEnv;
  return { path:filePath };
}
export default parseEnv();
```

然后在`app.module.ts`中连接数据库：

```ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig from '../config/env';

@Module({
  imports: [
    ConfigModule.forRoot({ 
    isGlobal: true,  // 设置为全局
    envFilePath: [envConfig.path] 
   }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        entities: [],  // 数据表实体
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'),   // 用户名
        password: configService.get('DB_PASSWORD', 'root'), // 密码
        database: configService.get('DB_DATABASE', 'blog'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
      }),
    }),
    PostsModule,
  ],
 ...
})
export class AppModule {}
```

使用环境变量， 推荐使用官方提供的`@nestjs/config`，开箱即用。简单说明一下

> `@nestjs/config`依赖于dotenv，可以通过key=value形式配置环境变量，项目会默认加载根目录下的.env文件，我们只需在app.module.ts中引入ConfigModule，使用ConfigModule.forRoot()方法即可，然后`ConfigService`读取相关的配置变量。

`TypeORM`提供了多种连接方式，这里再介绍一下使用`ormconfig.json`方式

**方法2**

在根目录下创建一个`ormconfig.json`文件(与`src`同级), 而不是将配置对象传递给`forRoot()`的方式。

```ts
{ 
    "type": "mysql",
    "host": "localhost", 
    "port": 3306, 
    "username": "root", 
    "password": "root", 
    "database": "blog", 
    "entities": ["dist/**/*.entity{.ts,.js}"], 
    "synchronize": true  // 自动载入的模型将同步
}
```

然后在`app.module.ts`中不带任何选项的调用`forRoot()`, 这样就可以了，想了解更多连接数据库的方式可以去有TypeORM官网查看

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({ 
    imports: [TypeOrmModule.forRoot()],
})
export class AppModule {}
```

好了，数据库连接成功， 如果你连接失败， 会有这样的错误信息：

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111292026175.webp)

检查一下自己数据库的配置是否正确。

### CRUD

好了，接下来就进行数据操作，前面我们说通过代码来建表， `TypeORM`是通过实体映射到数据库表，所以我们先建立一个文章实体`PostsEntity`,在`posts`目录下创建`posts.entity.ts`

```ts
//    posts/posts.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("posts")
export class PostsEntity {
    @PrimaryGeneratedColumn()
    id:number; // 标记为主列，值自动生成

    @Column({ length:50 })
    title: string;

    @Column({ length: 20})
    author: string;

    @Column("text")
    content:string;

    @Column({default:''})
    thumb_url: string;

    @Column('tinyint')
    type:number

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    create_time: Date

    @Column({type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
    update_time: Date
}
```

接下来在`posts.service.ts`文件中实现`CRUD`操作的业务逻辑，这里的表并不是最终的文章表，只是为了先实现一下简单的增删改查接口， 后面还会实现复杂的多表关联。

```ts
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';

export interface PostsRo {
  list: PostsEntity[];
  count: number;
}
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
  ) {}

  // 创建文章
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', 401);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', 401);
    }
    return await this.postsRepository.save(post);
  }
  
  // 获取文章列表
  async findAll(query): Promise<PostsRo> {
    const qb = await getRepository(PostsEntity).createQueryBuilder('post');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  // 获取指定文章
  async findById(id): Promise<PostsEntity> {
    return await this.postsRepository.findOne(id);
  }

  // 更新文章
  async updateById(id, post): Promise<PostsEntity> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    const updatePost = this.postsRepository.merge(existPost, post);
    return this.postsRepository.save(updatePost);
  }

  // 刪除文章
  async remove(id) {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, 401);
    }
    return await this.postsRepository.remove(existPost);
  }
}

```

保存文件， 报错信息提示`PostsEntity`没有导入：

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111292026797.webp)

此时在`posts.module.ts`中将`PostsEntity`导入：

```ts
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([PostsEntity])],
  ...
})
```

如果你是按照文章进行，使用第一种方式连接数据库，这里还有一个小坑`找不到PostsEntity实体`：

> No repository for "PostsEntity" was found. Looks like this entity is not registered in current "default" connection?
>
> ![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111292027960.webp)

是由于我们连接数据库时，没有注册它， 所有还需要在`app.module.ts`添加一下：

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111292027479.webp)

然后采用REST风格来实现接口，我们可以在`posts.controller.ts`中设置路由了，处理接口请求，调用相应的服务完成业务逻辑：

```ts
import { PostsService, PostsRo } from './posts.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

@Controller('post')
export class PostsController {
    constructor(private readonly postsService:PostsService){}

    /**
     * 创建文章
     * @param post
     */
    @Post()
    async create(@Body() post){
        return await this.postsService.create(post)
    }

    /**
     * 获取所有文章
     */
    @Get()
    async findAll(@Query() query):Promise<PostsRo>{
        return await this.postsService.findAll(query)
    }

    /**
     * 获取指定文章
     * @param id 
     */
    @Get(':id')
    async findById(@Param('id') id) {
        return await this.postsService.findById(id)
    }

    /**
     * 更新文章
     * @param id 
     * @param post 
     */
    @Put(":id")
    async update(@Param("id") id, @Body() post){
        return await this.postsService.updateById(id, post)
    }

    /**
     * 删除
     * @param id 
     */
    @Delete("id")
    async remove(@Param("id") id){
        return await this.postsService.remove(id)
    }
}
```

### 操作数据库踩过的坑

1. 实体的强替换，莫名其妙的删表，清空数据 以我们上面设置的实体为例：

   ```ts
   export class PostsEntity {
       @PrimaryGeneratedColumn()
       id: number;
   
       @Column()
       title: string;
   }
   ```

   最开初我设计表中`title`字段时，字段类型直接设置成`string`,也就对应数据库类型是`varchar(255)`,后来觉得不合适，对长度进行了限制, 更改为`varchar(50)`,也就是这样修改一下代码：

   ```ts
    @Column({length: 50})
       title: string;
   ```

   保存代码后，结果！我数据库中所以的`title`都被清空了，这个坑真是谁踩谁知道~

2. `entities`的三种设置方式 这个坑前面我们其实算踩了一下， 就是每次创建一个实体， 都要在链接数据库的地方导入，想想都挺鸡肋的。官方倒是给了3种方式，这里都说一下各种方式的坑点：

**方式1：单独定义**

```
TypeOrmModule.forRoot({
  //...
  entities: [PostsEntity, UserEntity],
}),]
```

就是用到哪些实体， 就逐一的在连接数据库时去导入，缺点就是麻烦，很容易忘记~

**方式2：自动加载**

```ts
 TypeOrmModule.forRoot({
  //...
  autoLoadEntities: true,
}),]
```

自动加载我们的实体,每个通过`forFeature()`注册的实体都会自动添加到配置对象的`entities`数组中, `forFeature()`就是在某个`service`中的`imports`里面引入的, 这个是我个人比较推荐的，实际开发我用的也是这种方式。

**方式3:配置路径自动引入 **

```ts
 TypeOrmModule.forRoot({
      //...
      entities: ['dist/**/*.entity{.ts,.js}'],
    }),]
```

通过配置的路径， 自动去导入实体。

这种方式就是前面介绍连接数据库第二种方式中使用的， But~超级不推荐。给你呈现一下我当时踩得坑：

1. 当时写了一个`Category`实体， 然后想增加一个`Tag`实体
2. 复制了`category.entity.ts`,放到`tag`文件夹下，并且更名为`tag.entiry.ts`
3. 修改了内部的属性（删的删，改的改）， 变成了一个`Tag`实体，开心的保存了
4. 但是，我忘记了修改类名， 所以我的`category`表被清空了， 里面数据都没了~

就上面这两个坑，如果你是空数据库， 你随便折腾， 但是你数据库中有数据的童鞋， 建议一定要谨慎点， 连接数据库时， 上来先把`synchronize:false`设置上， 保命要紧

## 接口格式统一

> 一般开发中是不会根据`HTTP`状态码来判断接口成功与失败的， 而是会根据请求返回的数据，里面加上`code`字段

首先定义返回的json格式：

```json
{
    "code": 0,
    "message": "OK",
    "data": {
    }
}
```

请求失败时返回：

```json
{
    "code": -1,
    "message": "error reason",
    "data": {}
}
```

### 拦截错误请求

首先使用命令创建一个过滤器：

```bash
nest g filter core/filter/http-exception
```

过滤器代码实现：

```ts
import {ArgumentsHost,Catch, ExceptionFilter, HttpException} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus(); // 获取异常状态码

    // 设置错误信息
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;
    const errorResponse = {
      data: {},
      message: message,
      code: -1,
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
```

最后需要在`main.ts`中全局注册

```ts
...
import { HttpExceptionFilter } from './core/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  ...
   // 注册全局错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

这样对请求错误就可以统一的返回了，返回请求错误只需要抛出异常即可,比如之前的：

```ts
 throw new HttpException('文章已存在', 401);
```

接下来对请求成功返回的格式进行统一的处理，可以用`Nest.js`的拦截器来实现。

### 拦截成功的返回数据

首先使用命令创建一个拦截器：

```bash
nest g interceptor core/interceptor/transform
```

拦截器代码实现：

```ts
import {CallHandler, ExecutionContext, Injectable,NestInterceptor,} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 0,
          msg: '请求成功',
        };
      }),
    );
  }
}
```

最后和过滤器一样，在`main.ts`中全局注册：

```ts
...
import { TransformInterceptor } from './core/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  ...
  // 全局注册拦截器
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

过滤器和拦截器实现都是三部曲：`创建 > 实现 > 注册`，还是很简单的。

看看返回的数据格式:

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111301047613.gif)

一名合格的前端，你对我说："这是接口地址xxx， 用postman执行一下就能看到返回结果"，这完全就是在挑衅， 鬼知道你每个字段什么意思，每个接口需要传什么参数，哪些参数必传，哪些可选....

## 配置接口文档Swagger

首先安装一下：

```bash
npm install @nestjs/swagger swagger-ui-express -S
```

接下来需要在`main.ts`中设置`Swagger`文档信息：

```ts
...
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  ...
  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('管理后台')   
    .setDescription('管理后台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
```

配置完成，我们就可以访问：`http://127.0.0.1:3000/docs/`,此时就能看到`Swagger`生成的文档：

![image-20211130105755269](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111301057339.png)

我们写的路由都展示出来了，但是我们就这么看，找需要的接口也太难了，而且这些接口仍然没有任何注释，还是看不懂啊~

### 接口标签

我们可以根据`Controller`来分类， 只要添加`@ApiTags`就可以

```ts
...
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

@ApiTags("app")
@Controller('post')
export class PostsController {...}
```

对`posts.controller.ts`和`app.controller.ts` 都分别加上分类标签，刷新`Swagger`文档，看到的效果是这样的：

![image-20211130110646951](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111301106006.png)

### 接口说明

进一步优化文档， 给每一个接口添加说明文字， 让使用的人直观的看到每个接口的含义，不要让使用的人去猜。同样在`Controller`中， 在每一个路由的前面使用`@ApiOperation`装饰器：

```ts
//  posts.controller.ts
...
import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '测试postsService的get方法' })
  @Get()
  async getH() {
    return this.postsService.getHello();
  }
}
```

现在我们对每一个接口都写上了说明，再来看看接口文档展现：

![image-20211130111324024](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111301113068.png)

### 接口传参

最后我们要处理的就是接口参数说明， `Swagger`的优势之一就是，只要注解到位，可以精确展示每个字段的意义，我们想要对每个传入的参数进行说明。

这里需要先插入一段关于`DTO`的解释, 因为后面参数说明会用到：

> 数据传输对象（DTO)(Data Transfer Object)，是一种设计模式之间传输数据的软件应用系统。数据传输目标往往是数据访问对象从数据库中检索数据。数据传输对象与数据交互对象或数据访问对象之间的差异是一个以不具有任何行为除了存储和检索的数据（访问和存取器）。

这一段是官方解释， 看不懂没关系，可以理解成，`DTO 本身更像是一个指南`, 在使用API时，方便我们了解`请求期望的数据类型`以及`返回的数据对象`。先使用一下，可能更方便理解。

在`posts`目录下创建一个`dto`文件夹，再创建一个`create-post.dto.ts`文件：

然后在`Controller`中对创建文章是传入的参数进行类型说明：

```ts
//  posts.controller.ts
...
import { CreatePostDto } from './dto/create-post.dto';

@ApiOperation({ summary: '创建文章' })
@Post()
async create(@Body() post:CreatePostDto) {...}
```

> 这里提出两个问题：
>
> 1. 为什么不使用  `interface` 而要使用 `class` 来声明 `CreatePostDto`
> 2. 为什么不直接用之前定义的实体类型`PostsEntiry`，而是又定义一个 `CreatePostDto`

对于第一个问题，我们都知道`Typescript`接口在编译过程中是被删除的，其次后面我们要给参数加说明,使用`Swagger`的装饰器，`interface`也是无法实现的，比如：

```ts
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  readonly title: string;

  @ApiProperty({ description: '作者' })
  readonly author: string;

  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '文章封面' })
  readonly cover_url: string;

  @ApiProperty({ description: '文章类型' })
  readonly type: number;
}
```

`@ApiPropertyOptional`装饰可选参数：

对于上面提到的第二个问题，**为什么不直接使用实体类型`PostsEntiry`，而是又定义一个 `CreatePostDto`**，因为HTTP请求传参和返回的内容可以采用和数据库中保存的内容不同的格式，所以将它们分开可以随着时间的推移及业务变更带来更大的灵活性，这里涉及到单一设计的原则，因为每一个类应该处理一件事，最好只处理一件事。

现在就可以从API文档上直观的看到每个传参的含义、类型以及是否必传。到这一步并没有完， 虽然已经告诉别人怎么传， 但是一不小心传错了呢， 比如上面作者字段没传，会发生什么呢？

接口直接报500了， 因为我们实体定义的`author`字段不能为空的，所以在写入数据时报错了。这样体验非常不好， 很可能前端就怀疑我们接口写错了，所以我们应该对异常进行一定的处理。

### 数据验证

怎么实现呢？首先想到的是在业务中去写一堆的`if-elese`判断用户的传参，一想到一堆的判断， 这绝对不是明智之举，所有我去查了`Nest.js`中数据验证，发现`Nest.js`中的**管道**就是专门用来做数据转换的，我们看一下它的定义：

> 管道是具有 `@Injectable()` 装饰器的类。管道应实现 `PipeTransform` 接口。
>
> 管道有两个类型:
>
> - **转换**：管道将输入数据转换为所需的数据输出
> - **验证**：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常;

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111301126624.webp)

> 管道在异常区域内运行。这意味着当抛出异常时，它们由核心异常处理程序和应用于当前上下文的 异常过滤器 处理。当在 Pipe 中发生异常，controller 不会继续执行任何方法。

什么意思呢， 通俗来讲就是，对请求接口的入参进行验证和转换的前置操作，验证好了我才会将内容给到路由对应的方法中去，失败了就进入异常过滤器中。

`Nest.js`自带了三个开箱即用的管道：`ValidationPipe`、`ParseIntPipe`和`ParseUUIDPipe`, 其中`ValidationPipe` 配合`class-validator`就可以完美的实现我们想要的效果（对参数类型进行验证，验证失败抛出异常）。

管道验证操作通常用在`dto`这种传输层的文件中,用作验证操作。首先我们安装两个需要的依赖包：`class-transformer`和`class-validator`

```ts
npm install class-validator class-transformer -S
```

然后在`create-post.dto.ts`文件中添加验证, 完善错误信息提示：

```ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @IsNotEmpty({ message: '缺少作者信息' })
  @ApiProperty({ description: '作者' })
  readonly author: string;

  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '文章封面' })
  readonly cover_url: string;

  @IsNumber()
  @ApiProperty({ description: '文章类型' })
  readonly type: number;
}
```

入门阶段，我们使用的数据比较简单，上面只编写了一些常用的验证，`class-validator`还提供了很多的验证方法， 大家感兴趣可以自己看官方文档.

最后我们还有一个重要的步骤， 就是在`main.ts`中全局注册一下管道`ValidationPipe`：

```ts
app.useGlobalPipes(new ValidationPipe());
```

此时我们在发送一个创建文章请求，不带`author`参数， 返回数据有很清晰了：

![image-20211130115120720](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111301151763.png)

> 通过上边的学习，可以知道`DTO`本身是不存在任何验证功能， 但是我们可以借助`class-validator`来让`DTO`可以验证数据