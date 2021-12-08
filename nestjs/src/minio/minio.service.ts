import { HttpException, Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import { Client, ClientOptions } from 'minio';
import { ConfigEnvService } from '../config-env/config-env.service';
@Injectable()
export class MinioService {
  options: ClientOptions;
  minioClient: Client;
  constructor(private opts: ClientOptions) {
    this.options = opts;
    this.initial();
  }
  initial() {
    const option = {
      endpoint: '39.106.167.191',
      port: 19000,
      useSSL: false,
      accessKey: ConfigEnvService.get('AccessKey'),
      secretKey: ConfigEnvService.get('SecretKey'),
    };
    this.options = { ...this.options, ...option };
    this.minioClient = new Minio.Client({
      ...this.options,
    });
  }

  async getFileUrls(BucketName = 'blog', files) {
    // this.initial();
    try {
      for (const file of files[0]) {
        // file.url = await this.minioClient.presignedUrl('GET', BucketName, file.fileName)
        // let obj = await this.minioClient.listObjects(BucketName, '', true)
        file.url =
          'http://' +
          this.options.endPoint +
          ':' +
          this.options.port +
          '/' +
          BucketName +
          '/' +
          file.fileName;
      }
      return Promise.resolve(files);
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }
}
