import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @ApiProperty({ description: '文章作者' })
  @IsNotEmpty({ message: '缺少作者信息' })
  readonly author: string;

  @ApiPropertyOptional({ description: '文章内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '文章封面' })
  readonly cover_url: string;

  @ApiProperty({ description: '文章类型' })
  @IsNumber()
  readonly type: number;
}
