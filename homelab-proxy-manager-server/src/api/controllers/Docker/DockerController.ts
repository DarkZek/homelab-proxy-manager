import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import { RequestQueryParser } from 'typeorm-simple-query-parser';
import child_process from 'child_process';
import { promisify } from 'node:util';

const exec = promisify(child_process.exec);

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/docker')
@UseBefore(AuthCheck)
export class ProxyController extends ControllerBase {
  public constructor() {
    super();
  }

  @Get()
  public async getAll() {
    const data = (await exec('docker ps --format \'{{json .Image}}\'')).stdout

    let rows = data.split('\n').map((v) => v.substring(1, v.length - 1))

    console.log(rows)

    return rows;
  }
}
