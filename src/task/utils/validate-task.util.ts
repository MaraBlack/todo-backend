import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskPriority } from '../models/task-priority.enum';
import { TaskStatus } from '../models/task-status.enum';
import { checkUniqueField, preventOverwritingProtectedFields, validateDates } from './validate-dates.util';
import { Task } from '../entities/task.entity';

export async function validateTask(
  task: Partial<Task>,
  repository: Repository<Task>, 
  excludeId?: number,
): Promise<void> {
  // Check for protected fields
  preventOverwritingProtectedFields(task);

  // Validate mandatory fields
  if (task.name !== undefined && (task.name === null || task.name.trim() === '')) {
    throw new BadRequestException('Task name is mandatory and cannot be empty');
  }

  if (task.priority && !Object.values(TaskPriority).includes(task.priority as TaskPriority)) {
    throw new BadRequestException(
      `Priority must be one of: ${Object.values(TaskPriority).join(', ')}`,
    );
  }

  if (task.status && !Object.values(TaskStatus).includes(task.status as TaskStatus)) {
    throw new BadRequestException(
      `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
    );
  }

  // Check for unique task name
  if (task.name) {
    await checkUniqueField(repository, 'name', task.name, excludeId);
  }

  // Ensure endDate is not earlier than startDate
  validateDates(task.startDate, task.endDate);
}
