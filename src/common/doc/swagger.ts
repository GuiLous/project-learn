import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { serverConfig } from '../config';

export async function swagger(app: INestApplication) {
  if (serverConfig().environment === 'production') {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle('My auth api')
    .setDescription('Base api example with authentication jwt')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
}
