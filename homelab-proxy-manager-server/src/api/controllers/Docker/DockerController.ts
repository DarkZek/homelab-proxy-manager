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

  @Get('/ports/:container_name')
  public async getPorts(@Param('container_name') container_name: string) {

    if (!/^[a-zA-Z0-9_-]+$/.test(container_name)) {
      // Invalid container name
      throw new Error(`Invalid container name ${container_name}`)
    }

    const data = await regulatorCommand(`docker_ports.${container_name}`);

    const output = data.trim().split('\n');

    // Remove duplicates
    return [...new Set(output)];
  }
}
