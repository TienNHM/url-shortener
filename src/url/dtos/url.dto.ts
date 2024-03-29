import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UrlDto {
    @IsString()
    @ApiProperty({ required: false })
    @Expose()
    public id: number;

    @IsString()
    @ApiProperty({ required: false })
    @Expose()
    public originalUrl: string;

    @IsString()
    @ApiProperty({ required: false })
    @Expose()
    public bias: string;

    @IsString()
    @ApiProperty({ required: false })
    @Expose()
    public status: string;
}