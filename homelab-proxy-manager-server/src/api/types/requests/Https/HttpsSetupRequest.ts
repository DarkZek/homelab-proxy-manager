import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';

export class HttpsSetupRequest {
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsBoolean()
  tos: boolean;
}
