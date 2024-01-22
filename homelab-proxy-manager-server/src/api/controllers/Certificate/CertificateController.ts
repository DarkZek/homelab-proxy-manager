import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import child_process from 'child_process';
import { promisify } from 'node:util';
import fs from 'fs';
import { regulatorCommand } from '@api/regulator/command';
import { CertificateService } from '@base/api/services/Certificates/CertificateService';
import { HttpsService } from '@base/api/services/Https/HttpsService';

const exec = promisify(child_process.exec);

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/certificates')
@UseBefore(AuthCheck)
export class CertificateController extends ControllerBase {
  public constructor(
    private certificateService: CertificateService,
    private httpsService: HttpsService) {
    super();
  }

  @Get()
  public async getCertificates() {
    return await this.certificateService.getAll();
  }

  @Post('/generate/:domain')
  public async newCertificate(@Param('domain') domain: string) {

    const { expires } = await this.httpsService.requestHttpsCertificate(domain);

    await this.certificateService.create({
       domain,
       expires
    });

    return 'Success'
  }
}
