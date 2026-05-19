import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

type HealthResponse = {
  status: 'ok';
};

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOkResponse({
    description: 'Health check endpoint',
    schema: {
      example: {
        status: 'ok',
      },
    },
  })
  check(): HealthResponse {
    return { status: 'ok' };
  }
}
