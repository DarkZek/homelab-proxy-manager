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
@JsonController('/docker')
@UseBefore(AuthCheck)
export class DockerController extends ControllerBase {
  public constructor() {
    super();
  }

  @Get('/containers')
  public async getContainers() {
    const data = await regulatorCommand('docker_containers');

    const output = data.trim().split('\n').map((line: string) => {
      const [name, id] = line.split('\t');
      return { name, id };
    });

    return output;
  }

  @Get('/ports/:container_id')
  public async getPorts(@Param('container_id') container_id: string) {

    if (Number.isNaN(parseInt(container_id, 16))) {
      // Invalid container id
      throw new Error(`Invalid container id ${container_id}`)
    }

    const data = await regulatorCommand(`docker_ports.${container_id}`);

    const output = data.trim().split('\n');

    return output;
  }
}
