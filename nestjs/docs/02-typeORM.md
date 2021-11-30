### TypeORM 和 PostgreSQL 项目开发和数据库迁移

当 Node.js Server 项目越来越大时，将数据和数据库整理规范是很难的，所以从一开始就有一个好的开发和项目设置，对你的开发项目的成功至关重要。

我们将在一个简单的 Node.js API 上工作，并使用 PostgreSQL 数据库作为数据存储，并围绕它设置一些工具，使开发更容易上手。

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111251748332.webp)

为了在 Node.js 中 构建 API，我们将使用 Nest.js。它是一个相当灵活的框架，建立在 Express.js 的基础上，可以让你在短时间内制作出 Node.js 服务，因为它集成了很多好功能（如完全的类型化支持、依赖注入、模块管理和更多）。

### 添加数据持久层

使用 TypeORM 来管理我们的数据库架构。TypeORM 的优点是：它可以让你通过代码来描述数据实体模型，然后能够应用和同步这些模型到表结构的数据库。

使用 docker 自动化设置本地 PostgreSQL 数据库实例。

```bash
#!/bin/bash
set -e

SERVER="my_database_server";
PW="mysecretpassword";
DB="my_database";

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
  (docker rm $SERVER || :) && \
  docker run --name $SERVER -e POSTGRES_PASSWORD=$PW \
  -e PGPASSWORD=$PW \
  -p 5432:5432 \
  -d postgres

# wait for pg to start
echo "sleep wait for pg-server [$SERVER] to start";
SLEEP 3;

# create the db
echo "CREATE DATABASE $DB ENCODING 'UTF-8';" | docker exec -i $SERVER psql -U postgres
echo "\l" | docker exec -i $SERVER psql -U postgres
```

让我们将该命令添加到我们的 package.json 运行脚本中，以便我们可以轻松执行它。

```json
"start:dev:db": "./src/scripts/start-db.sh"
```

它会设置数据库服务器和一个普通的数据库,为了使过程更健壮，我们将为 docker 容器使用相同的名称（脚本中的 $SERVER var），并添加一个额外的检查：如果有同名的容器正在运行，那么将结束并删除它以确保干净状态。

### Nest.js 连接数据库

使用预构建的 NestJS-to-TypeORM 模块为我们的项目添加 TypeORM 支持。

```bash
npm install --save @nestjs/typeorm typeorm pg
```

### 配置管理

可以在 Nest.js 中配置 TypeORM 连接到哪个数据库服务器，方法是使用 TypeOrmModule。它有一个 `forRoot` 方法，我们可以传入配置。我们知道配置在本地开发和生产环境中会有所不同。所以，这个过程在某种程度上必须是通用的，以便它可以在不同运行环境提供不同的配置。我们可以编写以下配置服务。这个配置类的功能是在我们的 API Server main.ts 启动之前运行。它可以从环境变量中读取配置，然后在运行时以只读方式提供值。为了使 dev 和 prod 灵活，我们将使用 dotenv 模块。

```bash
npm install --save dotenv
```

有了这个模块，我们可以在本地开发的项目根目录中有一个 “.env” 文件来准备配置值，而在生产中，我们可以从生产服务器上的环境变量中读取值。这是一种非常灵活的方法，还允许您使用一个文件轻松地与团队中的其他开发人员共享配置。注意：我强烈建议 git 忽略此文件，因为你有可能会将生产环境的账号密码放入此文件中，所以你不应把配置文件提交到项目中而造成意外泄露。

这是 .env 文件的样子：

```js
POSTGRES_HOST=127.0.0.1 
POSTGRES_PORT=5432 
POSTGRES_USER=postgres 
POSTGRES_PASSWORD=mysecretpassword 
POSTGRES_DATABASE=my_database 
PORT=3000 
MODE=DEV 
RUN_MIGRATIONS=true
```

因此，我们的 ConfigService 将作为单例服务运行，在启动时加载配置值并将它们提供给其他模块。我们将在服务中包含一个容错模式。这意味着如果获取一个不存在的值，它将抛出含义完整的错误。这使您的设置更加健壮，因为您将在构建 / 启动时检测配置错误，而不是在运行时生命周期。这样您将能够在部署 / 启动服务器时尽早地检测到这一点，而不是在消费者使用您的 api 时才发现问题。

