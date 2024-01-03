import { ProxyJobUpdateAllProxies } from '../../queue-jobs/Proxy/NginxConfigQueue';
import { Service } from 'typedi';
import { UserNotFoundException } from '@api/exceptions/Users/UserNotFoundException';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ProxyRepository } from '../../repositories/Proxy/ProxyRepository';
import NginxConfigQueue, { ProxyJob } from '../../queue-jobs/Proxy/NginxConfigQueue';

@Service()
export class ProxyService {
  constructor(@InjectRepository() private proxyRepository: ProxyRepository) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.proxyRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedProxyOrFail(id, resourceOptions);
  }

  public async create(data: object) {
    let proxy = await this.proxyRepository.createProxy(data);

    return proxy;
  }

  public async updateOneById(id: number, data: object) {
    const proxy = await this.getRequestedProxyOrFail(id);

    return await this.proxyRepository.updateUser(proxy, data);
  }

  public async deleteOneById(id: number) {
    return await this.proxyRepository.delete(id);
  }

  public async updateNginxConfigs() {

    const proxies = (await this.getAll()).rows

    return await NginxConfigQueue.dispatch({
      type: 'UPDATE_ALL_PROXIES',
      proxies
    });
  }

  private async getRequestedProxyOrFail(id: number, resourceOptions?: object) {
    let proxy = await this.proxyRepository.getOneById(id, resourceOptions);

    if (!proxy) {
      throw new UserNotFoundException();
    }

    return proxy;
  }
}
