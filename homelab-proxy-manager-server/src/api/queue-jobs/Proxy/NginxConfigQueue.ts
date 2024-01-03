import { QueueJobBase } from '@base/infrastructure/abstracts/QueueJobBase';
import { Proxy } from '../../models/Proxy/Proxy';
import * as fs from 'fs';
import child_process from 'child_process';
import { promisify } from 'node:util';

const exec = promisify(child_process.exec);

export type ProxyJob = ProxyJobUpdateAllProxies | ProxyJobUpdateOneProxy;

export interface ProxyJobUpdateAllProxies {
  type: 'UPDATE_ALL_PROXIES';
  proxies: Proxy[];
}

export interface ProxyJobUpdateOneProxy {
  type: 'UPDATE_ONE_PROXY';
  proxy: Proxy;
}

class NginxConfigQueue extends QueueJobBase<ProxyJob, void> {
  /**
   * Execute the job.
   */
  protected async handle(job: ProxyJob) {
    switch (job.type) {
      case 'UPDATE_ALL_PROXIES':
        console.log('Updating all proxies');

        for (const config of job.proxies) {
          this.updateProxy(config);
        }

        // Get all configs files
        const configs = fs.readdirSync(`${process.env.NGINX_PATH}/sites-enabled/`);

        // Find the ones that weren't included
        const configsToRemove = configs.filter(config => {
          return !job.proxies.some(proxy => `${proxy.id}.conf` === config);
        });

        // Remove them
        for (const config of configsToRemove) {
          fs.unlinkSync(`${process.env.NGINX_PATH}/sites-enabled/${config}`);
          console.log('Deleting nginx config', config)
        }

        break;
      case 'UPDATE_ONE_PROXY':
        console.log('Updating one proxy');
        this.updateProxy(job.proxy);
        break;
    }

    // Update nginx
    console.log('Updating nginx')
    await exec('nginx -s reload')
  }

  private updateProxy(config: Proxy) {
    console.debug(`Updating proxy with id ${config.id}`);

    const nginxConfig = `
      server {
        server_name ${ config.domains.join(' ') };
        location / {
            proxy_pass http://${config.forward_ip}:${config.forward_port};
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
    
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
      }
      server {
          return 301 https://$host$request_uri;
          server_name ${ config.domains.join(' ') };
          listen 80;
      }
    `

    fs.writeFileSync(`${process.env.NGINX_PATH}/sites-enabled/${config.id}.conf`, nginxConfig);
  }
}

export default new NginxConfigQueue();