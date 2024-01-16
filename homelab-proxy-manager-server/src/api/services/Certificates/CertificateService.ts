import { Service } from 'typedi';
import { UserNotFoundException } from '@api/exceptions/Users/UserNotFoundException';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CertificateRepository } from '@base/api/repositories/Certificates/CertificateRespository';

@Service()
export class CertificateService {
  constructor(@InjectRepository() private certificateRepository: CertificateRepository) {
    //
  }

  public async getAll(resourceOptions?: object) {
    return await this.certificateRepository.getManyAndCount(resourceOptions);
  }

  public async findOneById(id: number, resourceOptions?: object) {
    return await this.getRequestedCertificateOrFail(id, resourceOptions);
  }

  public async create(data: object) {
    let cert = await this.certificateRepository.createCertificate(data);

    return cert;
  }

  public async updateOneById(id: number, data: object) {
    const cert = await this.getRequestedCertificateOrFail(id);

    return await this.certificateRepository.updateCertificate(cert, data);
  }

  public async deleteOneById(id: number) {
    return await this.certificateRepository.delete(id);
  }

  private async getRequestedCertificateOrFail(id: number, resourceOptions?: object) {
    let cert = await this.certificateRepository.getOneById(id, resourceOptions);

    return cert;
  }
}
