import { Body, Controller, Get, HttpCode, Param, Post, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenUrlDto } from './dtos/url.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@Controller()
export class UrlController {
    private baseURL: string;

    constructor(
        private service: UrlService,
        private configService: ConfigService,
    ) {
        this.baseURL = this.configService.get<string>('DEFAULT_BASE_URL');
    }

    @Post('shorten')
    @ApiOkResponse({ type: String, isArray: false })
    @HttpCode(200)
    public async shortenUrl(
        @Body()
        url: ShortenUrlDto,
    ) {
        return this.service.shortenUrl(url);
    }

    @Get(':code')
    @ApiOkResponse({ type: String, isArray: false })
    @HttpCode(200)
    public async redirect(
        @Res() res,
        @Param('code')
        code: string,
    ) {
        const url = await this.service.redirect(code);
        return res.redirect(url.originalUrl);
    }
}