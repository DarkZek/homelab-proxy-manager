import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { HttpsService } from '@api/services/Https/HttpsService';
import { HttpsSetupRequest } from '@api/types/requests/Https/HttpsSetupRequest';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('')
@UseBefore(AuthCheck)
export class HttpsController extends ControllerBase {
  public constructor(private httpsService: HttpsService) {
    super();
  }

  @Post('/https/setup')
  public async setupHttps(@Body() request: HttpsSetupRequest) {

    if (!request.tos) {
      throw new Error('You must accept terms and conditions');
    }

    await this.httpsService.setup(request.email)

    return 'Success'
  }
}
