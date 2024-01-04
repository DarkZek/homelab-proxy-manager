import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsEnum, IsArray, ArrayMinSize } from 'class-validator';
import { ProxyDestinationType } from '../../types/ProxyDestinationType';

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
}
