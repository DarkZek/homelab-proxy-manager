import { EventSubscriber, On } from 'event-dispatch';
import { SendWelcomeMail } from '@api/queue-jobs/Users/SendWelcomeMail';

@EventSubscriber()
export class ProxyEvent {
  @On('onProxyCreate')
  public onProxyCreate(proxy: any) {
    console.log('Proxy ' + JSON.stringify(proxy) + ' created! Time to do nginx');
  }
}