这是您的 ConfigService 的外观以及我们将其添加到 Nest.js 应用程序模块的方式：

```ts
// app.module.ts

import { Module } from'@nestjs/common';
import { TypeOrmModule } from'@nestjs/typeorm';
import { AppController } from'./app.controller';
import { AppService } from'./app.service';
import { configService } from'./config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig())
  ],
  controllers: [AppController],
  providers: [AppService],
})
exportclass AppModule { }

```

```ts
// src/config/config.service.ts

import { TypeOrmModuleOptions } from'@nestjs/typeorm';

require('dotenv').config();

class ConfigService {

  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      thrownewError(`config error - missing env.${key}`);
    }

    return value;
  }

  publicensureValues(keys: string[]) {
    keys.forEach(k =>this.getValue(k, true));
    returnthis;
  }

  publicgetPort() {
    returnthis.getValue('PORT', true);
  }

  publicisProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      entities: ['**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
    };
  }

}

const configService = new ConfigService(process.env)
  .ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DATABASE'
  ]);

export { configService };
```

### 开发重启

```bash
npm i --save-dev nodemon ts-node
```

 然后在 root 中添加一个带有调试和 ts-node 支持的 nodemon.json 文件

```json
{ 
  "watch": ["src"], 
  "ext": "ts", 
  "ignore": ["src/**/*.spec.ts"], 
  "exec": "node --inspect=127.0\. 0.1:9223 -r ts-node/register -- src/main.ts", 
  "env": {} 
}
```

最后我们将 package.json 中的 start:dev 脚本更改为：

```json
"start:dev": "nodemon --config nodemon.json",
```

这样可以通过 `npm run start:dev` 来启动我们的 API-server，在启动时它应该从 ConfigService 中获取 .env 对应环境的 values，然后将 typeORM 连接到我们的数据库，而且它不绑定在我的机器上。

### 定义和加载数据模型实体

TypeORM 支持自动加载数据模型实体。您可以简单地将它们全部放在一个文件夹中，并在您的配置中使用一种模式加载它们 —— 我们将我们的放在 model/.entity.ts 中。（见实体的 TypeOrmModuleOptions 中的 ConfigService）![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111251910558.webp)

TypeORM 的另一个特性是这些实体模型支持继承。

例如，如果您希望每个实体都拥有某些数据字段。

例如：自动生成的 uuid id 字段 和 createDateTime 字段，lastChangedDateTime 字段。
注意：这些基类应该是 abstract。

因此，在 TypeORM 中定义数据模型实体将如下所示：

```ts
// base.entity.ts

import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from'typeorm';

exportabstractclass BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isArchived: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () =>'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @Column({ type: 'varchar', length: 300 })
    createdBy: string;

    @UpdateDateColumn({ type: 'timestamptz', default: () =>'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;

    @Column({ type: 'varchar', length: 300 })
    lastChangedBy: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    internalComment: string | null;
}
```

```ts
// item.entity.ts

import { Entity, Column } from'typeorm';
import { BaseEntity } from'./base.entity';

@Entity({ name: 'item' })
exportclass Item extends BaseEntity {

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'varchar', length: 300 })
  description: string;
}
```

在 typeORM 文档中查找更多支持的数据注释。

让我们启动我们的 API，看看它是否有效。

```bash
npm run start:dev:db 
npm run start:dev
```

实际上我们的数据库并没有立即反映我们的数据模型，TypeORM 能够将您的数据模型同步到数据库中的表中。数据模型自动同步很好，但也很危险。为什么？在前期开发中，您可能没有把所有数据实体都整理清楚。因此，您在代码中更改了实体类， typeORM 会为你自动同步字段， 但是，一旦您的数据库中有实际数据，后期打算修改字段类型或其他操作时，TypeORM 将通过删除并重新创建数据库表来更改数据库，这意味着你极有可能丢失了表内的数据。当然在生产环境中你应该避免这种意想不到情况发生。

这就是为什么我更喜欢从一开始就直接在代码中处理数据库迁移。

这也将帮助您和您的团队更好地跟踪和理解数据结构的变化，并迫使您更积极地思考这一点：怎样做可以帮助您避免生产环境中的破坏性更改和数据丢失。

