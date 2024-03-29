import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { HttpsService } from '@api/services/Https/HttpsService';
import { HttpsSetupRequest } from '@api/types/requests/Https/HttpsSetupRequest';
import { FeatureToggle } from '@base/api/types/FeatureToggle';
import { ConfigRepository } from '@base/api/repositories/Config/ConfigRepository';
import { InjectRepository } from 'typeorm-typedi-extensions';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('')
@UseBefore(AuthCheck)
export class HttpsController extends ControllerBase {
  public constructor(
    private httpsService: HttpsService,
    @InjectRepository() private configRespository: ConfigRepository ) {
    super();
  }

  @Post('/https/setup')
  public async setupHttps(@Body() request: HttpsSetupRequest) {

    await this.httpsService.setup(request.email)

    return 'Success'
  }

  @Get('/https/tos')
  public async tosUrl() {

    const config = await this.configRespository.get();

    if (config.letsEncryptEnabled !== FeatureToggle.Enabled) {
      throw new Error('Https is not enabled');
    }

    return await this.httpsService.client.getTermsOfServiceUrl();
  }

  @Get('/https/validate')
  public async validateConnection() {

    const config = await this.configRespository.get();

    if (config.letsEncryptEnabled !== FeatureToggle.Enabled) {
      return true;
    }

    try {
      await this.httpsService.client.getAccountUrl();
      return true;
    } catch (e) {

    }

    throw new Error('Validation failed');
  }
}
