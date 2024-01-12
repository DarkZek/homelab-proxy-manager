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

  client: AcmeClient | undefined = undefined;

  challenges: { [key: string]: string } = {};

  constructor(@InjectRepository() private proxyRepository: ProxyRepository) {
    // Attempt to load contact email
    // TODO: Store this in a more central location
    if (fs.existsSync('./https_config.json')) {
      const config = JSON.parse(fs.readFileSync('./https_config.json').toString())
      this.contactEmail = config.contactEmail;
      this.accountPrivateKey = Buffer.from(config.accountPrivateKey, 'hex');
    }

    if (this.contactEmail !== undefined && this.accountPrivateKey !== undefined) {
      this.setupClient();
    }
  }

  public async setup(contactEmail: string) {
    this.contactEmail = contactEmail;
    this.accountPrivateKey = await acme.crypto.createPrivateKey()

    // Save to file
    // TODO: Store this in a more central location
    fs.writeFileSync('./https_config.json', JSON.stringify({ contactEmail: this.contactEmail, accountPrivateKey: this.accountPrivateKey.toString('hex') }), undefined);

    await this.setupClient();
  }

  private async setupClient() {
    this.client = new AcmeClient({
        directoryUrl: acme.directory.letsencrypt.staging,
        accountKey: this.accountPrivateKey
    });

    await this.client.createAccount({
        termsOfServiceAgreed: true,
        contact: [`mailto:${this.contactEmail}`]
    });
  }

  public async requestHttpsCertificate(id: number) {

    const proxy = await this.proxyRepository.getOneById(id);

    if (proxy === undefined) {
      throw new Error('Proxy not found');
    }

    console.log(`Running requestHttpsCertificate for proxy ${proxy.id} with domains ${proxy.domains.join(', ') }`)

    const order = await this.client.createOrder({
        identifiers: [
            { type: 'dns', value: proxy.domains[0] },
        ]
    });

    const authorizations = await this.client.getAuthorizations(order);

    // Fetch the http authorization challenge
    const authorization = authorizations[0]
    const challenge = authorization.challenges[0]
    console.log('cha')

    const keyAuthorization = await this.client.getChallengeKeyAuthorization(challenge);

    this.challenges[challenge.token] = keyAuthorization;

    //console.log({ keyAuthorization, challenge })

    console.log('waa')

    await this.client.verifyChallenge(authorization, challenge);
    console.log('he')

    await this.client.completeChallenge(challenge);

    await this.client.waitForValidStatus(challenge);

    delete this.challenges[challenge.token];

    const [key, csr] = await acme.crypto.createCsr({
      commonName: proxy.domains[0],
      altNames: [proxy.domains[0]]
    });

    const finalized = await this.client.finalizeOrder(order, csr);
    const cert = await this.client.getCertificate(finalized);

    console.log(`CSR:\n${csr.toString()}`);
    console.log(`Private key:\n${key.toString()}`);
    console.log(`Certificate:\n${cert.toString()}`);

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