幸运的是 TypeORM 提供了一个解决方案和 `CLI` 命令，它为你处理生成 SQL 命令的任务。然后，您可以轻松验证和测试这些，而无需在后台使用任何黑魔法。
以下是如何设置 typeORM CLI 的最佳实践。

#### 1. **typeORM CLI 的设置**

我们已经在 ConfigService 中添加了所有必要的配置，但是 typeORM CLI 与 ormconfig.json 是同时生效的，所以我们希望与正式环境的 CLI 区分开来。添加一个脚本来编写配置 json 文件并将其添加到我们的.gitignore -list：

```js
import fs = require('fs');
fs.writeFileSync('ormconfig.json', JSON.stringify(configService.getTypeOrmConfig(), null, 2) 
);
```

添加一个 npm 脚本任务来运行它以及 typeorm:migration:generate 和 typeorm:migration:run 的命令。
像这样 ormconfig 将在运行 typeORM CLI 命令之前生成。

```json
"pretypeorm": "(rm ormconfig.json || :) && ts-node -r tsconfig-paths/register src/scripts/write-type-orm-config.ts",
"typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js",
"typeorm:migration:generate": "npm run typeorm -- migration:generate -n",
"typeorm:migration:run": "npm run typeorm -- migration:run"
```

#### 2. 创建迁移

现在我们可以运行这个命令来创建一个初始化迁移：

```bash
npm run typeorm:migration:generate -- my_init
```

这会将 typeORM 连接到您的数据库并生成一个数据库迁移脚本 my_init.ts（在 typescript 中）并将其放入您项目的迁移文件夹中。
注意：您应该将这些迁移脚本提交到您的源代码管理中，并将这些文件视为只读。
如果你想改变一些东西，想法是使用 CLI 命令在顶部添加另一个迁移。![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111251913307.webp)

#### 3. 运行迁移

```bash
npm run typeorm:migration:run
```

现在我们拥有了创建和运行迁移所需的所有工具，而无需运行 API 服务器项目，它在开发时为我们提供了很大的灵活性，我们可以随时重新运行、重新创建和添加它们。然而，在生产或阶段环境中，您实际上经常希望在部署之后 / 之后启动 API 服务器之前自动运行迁移脚本。
为此，您只需添加一个 start.sh 脚本即可。
您还可以添加一个环境变量 RUN_MIGRATIONS=<0|1> 来控制迁移是否应该自动运行。

```bash
#!/bin/bash
设置 -e
设置 -x
如果 [ "$RUN_MIGRATIONS" ]; 然后
  回显“正在运行的迁移”；
  npm run typeorm:migration:run 
fi
回声“启动服务器”；
npm run start:prod
```

### 调试和数据库工具

我们通过 API 完成同步数据库字段工作 - 但我们的数据库实际上反映了我们的数据模型吗？
可以通过对 DB 运行一些 CLI 脚本查询或使用 UI 数据库管理工具进行快速调试来检查这一点。
使用 PostgreSQL 数据库时，我使用 **pgAdmin**。
这是一个非常强大的工具，有一个漂亮的用户界面。但是，我建议您使用以下工作流程：![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111251914810.webp)

我们现在可以看到表在数据库中创建。1. 我们在项目中定义的项目表。2. 一个迁移表，在这个表中 typeORM 跟踪已经在这个数据库上执行了哪个迁移。（注意：您也应该将此表视为只读，否则 typeORM CLI 会混淆）

添加一些业务逻辑

现在让我们添加一些业务逻辑。
为了演示，我将添加一个简单的 endpoint，它将返回表中的数据。
我们使用 Nest.js CLI 添加一个项目控制器和一个项目服务。

```bash
nest -- generate controller item
nest -- generate service item
```

这将为我们生成一些模板，然后我们添加：

```ts
// item.service.ts 

import { Injectable } from'@nestjs/common';
import { InjectRepository } from'@nestjs/typeorm';
import { Item } from'../model/item.entity';
import { Repository } from'typeorm';

@Injectable()
exportclass ItemService {
  constructor(@InjectRepository(Item) private readonly repo: Repository<Item>) { }

  publicasyncgetAll() {
    returnawaitthis.repo.find();
  }
}
```

