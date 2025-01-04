import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '../models/task-status.enum';
import { TaskPriority } from '../models/task-priority.enum';
import { checkUniqueField, preventOverwritingProtectedFields, validateDates } from '../utils/validate-dates.util';
import { validateTask } from '../utils/validate-task.util';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) { }

  async create(task: Partial<Task>): Promise<Task> {
    // Perform validations
    await validateTask(task, this.taskRepository);

    const newTask = this.taskRepository.create(task);
    return await this.taskRepository.save(newTask);
  }

  async update(id: number, task: Partial<Task>): Promise<Task> {
    // Check if the task exists
    const existingTask = await this.findOne(id);
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Perform validations
    await validateTask(task, this.taskRepository, id);

    // Merge existing data with the update payload
    const updatedTask = { ...existingTask, ...task };
    return await this.taskRepository.save(updatedTask);
  }


  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }


  async remove(id: number): Promise<void> {
    const existingTask = await this.findOne(id);
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    await this.taskRepository.delete(id);
  }
}
