import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';
import { Proxy } from '../../models/Proxy/Proxy';

@EntityRepository(Proxy)
export class ProxyRepository extends RepositoryBase<Proxy> {
  public async createProxy(data: object) {
    let entity = new Proxy();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateProxy(proxy: Proxy, data: object) {
    Object.assign(proxy, data);

    return await proxy.save(data);
  }
}
