import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Url } from './url/url.entity';
import { UrlModule } from './url/url.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'URL.sqlite',
            entities: [Url],
            synchronize: true
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
        }),
        UrlModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
