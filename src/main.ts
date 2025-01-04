import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createConnection } from 'typeorm';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use the Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // MariaDB setup
  try {
    const connection = await createConnection({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root', // Root user (change to your actual root user)
      password: 'maria1234', // Root password
      database: 'mysql', // Connect to an existing system database
    });

    console.log('Connected to MariaDB as root. Setting up database...');

    // Create the `todo_db` database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS todo_db');

    // Create the user if it doesn't exist
    await connection.query(
      "CREATE USER IF NOT EXISTS 'todo_maria'@'localhost' IDENTIFIED BY 'TodoPass1234'"
    );

    // Grant the user privileges on the `todo_db` database
    await connection.query(
      "GRANT ALL PRIVILEGES ON todo_db.* TO 'todo_maria'@'localhost'"
    );

    // Apply changes
    await connection.query('FLUSH PRIVILEGES');

    console.log('Database and user setup complete!');
    await connection.close();
  } catch (err) {
    console.error('Error during database setup:', err.message);
  }

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}

bootstrap();
