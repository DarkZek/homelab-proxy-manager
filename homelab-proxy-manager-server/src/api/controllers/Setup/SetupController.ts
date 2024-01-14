import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { UserService } from '@api/services/Users/UserService';
import { Service } from 'typedi';
import { UserCreateRequest } from '@api/types/requests/Users/UserCreateRequest';
import { UserUpdateRequest } from '@api/types/requests/Users/UserUpdateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { LoggedUser } from '@base/decorators/LoggedUser';
import { LoggedUserInterface } from '@api/interfaces/users/LoggedUserInterface';
import { SetupService } from '../../services/Setup/SetupService';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/setup')
export class SetupController extends ControllerBase {
  public constructor(private setupService: SetupService) {
    super();
  }

  @Get()
  public async check() {
    return await this.setupService.isSetupRequired();
  }
}
