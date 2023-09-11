import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOriginalUrlDto {
    @IsString()
    @ApiProperty({ required: true })
    @Expose()
    public bias: string;
}