import { Injectable } from '@nestjs/common';
import { ConfigEnvService } from './config-env/config-env.service';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(ConfigEnvService.get('AccessKey'));
    return 'Hello World!';
  }
}
