import { Param, Get, JsonController, Post, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { SetupService } from '../../services/Setup/SetupService';
import axios from 'axios';
import https from 'https';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/identify')
export class IdentifyController extends ControllerBase {
  public constructor() {
    super();
  }

  @Get()
  public async getIdentifier() {
    return { id: process.env.SERVER_IDENTIFIER }
  }

  @Post('/:domain')
  @UseBefore(AuthCheck)
  public async validateDomain(@Param('domain') domain: string) {
    // Ignore https errors as security is not a problem as we do not trust user input
    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });

    let response;
    try {
      response = await instance.get(`http://${domain}/.proxy/identify`);
    } catch (e) {
      let message = 'Unknown error.';

      if (e.syscall === 'getaddrinfo') {
        message = 'Domain has no / invalid DNS record.';
      } else if (e.code === 'ECONNREFUSED') {
        message = 'Connection refused.';
      } else if (e.code === 'ECONNRESET') {
        message = 'Connection reset.';
      } else if (e.code === 'ETIMEDOUT') {
        message = 'Connection timed out.';
      }
      
      return { success: false, message };
    }

    const id = response.data.id;

    if (id !== process.env.SERVER_IDENTIFIER) {
      throw new Error('Identification check failed.');
    }

    return { success: true };
  }
}
