import { Service } from 'typedi';
import { UserNotFoundException } from '@api/exceptions/Users/UserNotFoundException';
import { EventDispatcher, EventDispatcherInterface } from '@base/decorators/EventDispatcher';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ProxyRepository } from '../../repositories/Proxy/ProxyRepository';

@Service()
export class ProxyService {
  constructor(@InjectRepository() private proxyRepository: ProxyRepository, @EventDispatcher() private eventDispatcher: EventDispatcherInterface) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.proxyRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedProxyOrFail(id, resourceOptions);
  }

  public async create(data: object) {
    let proxy = await this.proxyRepository.createUser(data);

    this.eventDispatcher.dispatch('onProxyCreate', proxy);

    return proxy;
  }

  public async updateOneById(id: number, data: object) {
    const proxy = await this.getRequestedProxyOrFail(id);

    this.eventDispatcher.dispatch('onProxyUpdate', proxy);

    return await this.proxyRepository.updateUser(proxy, data);
  }

  public async deleteOneById(id: number) {
    const proxy = await this.getRequestedProxyOrFail(id);

    this.eventDispatcher.dispatch('onProxyDelete', proxy);

    return await this.proxyRepository.delete(id);
  }

  private async getRequestedProxyOrFail(id: number, resourceOptions?: object) {
    let proxy = await this.proxyRepository.getOneById(id, resourceOptions);

    if (!proxy) {
      throw new UserNotFoundException();
    }

    return proxy;
  }
}
