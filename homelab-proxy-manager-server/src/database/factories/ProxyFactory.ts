import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Proxy } from '@base/api/models/Proxy/Proxy';
import { ProxyDestinationType } from '@api/types/ProxyDestinationType';

define(Proxy, (faker: typeof Faker) => {
  const proxy = new Proxy();
  proxy.forward_type = ProxyDestinationType.DOCKER;
  proxy.forward_port = faker.internet.port().toString();
  proxy.forward_ip = faker.internet.ip();
  proxy.id = faker.random.number();
  proxy.domain = [faker.internet.domainName()];

  return proxy;
});