```ts
// item.controller.ts

import { Controller, Get } from'@nestjs/common';
import { ItemService } from'./item.service';

@Controller('item')
exportclass ItemController {
  constructor(private serv: ItemService) { }

  @Get()
  publicasyncgetAll() {
    returnawaitthis.serv.getAll();
  }
}

```

 然后通过 ItemModule 连接在一起，然后在 AppModule 中导入。

```ts
// item.module.ts

import { Module } from'@nestjs/common';
import { TypeOrmModule } from'@nestjs/typeorm';
import { ItemService } from'./item.service';
import { ItemController } from'./item.controller';
import { Item } from'../model/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemService],
  controllers: [ItemController],
  exports: []
})
exportclass ItemModule { }
```

 启动 API 后，curl 试试：

```bash
curl localhost:3000/item | jq
[] # << indicating no items in the DB - cool :)
```

### 不暴露实体——添加 DTO 和响应

不要通过您的 API 向消费者公开您在持久性上的实际数据模型。
当你用一个数据传输对象包装每个数据实体时，你必须对它做序列化和反序列化。

在内部数据模型（API 到数据库）和外部模型（API 消费者到 API）之间应该是有区别的。从长远来看，这将帮助您解耦，令维护变得更容易。

- 应用领域驱动设计原则的分离。

- 性能，更容易优化查询。
- 版本控制。
- 可测试性。...... 等等

因此，我们将添加一个 ItemDTO 响应类，该类将由数据库中的项目实体填充。

这就是一个简单的服务和响应 DTO 的样子：

注意：你必须为此安装 `@nestjs/swagger`、`class-validator` 和 `class-transformer`。

```ts
// item.dto.ts

import { ApiModelProperty } from'@nestjs/swagger';
import { IsString, IsUUID, } from'class-validator';
import { Item } from'../model/item.entity';
import { User } from'../user.decorator';

exportclass ItemDTO implements Readonly<ItemDTO> {
  @ApiModelProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiModelProperty({ required: true })
  @IsString()
  name: string;

  @ApiModelProperty({ required: true })
  @IsString()
  description: string;

  publicstaticfrom(dto: Partial<ItemDTO>) {
    const it = new ItemDTO();
    it.id = dto.id;
    it.name = dto.name;
    it.description = dto.description;
    return it;
  }

  publicstaticfromEntity(entity: Item) {
    returnthis.from({
      id: entity.id,
      name: entity.name,
      description: entity.description
    });
  }

  publictoEntity(user: User = null) {
    const it = new Item();
    it.id = this.id;
    it.name = this.name;
    it.description = this.description;
    it.createDateTime = newDate();
    it.createdBy = user ? user.id : null;
    it.lastChangedBy = user ? user.id : null;
    return it;
  }
}

```

 现在我们可以像这样简单地使用 DTO：

```ts
// item.controller.ts
  
  @Get()
  publicasync getAll(): Promise<ItemDTO[]> {
    returnawaitthis.serv.getAll()
  }

  @Post()
  publicasync post(@User() user: User, @Body() dto: ItemDTO): Promise<ItemDTO> {
    returnthis.serv.create(dto, user);
  }

```

```ts
// item.service.ts
  
  publicasync getAll(): Promise<ItemDTO[]> {
    returnawaitthis.repo.find()
      .then(items => items.map(e => ItemDTO.fromEntity(e)));
  }

  publicasync create(dto: ItemDTO, user: User): Promise<ItemDTO> {
    returnthis.repo.save(dto.toEntity(user))
      .then(e => ItemDTO.fromEntity(e));
  }
```

设置 OpenAPI (Swagger)

DTO 方法还使您能够从它们生成 API 文档（openAPI aka swagger docs）。您只需安装：

```bash
npm install --save @nestjs/swagger swagger-ui-express
```

并在 main.ts 中添加这几行

```ts
// main.ts

asyncfunction bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!configService.isProduction()) {

    constdocument = SwaggerModule.createDocument(app, new DocumentBuilder()
      .setTitle('Item API')
      .setDescription('My Item API')
      .build());

    SwaggerModule.setup('docs', app, document);

  }

  await app.listen(3000);
}
```

![图片](https://cdn.jsdelivr.net/gh/itxcr/oss/images/202111251917532.webp)