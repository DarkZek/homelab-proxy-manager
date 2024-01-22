import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ConfigRepository } from '../../repositories/Config/ConfigRepository';
import acme, { Client as AcmeClient } from 'acme-client';
import fs from 'fs';
import { FeatureToggle } from '@base/api/types/FeatureToggle';

@Service({ eager: true })
export class HttpsService {

  client: AcmeClient | undefined = undefined;

  challenges: { [key: string]: string } = {};

  constructor(@InjectRepository() private configRespository: ConfigRepository) {
    // Attempt to load contact email

    configRespository.get().then((config) => {
      const accountPrivateKey = Buffer.from(config.caAccountPrivateKey, 'hex');

      if (config.letsEncryptEnabled === FeatureToggle.Enabled) {
        this.setupClient(accountPrivateKey, config.caAccountUrl);
      }
    })
  }

  public async setup(contactEmail: string) {
    const accountPrivateKey = await acme.crypto.createPrivateKey();

    await this.setupClient(accountPrivateKey);

    await this.client.createAccount({
      termsOfServiceAgreed: true,
      contact: [`mailto:${contactEmail}`]
    });

    const caAccountUrl = this.client.getAccountUrl();

    await this.configRespository.applyUpdate({ 
      caContactEmail: contactEmail,
      caAccountPrivateKey: accountPrivateKey.toString('hex'),
      caAccountUrl,
      letsEncryptEnabled: FeatureToggle.Enabled
    })
  }

  public async disable() {
    await this.configRespository.applyUpdate({ letsEncryptEnabled: FeatureToggle.Disabled })
  }

  private async setupClient(accountKey: Buffer, accountUrl?: string) {
    this.client = new AcmeClient({
        directoryUrl: acme.directory.letsencrypt.production,
        accountKey,
        accountUrl
    });
  }

  public async getTosUrl(): Promise<string> {

    const config = await this.configRespository.get();

    if (config.letsEncryptEnabled !== FeatureToggle.Enabled) {
      throw new Error('Let\'s Encrypt is not enabled');
    }

    return this.client.getAccountUrl();
  }

  public async requestHttpsCertificate(domain: string) {

    const config = await this.configRespository.get();

    if (config.letsEncryptEnabled !== FeatureToggle.Enabled) {
      throw new Error('Let\'s Encrypt is not enabled');
    }

    console.log(`Running requestHttpsCertificate for domain ${domain}`)

    const order = await this.client.createOrder({
        identifiers: [
            { type: 'dns', value: domain },
        ]
    });

    const authorizations = await this.client.getAuthorizations(order);

    // Fetch the http authorization challenge
    const authorization = authorizations[0]
    const challenge = authorization.challenges[0]

    const keyAuthorization = await this.client.getChallengeKeyAuthorization(challenge);

    this.challenges[challenge.token] = keyAuthorization;

    await this.client.verifyChallenge(authorization, challenge);

    await this.client.completeChallenge(challenge);

    await this.client.waitForValidStatus(challenge);

    delete this.challenges[challenge.token];

    const [key, csr] = await acme.crypto.createCsr({
      commonName: domain,
      altNames: [domain]
    });

    const finalized = await this.client.finalizeOrder(order, csr);
    const cert = await this.client.getCertificate(finalized);

    fs.writeFileSync(`${process.env.NGINX_PATH}certificates/${domain}.key`, key.toString());
    fs.writeFileSync(`${process.env.NGINX_PATH}certificates/${domain}.crt`, cert.toString());

    console.log(`Successfully requested certificate for ${domain}`)

    return 'Success'
  }

  public async handleChallengeRequest(challenge_id: string): Promise<string> {
    if (this.challenges[challenge_id] === undefined) {
      console.warn('Recieved challenge request for unknown challenge id ' + challenge_id)
    } else {
      console.log('Recieved challenge request for challenge id ' + challenge_id)
      return this.challenges[challenge_id];
    }
  }
}