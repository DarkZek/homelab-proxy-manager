import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { UserService } from '@api/services/Users/UserService';
import { Service } from 'typedi';
import { UserCreateRequest } from '@api/types/requests/Users/UserCreateRequest';
import { UserUpdateRequest } from '@api/types/requests/Users/UserUpdateRequest';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { SetupService } from '../../services/Setup/SetupService';
import { HttpsService } from '@base/api/services/Https/HttpsService';
import { FeatureToggle } from '@base/api/types/FeatureToggle';
import { ConfigRepository } from '@base/api/repositories/Config/ConfigRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/setup')
export class SetupController extends ControllerBase {
  public constructor(
    private setupService: SetupService,
    private httpsService: HttpsService,
    @InjectRepository() private configRespository: ConfigRepository) {
    super();
  }

  @Get()
  public async check() {
    const config = await this.configRespository.get();
    return {
      userCreation: !await this.setupService.isSetupRequired(),
      httpsCreation: config.letsEncryptEnabled !== FeatureToggle.Unset,
      validation: config.validated,
    }
  }

  @Put('/validate')
  public async validate(@Body() request: { status: boolean }) {
    await this.configRespository.applyUpdate({ validated: request.status })
    return 'Success';
  }
}
