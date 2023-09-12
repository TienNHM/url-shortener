import { Body, Controller, Get, HttpCode, Param, Post, Res } from '@nestjs/common';
import { UrlService } from './url.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GetOriginalUrlDto } from './dtos/getOriginalUrl.dto';
import { ShortenUrlDto } from './dtos/shortenUrl.dto';
import { UrlDto } from './dtos/url.dto';

@ApiTags('Url')
@Controller({ version: '1', path: 'url' })
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

    @Post('original')
    @ApiOkResponse({ type: String, isArray: false })
    @HttpCode(200)
    public async getOriginalUrl(
        @Body()
        input: GetOriginalUrlDto,
    ) {
        return await this.service.getOriginalUrl(input);
    }

    @Post('count')
    @ApiOkResponse({ type: Number, isArray: false })
    @HttpCode(200)
    public async countAsync() {
        return await this.service.countAsync();
    }

    @Post('list')
    @ApiOkResponse({ type: UrlDto, isArray: true })
    @HttpCode(200)
    public async listAsync() {
        return await this.service.listAsync();
    }
}