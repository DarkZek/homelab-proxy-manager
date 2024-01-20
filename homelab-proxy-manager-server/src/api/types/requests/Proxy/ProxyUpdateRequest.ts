import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsEnum, IsArray, ArrayMinSize, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ProxyDestinationType } from '../../ProxyDestinationType';

export class ProxyUpdateRequest {
  @IsEnum(ProxyDestinationType)
  @IsOptional()
  destinationType?: ProxyDestinationType;

  @IsOptional()
  @IsString()
  domain?: string;

  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  forwardIp?: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsOptional()
  forwardPort?: string;

  @IsBoolean()
  @IsOptional()
  forwardHttps?: boolean;

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsOptional()
  domains?: string[];

  @IsInt()
  @IsOptional()
  status?: number;

  @IsBoolean()
  @IsOptional()
  supportsHttps?: boolean;
}
