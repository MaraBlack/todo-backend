import { IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { TaskPriority } from '../models/task-priority.enum';
import { TaskStatus } from '../models/task-status.enum';


export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(TaskPriority, { message: 'Priority must be Low, Medium, or High' })
  priority: TaskPriority;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString({ strict: true }, { message: 'Start date must be a valid date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({ strict: true }, { message: 'End date must be a valid date string' })
  endDate?: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus, {
    message: `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  })
  status?: TaskStatus;
}
