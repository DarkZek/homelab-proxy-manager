import { IsNotEmpty, IsString, MinLength, MaxLength, IsEnum, IsArray, ArrayMinSize, IsInt } from 'class-validator';
import { ProxyDestinationType } from '@api/types/ProxyDestinationType';

export class ProxyCreateRequest {
  @IsEnum(ProxyDestinationType)
  forward_type: ProxyDestinationType;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  forward_ip: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  forward_port: string;

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  domains: string[];

  @IsInt()
  status: number;
}
