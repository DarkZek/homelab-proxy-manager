import { Param, Get, JsonController, Post, UseBefore, Body } from 'routing-controllers';
import { Service } from 'typedi';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { SetupService } from '../../services/Setup/SetupService';
import axios from 'axios';
import https from 'https';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ValidateDomainRequest } from '@base/api/types/requests/Identify/ValidateDomainRequest';
import { regulatorCommand } from '@base/api/regulator/command';
import { ProxyDestinationType } from '@base/api/types/ProxyDestinationType';

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

  @Post('/domain/:domain')
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
      const url = `http://${domain}/.proxy/identify`;
      console.log(`Connecting to ${url}`);
      response = await instance.get(url);
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

      console.log(`Error encountered: ${message}`);
      
      return { success: false, message };
    }

    const id = response.data.id;

    if (id !== process.env.SERVER_IDENTIFIER) {
      throw new Error('Identification check failed.');
    }

    return { success: true };
  }

  @Post('/destination')
  @UseBefore(AuthCheck)
  public async validateDestination(@Body() request: ValidateDomainRequest) {
    let domain = request.host ?? '127.0.0.1';

    if (request.destinationType === ProxyDestinationType.DOCKER) {
      // Lookup IP
      try {
        domain = (await regulatorCommand('docker_ip.' + domain)).trim();
      } catch (e) {
        throw new Error('Could not find docker container.');
      }
    }

    let response;
    try {
      const url = `${request.portIsHttps ? 'https' : 'http'}://${domain}:${request.port}/`;
      console.log(`Connecting to ${url}`);
      const hexEncodedUrl = Array.from(url).map(c => 
        c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) : 
        encodeURIComponent(c).replace(/\%/g,'').toLowerCase()
      ).join('');

      response = await regulatorCommand('curl.' + hexEncodedUrl);
    } catch (e) {
      let message = 'Unknown error.';
      if (e.message?.includes('Connection refused')) {
        message = 'Connection refused.';
      }
      console.log(`Error encountered: ${message} ${e}`);
      return { success: false, message };
    }

    return { success: true };
  }
}
