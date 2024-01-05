import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsEnum, IsArray, ArrayMinSize, IsOptional } from 'class-validator';
import { ProxyDestinationType } from '@api/types/ProxyDestinationType';

export type BasicDataResponse<T> = {
  total_rows: number;
  rows: T[];
}