import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { checkUniqueField, validateDates } from './validate-dates.util';
import { BadRequestException } from '@nestjs/common';

describe('validateDates', () => {
  it('should throw an error if endDate is earlier than startDate', () => {
    expect(() => validateDates('2025-01-10', '2025-01-01')).toThrow(
      BadRequestException,
    );
  });

  it('should not throw an error for valid dates', () => {
    expect(() => validateDates('2025-01-01', '2025-01-10')).not.toThrow();
  });
});

describe('checkUniqueField', () => {
  it('should throw an error if the field is not unique', async () => {
    const mockRepository = {
      findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Duplicate Task' }),
    } as unknown as Repository<Task>;

    await expect(
      checkUniqueField(mockRepository, 'name', 'Duplicate Task'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should not throw an error for unique fields', async () => {
    const mockRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    } as unknown as Repository<Task>;

    await expect(
      checkUniqueField(mockRepository, 'name', 'Unique Task'),
    ).resolves.not.toThrow();
  });
});
