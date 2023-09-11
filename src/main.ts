import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors({
        origin: "*"
    });

    const config = new DocumentBuilder()
        .setTitle('URL Shortener')
        .setDescription('The URL Shortener App')
        .setVersion('1.0')
        // .addTag('URL')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    await app.listen(3000);
}
bootstrap();
