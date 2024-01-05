import { JsonController, Body, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { LoginService } from '@api/services/Auth/LoginService';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { LoginRequest } from '@api/types/requests/Auth/LoginRequest';

@Service()
@OpenAPI({
  tags: ['Auth'],
})
@JsonController('/login')
export class LoginController extends ControllerBase {
  public constructor(private loginService: LoginService) {
    super();
  }

  @Post()
  public async login(@Body() user: LoginRequest) {
    return await this.loginService.login(user);
  }
}
