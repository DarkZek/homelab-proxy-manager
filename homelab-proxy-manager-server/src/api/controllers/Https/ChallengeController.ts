import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams, ContentType, Controller } from 'routing-controllers';
import { Service } from 'typedi';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { HttpsService } from '@api/services/Https/HttpsService';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@Controller('')
export class HttpsController extends ControllerBase {
  public constructor(private httpsService: HttpsService) {
    super();
  }
  @Get('/.well-known/acme-challenge/:challenge_id')
  @ContentType("text/plain")
  public async handleChallenge(@Param('challenge_id') challenge_id: string) {
    return this.httpsService.handleChallengeRequest(challenge_id);
  }
}
