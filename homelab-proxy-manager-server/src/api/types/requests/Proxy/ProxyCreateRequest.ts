import { IsNotEmpty, IsString, MinLength, MaxLength, IsEnum, IsArray, ArrayMinSize, IsInt, IsBoolean } from 'class-validator';
import { ProxyDestinationType } from '../../ProxyDestinationType';

export class ProxyCreateRequest {
  @IsEnum(ProxyDestinationType)
  destinationType: ProxyDestinationType;

  @IsString()
  name: string;

  @MaxLength(191)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  forwardIp?: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  forwardPort: string;

  @IsBoolean()
  forwardHttps: boolean;

  @IsString()
  domain: string;

  @IsInt()
  status: number;

  @IsBoolean()
  supportsHttps: boolean;
}
