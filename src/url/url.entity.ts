import { IsIn } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Url {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    originalUrl: string;

    @Column()
    @IsIn(['A', 'I', 'E'])
    status: string;
}