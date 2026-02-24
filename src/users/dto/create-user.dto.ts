// src/users/dto/create-user.dto.ts
import { IsString, IsOptional, IsEmail, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly status?: string; 

  @IsOptional()
  @IsDate()
  readonly created_at?: Date; // optional, will default to now in service
}
