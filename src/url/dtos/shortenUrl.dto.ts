import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlDto {
    @IsString()
    @ApiProperty({ required: false })
    @Expose()
    public originalUrl: string;

    @IsString()
    @ApiProperty({ required: false })
    @Expose()
    public bias: string;
}