import {
    Injectable,
    BadRequestException,
    NotFoundException,
    UnprocessableEntityException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { ShortenUrlDto } from './dtos/url.dto';
import { nanoid } from 'nanoid';
import { isURL } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ResponseData } from '../response/response.data';

@Injectable()
export class UrlService {
    private baseURL: string;

    constructor(
        @InjectRepository(Url)
        private repo: Repository<Url>,
        private configService: ConfigService,
    ) {
        this.baseURL = this.configService.get<string>('DEFAULT_BASE_URL');
    }

    async shortenUrl(url: ShortenUrlDto) {
        const { originalUrl, bias } = url;

        //checks if longurl is a valid URL
        if (!isURL(originalUrl)) {
            throw new BadRequestException('String Must be a Valid URL');
        }

        const urlCode = bias ?? nanoid(10);

        try {
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
            let url = await this.repo.findOneBy({ originalUrl });
            if (url) {
                response.result = `${this.baseURL}/${url.code}`;
            }
            //if it doesn't exist, shorten it
            else {
                url = this.repo.create({
                    code: urlCode,
                    originalUrl,
                    status: 'A',
                });

                //add the new record to the database
                this.repo.save(url);

                response.result = `${this.baseURL}/${urlCode}`;
            }

            return response;
        }
        catch (error) {
            console.log(error);
            throw new UnprocessableEntityException('Server Error');
        }
    }

    async redirect(urlCode: string) {
        const url = await this.repo.findOneBy({ code: urlCode });
        if (url) {
            return url;
        }
        else {
            throw new NotFoundException('Resource Not Found');
        }
    }
}
