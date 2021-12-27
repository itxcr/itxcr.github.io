import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MinioService } from '../minio/minio.service';

@ApiTags('文件上传')
@Controller('file')
export class FileController {
  // constructor(private minioService: MinioService) {}
  //
  // @Get('/get')
  // @ApiOperation({ summary: '获取文件', description: '获取文件' })
  // @ApiQuery({ name: 'id', description: '根据 id 获取指定文件', required: true })
  // async getFile(@Query() query) {
  //   // const data = await this.minioService.getFileUrls('blog', res);
  // }
}
