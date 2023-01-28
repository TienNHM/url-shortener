import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShortenUrlDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    @Expose()
    public originalUrl: string;

    @ApiProperty({ required: false })
    @Expose()
    public bias: string;
}