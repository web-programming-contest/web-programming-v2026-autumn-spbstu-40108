import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth(): { status: string; message: string } {
    return {
      status: 'работает',
      message: 'Сервис Gadget Hub работает',
    };
  }
}
