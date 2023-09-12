import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { AppLoggerModule } from 'src/log/app-logger.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Url]), 
        AppLoggerModule
    ],
    providers: [UrlService],
    controllers: [UrlController],
})
export class UrlModule { }
