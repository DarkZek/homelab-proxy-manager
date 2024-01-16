import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { ProxyDestinationType } from '../../ProxyDestinationType';

export class ValidateDomainRequest {
  @IsEnum(ProxyDestinationType)
  destinationType: ProxyDestinationType;

  @IsString()
  @IsOptional()
  host: string;

  @IsString()
  port: string;

  @IsBoolean()
  portIsHttps: boolean;
}
