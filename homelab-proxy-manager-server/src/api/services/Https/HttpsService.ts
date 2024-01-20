import { ProxyJobUpdateAllProxies } from '../../queue-jobs/Proxy/NginxConfigQueue';
import { Service } from 'typedi';
import { UserNotFoundException } from '@api/exceptions/Users/UserNotFoundException';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ProxyRepository } from '../../repositories/Proxy/ProxyRepository';
import NginxConfigQueue, { ProxyJob } from '../../queue-jobs/Proxy/NginxConfigQueue';
import acme, { Client as AcmeClient } from 'acme-client';
import fs from 'fs';

@Service()
export class HttpsService {

  contactEmail: undefined | string = undefined;
  accountPrivateKey: undefined | Buffer = undefined;
  accountUrl: undefined | string = undefined;

  client: AcmeClient | undefined = undefined;

  challenges: { [key: string]: string } = {};

  constructor(@InjectRepository() private proxyRepository: ProxyRepository) {
    // Attempt to load contact email
    // TODO: Store this in a more central location
    if (fs.existsSync('./https_config.json')) {
      const config = JSON.parse(fs.readFileSync('./https_config.json').toString())
      this.contactEmail = config.contactEmail;
      this.accountPrivateKey = Buffer.from(config.accountPrivateKey, 'hex');
      this.accountUrl = config.accountUrl;
    }

    if (this.contactEmail !== undefined && this.accountPrivateKey !== undefined) {
      this.setupClient();
    }
  }

  public async setup(contactEmail: string) {
    this.contactEmail = contactEmail;
    this.accountPrivateKey = await acme.crypto.createPrivateKey()

    await this.setupClient();

    // Save to file
    // TODO: Store this in a more central location
    fs.writeFileSync('./https_config.json', JSON.stringify({
      contactEmail: this.contactEmail,
      accountPrivateKey: this.accountPrivateKey.toString('hex'),
      accountUrl: this.accountUrl
    }), undefined);
  }

  private async setupClient() {

    this.client = new AcmeClient({
        directoryUrl: acme.directory.letsencrypt.production,
        accountKey: this.accountPrivateKey,
        accountUrl: this.accountUrl
    });

    await this.client.createAccount({
        termsOfServiceAgreed: true,
        contact: [`mailto:${this.contactEmail}`]
    });

    this.accountUrl = this.client.getAccountUrl();
  }

  public async requestHttpsCertificate(domain: string) {

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