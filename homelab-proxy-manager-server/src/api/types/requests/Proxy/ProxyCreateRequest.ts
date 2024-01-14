import { IsNotEmpty, IsString, MinLength, MaxLength, IsEnum, IsArray, ArrayMinSize, IsInt, IsBoolean } from 'class-validator';
import { ProxyDestinationType } from '@api/types/ProxyDestinationType';

export class ProxyCreateRequest {
  @IsEnum(ProxyDestinationType)
  forward_type: ProxyDestinationType;

  @IsString()
  name: string;

  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  forward_ip: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  forward_port: string;

  @IsBoolean()
  forward_https: boolean;

  @IsString()
  domain: string;

  @IsInt()
  status: number;

  @IsBoolean()
  supports_https: boolean;
}
