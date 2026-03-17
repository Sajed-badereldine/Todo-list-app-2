import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { QueryTodosDto } from './dto/query-todos.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepository: Repository<Todo>,
  ) {}

  async create(user: AuthenticatedUser, createTodoDto: CreateTodoDto) {
    const nextPosition = await this.todosRepository.count({
      where: {
        userId: user.id,
      },
    });

    const todo = this.todosRepository.create({
      ...createTodoDto,
      description: createTodoDto.description ?? null,
      position: nextPosition,
      userId: user.id,
    });

    return this.todosRepository.save(todo);
  }

  async findAll(user: AuthenticatedUser, query: QueryTodosDto) {
    const where = {
      userId: user.id,
      ...(query.completed !== undefined ? { completed: query.completed } : {}),
    };

    return this.todosRepository.find({
      where,
      order: {
        position: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(user: AuthenticatedUser, id: string) {
    const todo = await this.todosRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async update(user: AuthenticatedUser, id: string, updateTodoDto: UpdateTodoDto) {
    const todo = await this.findOne(user, id);

    Object.assign(todo, {
      ...updateTodoDto,
      description:
        updateTodoDto.description !== undefined ? updateTodoDto.description : todo.description,
    });

    return this.todosRepository.save(todo);
  }

  async remove(user: AuthenticatedUser, id: string) {
    const todo = await this.findOne(user, id);
    await this.todosRepository.remove(todo);
    await this.normalizePositions(user.id);

    return {
      message: 'Todo deleted successfully',
    };
  }

  async toggle(user: AuthenticatedUser, id: string) {
    const todo = await this.findOne(user, id);
    todo.completed = !todo.completed;
    return this.todosRepository.save(todo);
  }

  async reorder(user: AuthenticatedUser, id: string, direction: 'up' | 'down') {
    const todos = await this.todosRepository.find({
      where: {
        userId: user.id,
      },
      order: {
        position: 'ASC',
        createdAt: 'DESC',
      },
    });

    const currentIndex = todos.findIndex((todo) => todo.id === id);

    if (currentIndex === -1) {
      throw new NotFoundException('Todo not found');
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= todos.length) {
      return todos[currentIndex];
    }

    const reorderedTodos = [...todos];
    const [currentTodo] = reorderedTodos.splice(currentIndex, 1);
    reorderedTodos.splice(targetIndex, 0, currentTodo);

    await this.todosRepository.manager.transaction(async (manager) => {
      await Promise.all(
        reorderedTodos.map((todo, index) =>
          manager.update(Todo, { id: todo.id }, { position: index }),
        ),
      );
    });

    return this.findOne(user, id);
  }

  private async normalizePositions(userId: string) {
    const todos = await this.todosRepository.find({
      where: {
        userId,
      },
      order: {
        position: 'ASC',
        createdAt: 'DESC',
      },
    });

    await this.todosRepository.manager.transaction(async (manager) => {
      await Promise.all(
        todos.map((todo, index) =>
          manager.update(Todo, { id: todo.id }, { position: index }),
        ),
      );
    });
  }
}
