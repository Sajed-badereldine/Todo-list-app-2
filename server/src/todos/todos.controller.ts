import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryTodosDto } from './dto/query-todos.dto';
import { ReorderTodoDto } from './dto/reorder-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';

@ApiTags('todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Create a todo for the authenticated user',
  })
  create(@CurrentUser() user: AuthenticatedUser, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(user, createTodoDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Get all todos for the authenticated user',
  })
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryTodosDto) {
    return this.todosService.findAll(user, query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.todosService.findOne(user, id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(user, id, updateTodoDto);
  }

  @Patch(':id/toggle')
  @ApiParam({ name: 'id', type: String })
  toggle(@CurrentUser() user: AuthenticatedUser, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.todosService.toggle(user, id);
  }

  @Patch(':id/reorder')
  @ApiParam({ name: 'id', type: String })
  reorder(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() reorderTodoDto: ReorderTodoDto,
  ) {
    return this.todosService.reorder(user, id, reorderTodoDto.direction);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id', new ParseUUIDPipe()) id: string) {
    return this.todosService.remove(user, id);
  }
}
