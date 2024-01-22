import { Config } from '@api/models/Config/Config';
import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';

@EntityRepository(Config)
export class ConfigRepository extends RepositoryBase<Config> {

  public async get() {
    const result = await this.findOne();

    if (!result) {
      // Create default config
      const config = new Config();
      await this.insert(config);
      return config;
    }

    return result;
  }

  public async applyUpdate(data: Partial<Config>) {
    return this.update(1, data);
  }
}
