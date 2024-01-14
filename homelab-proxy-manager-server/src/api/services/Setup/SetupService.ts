import { ProxyJobUpdateAllProxies } from '../../queue-jobs/Proxy/NginxConfigQueue';
import { Service } from 'typedi';
import { UserNotFoundException } from '@api/exceptions/Users/UserNotFoundException';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ProxyRepository } from '../../repositories/Proxy/ProxyRepository';
import NginxConfigQueue, { ProxyJob } from '../../queue-jobs/Proxy/NginxConfigQueue';
import acme, { Client as AcmeClient } from 'acme-client';
import { UserRepository } from '../../repositories/Users/UserRepository';

@Service()
export class SetupService {
  constructor(@InjectRepository() private userRepository: UserRepository) {
    //
  }

  public async isSetupRequired() {
    return await this.userRepository.count() === 0;
  }
}
