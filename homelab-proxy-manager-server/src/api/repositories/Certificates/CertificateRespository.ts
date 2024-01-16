import { EntityRepository } from 'typeorm';
import { RepositoryBase } from '@base/infrastructure/abstracts/RepositoryBase';
import { Certificate } from '../../models/Certificates/Certificate';

@EntityRepository(Certificate)
export class CertificateRepository extends RepositoryBase<Certificate> {
  public async createCertificate(data: object) {
    let entity = new Certificate();

    Object.assign(entity, data);

    return await this.save(entity);
  }

  public async updateCertificate(certificate: Certificate, data: object) {
    Object.assign(certificate, data);

    return await certificate.save(data);
  }
}
