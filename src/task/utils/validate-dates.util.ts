import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Task } from '../entities/task.entity';

export function validateDates(startDate?: string, endDate?: string): void {
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    throw new BadRequestException('End date cannot be earlier than start date');
  }
}

export async function checkUniqueField<T>(
  repository: Repository<T>,
  fieldName: keyof T,
  value: any,
  excludeId?: number,
): Promise<void> {
  const queryBuilder = repository.createQueryBuilder('entity');

  queryBuilder.where(`entity.${String(fieldName)} = :value`, { value });

  if (excludeId) {
    queryBuilder.andWhere('entity.id != :excludeId', { excludeId });
  }

  const existingRecord = await queryBuilder.getOne();

  if (existingRecord) {
    throw new BadRequestException(`${String(fieldName)} must be unique.`);
  }
}

export function preventOverwritingProtectedFields(
  input: Record<string, any>
): void {
  const protectedFields = ['id'];
  const invalidFields = protectedFields.filter((field) => field in input);

  if (invalidFields.length > 0) {
    throw new BadRequestException(
      `The following fields cannot be set or updated: ${invalidFields.join(', ')}`,
    );
  }
}

