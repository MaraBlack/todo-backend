import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TaskStatus } from '../models/task-status.enum';
import { TaskPriority } from '../models/task-priority.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
    nullable: false
  })
  priority: TaskPriority;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  startDate?: string;

  @Column({ nullable: true })
  endDate?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TO_DO,
    nullable: false
  })
  status: TaskStatus;
}
