import { Param, Get, JsonController, Post, Body, Put, Delete, HttpCode, UseBefore, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { AuthCheck } from '@base/infrastructure/middlewares/Auth/AuthCheck';
import { ControllerBase } from '@base/infrastructure/abstracts/ControllerBase';
import { OpenAPI } from 'routing-controllers-openapi';
import child_process from 'child_process';
import { promisify } from 'node:util';
import fs from 'fs';
import { regulatorCommand } from '@api/regulator/command';

const exec = promisify(child_process.exec);

@Service()
@OpenAPI({
  security: [{ bearerAuth: [] }],
})
@JsonController('/hostsystem')
@UseBefore(AuthCheck)
export class HostSystemController extends ControllerBase {
  public constructor() {
    super();
  }

  @Get('/local_ports')
  public async getAll() {
    const data = await regulatorCommand('local_ports');

    const output = data.trim().split('\n').map((line: string) => {
      const [service, port] = line.split('\t');
      return { service, port };
    });

    return output;
  }
}
