import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostsRo, PostsService } from './posts.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';

@ApiTags('文章')
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 创建文章
   * @param post
   */
  @ApiOperation({ summary: '创建文章' })
  @Post()
  async create(@Body() post: CreatePostDto) {
    return await this.postsService.create(post);
  }

  /**
   * 获取所有文章
   * @param get
   */
  @ApiOperation({ summary: '获取所有文章' })
  @Get()
  async findAll(@Query() query): Promise<PostsRo> {
    return await this.postsService.findAll(query);
  }
}
