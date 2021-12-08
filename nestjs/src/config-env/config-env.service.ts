import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigEnvService {
  static get(key: string): string {
    const envConfig = dotenv.parse(fs.readFileSync(path.resolve('.env.prod')));
    return envConfig[key];
  }
}
