import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { UserUpdateRequest } from '@api/requests/Users/UserUpdateRequest';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import { ProxyService } from '../../services/Proxy/ProxyService';
import { ProxyCreateRequest } from '../../requests/Proxy/ProxyCreateRequest';
import { ProxyUpdateRequest } from '../../requests/Proxy/ProxyUpdateRequest';

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/proxy')
@UseBefore(AuthCheck)
export class ProxyController extends ControllerBase {
  public constructor(private proxyService: ProxyService) {
    super();
  }

  @Get()
  public async getAll(@QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.proxyService.getAll(resourceOptions);
  }

  @Get('/:id([0-9]+)')
  public async getOne(@Param('id') id: number, @QueryParams() parseResourceOptions: RequestQueryParser) {
    const resourceOptions = parseResourceOptions.getAll();

    return await this.proxyService.findOneById(id, resourceOptions);
  }

  @Post('/update')
  public async updateConfig() {
    return await this.proxyService.updateNginxConfigs();
  }

  @Post()
  @HttpCode(201)
  public async create(@Body() proxy: ProxyCreateRequest) {
    return await this.proxyService.create(proxy);
  }

  @Put('/:id')
  public async update(@Param('id') id: number, @Body() user: ProxyUpdateRequest) {
    return await this.proxyService.updateOneById(id, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  public async delete(@Param('id') id: number) {
    return await this.proxyService.deleteOneById(id);
  }
}
