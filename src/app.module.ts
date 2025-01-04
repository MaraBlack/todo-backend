import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    TaskModule,
    TypeOrmModule.forRoot({
      type: 'mariadb', // Db name
      host: 'localhost', // Default host
      port: 3306, // Default port
      username: 'todo_maria', // User, the same that is created in main.ts
      password: 'TodoPass1234', // Password, the same that is created in main.ts
      database: 'todo_db', // Database, the same that is created in main.ts
      synchronize: true, // Automatically sync schema
      autoLoadEntities: true, // Automatically load entity files
    }),
  ],
})
export class AppModule { }