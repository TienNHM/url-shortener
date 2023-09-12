import {
    Injectable,
    BadRequestException,
    NotFoundException,
    UnprocessableEntityException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { nanoid } from 'nanoid';
import { isURL } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ResponseData } from '../response/response.data';
import { GetOriginalUrlDto } from './dtos/getOriginalUrl.dto';
import { ShortenUrlDto } from './dtos/shortenUrl.dto';
import { UrlDto } from './dtos/url.dto';
import { AppLogger } from 'src/log/app-logger.service';

@Injectable()
export class UrlService {
    private baseURL: string;

    constructor(
        @InjectRepository(Url)
        private repo: Repository<Url>,
        private configService: ConfigService,
        private logger: AppLogger,
    ) {
        this.baseURL = this.configService.get<string>('DEFAULT_BASE_URL');
    }

    async getOriginalUrl(input: GetOriginalUrlDto) {
        let existedUrl = await this.repo.findOneBy({ code: input.bias });
        
        const response: ResponseData<string> = {
            result: null,
            error: null
        }
        if (existedUrl) {
            response.result = `${existedUrl.originalUrl}`;
        }
        return response;
    }

    async shortenUrl(url: ShortenUrlDto) {

        this.logger.log(`shortenUrl: ${JSON.stringify(url)}`);

        //checks if longurl is a valid URL
        if (!isURL(url.originalUrl)) {
            throw new BadRequestException('InvalidUrl');
        }

        var urlCode = url.bias ?? nanoid(10);

        //check if the URL Code has already been used
        let existedUrlCode = await this.repo.findOneBy({ code: urlCode });
        //throw exception if it exists
        if (existedUrlCode) {
            throw new InternalServerErrorException('DuplicatedUrlCode')
        }
        const response: ResponseData<string> = {
            result: null,
            error: null
        }

        //check if the URL has already been shortened
        let existedUrl = await this.repo.findOneBy({ originalUrl: url.originalUrl });
        if (existedUrl) {
            response.result = `${this.baseURL}/${existedUrl.code}`;
        }
        //if it doesn't exist, shorten it
        else {
            var newUrl = this.repo.create({
                code: urlCode,
                originalUrl: url.originalUrl,
                status: 'A',
            });

            //add the new record to the database
            this.repo.save(newUrl);

            response.result = `${this.baseURL}/${urlCode}`;
        }

        return response;
    }

    async redirect(urlCode: string) {
        const url = await this.repo.findOneBy({ code: urlCode });
        if (url) {
            return url;
        }
        else {
            throw new NotFoundException('ResourceNotFound');
        }
    }

    async countAsync() {
        
        try {
            let count = await this.repo.countBy({ status: 'A' });

            const response: ResponseData<number> = {
                result: count,
                error: null
            }
            return response;
        }
        catch (error) {
            this.logger.error(error);
            throw new UnprocessableEntityException('ServerError');
        }
    }

    async listAsync() {
        try {
            const list = await this.repo.find();
            const urlDtos = list.map((url) => {
                return {
                    id: url.id,
                    originalUrl: url.originalUrl,
                    bias: url.code,
                    status: url.status,
                }
            });

            const response: ResponseData<UrlDto[]> = {
                result: urlDtos,
                error: null,
            };
            return response;
        } catch (error) {
            this.logger.error(error);
            throw new UnprocessableEntityException('ServerError');
        }
    }
}
