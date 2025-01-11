import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from '@libs/filters/http-exception.filter';

async function bootstrap() {
  const port = Number(process.env.PORT) | 3000;
  const app = await NestFactory.create(AppModule);
  const title = 'Stock and Crypto API';
  const documentPath = 'documents';
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription('API for stock and crypto data')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(documentPath, app, documentFactory);
  Logger.log(
    `URL Document :: ${`${title
      .replace(/\s/g, '-')
      .toLowerCase()}/${documentPath}`}`,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 Application is running on: ${await app.getUrl()}/`);
  Logger.log(`Environment at ${process.env['NODE' + '_ENV']}`);
}
bootstrap();
