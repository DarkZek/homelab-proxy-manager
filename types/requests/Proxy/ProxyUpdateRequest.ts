import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsEnum, IsArray, ArrayMinSize, IsOptional } from 'class-validator';
import { ProxyDestinationType } from '../../types/ProxyDestinationType';

export class ProxyUpdateRequest {
  @IsEnum(ProxyDestinationType)
  @IsOptional()
  forward_type: ProxyDestinationType;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  forward_ip: string;

  @MaxLength(20)
  @MinLength(2)
  @IsString()
  @IsOptional()
  forward_port: string;

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsOptional()
  domains: string[];
}
