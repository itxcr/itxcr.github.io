import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';
import { getRepository, Repository } from 'typeorm';

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

  // 创建文章;
  async create(post: Partial<PostsEntity>): Promise<PostsEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', HttpStatus.BAD_REQUEST);
    }
    const doc = await this.postsRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('文章已存在', HttpStatus.BAD_REQUEST);
    }
    return await this.postsRepository.save(post);
  }

  // 查找所有文章
  async findAll(query): Promise<PostsRo> {
    const allArticles = await getRepository(PostsEntity).createQueryBuilder(
      'post',
    );

    allArticles.where('1 = 1');
    allArticles.orderBy('post.create_time', 'DESC');
    const count = await allArticles.getCount();
    const { pageNum = 1, pageSize = 10 } = query;
    allArticles.limit(pageSize);
    allArticles.offset(pageSize * (pageNum - 1));
    const posts = await allArticles.getMany();
    return { list: posts, count };
  }
}
