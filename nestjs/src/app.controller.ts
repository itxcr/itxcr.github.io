import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async create(@Body() createTestDto) {
    return createTestDto;
  }

  @Delete(':id')
  async remove(@Param('id') id) {
    return id;
  }

  @Get()
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Put('list/user')
  updateUser() {
    return {
      userId: 1,
    };
  }
}
