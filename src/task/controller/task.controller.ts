import { Controller, Get, Post, Body, Param, Delete, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { TaskService } from '../service/task.service';


@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.create(createTaskDto);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Task> {
    if (!id || isNaN(id)) {
      throw new Error('Invalid ID');
    }
    return await this.taskService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(@Param('id') id: number, @Body() updateTaskDto: Partial<CreateTaskDto>): Promise<Task> {
    if (!id || isNaN(id)) {
      throw new Error('Invalid ID');
    }
    return await this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    if (!id || isNaN(id)) {
      throw new Error('Invalid ID');
    }
    return await this.taskService.remove(id);
  }
}
