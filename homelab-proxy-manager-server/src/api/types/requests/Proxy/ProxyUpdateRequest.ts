import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsEnum, IsArray, ArrayMinSize, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ProxyDestinationType } from '@api/types/ProxyDestinationType';

export class ProxyUpdateRequest {
  @IsEnum(ProxyDestinationType)
  @IsOptional()
  forward_type?: ProxyDestinationType;

  @IsOptional()
  @IsString()
  domain?: string;

  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  forward_ip?: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsOptional()
  forward_port?: string;

  @IsBoolean()
  @IsOptional()
  forward_https?: boolean;

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
  supports_https?: boolean;
}
