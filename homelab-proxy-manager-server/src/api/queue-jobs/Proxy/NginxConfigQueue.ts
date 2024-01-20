import { QueueJobBase } from '@base/infrastructure/abstracts/QueueJobBase';
import { Proxy } from '../../models/Proxy/Proxy';
import * as fs from 'fs';
import child_process from 'child_process';
import { promisify } from 'node:util';
import { regulatorCommand } from '../../regulator/command';
import { ProxyDestinationType } from '../../types/ProxyDestinationType';

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
          await this.updateProxy(config);
        }

        // Get all configs files
        const configs = fs.readdirSync(`${process.env.NGINX_PATH}sites-enabled/`);

        // Find the ones that weren't included
        const configsToRemove = configs.filter(config => {
          // Dont remove configs created manually
          if (!config.endsWith('.automatic.conf')) { return false; } 
          return !job.proxies.some(proxy => `${proxy.id}.automatic.conf` === config);
        });

        // Remove them
        for (const config of configsToRemove) {
          fs.unlinkSync(`${process.env.NGINX_PATH}sites-enabled/${config}`);
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
    await regulatorCommand('reload_nginx')
  }

  private async updateProxy(config: Proxy) {
    console.debug(`Updating proxy with id ${config.id}`);

    let ip = config.forwardIp;

    if (config.destinationType === ProxyDestinationType.DOCKER) {
      // Lookup IP
      ip = (await regulatorCommand('docker_ip.' + config.forwardIp)).trim();
    }

    const httpsConfig = `
      server {

        listen 443 ssl;

        ssl_certificate     /etc/nginx/certificates/${config.domain}.crt;
        ssl_certificate_key /etc/nginx/certificates/${config.domain}.key;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        
        server_name ${ config.domain };
        location / {
            proxy_pass ${ config.forwardHttps ? 'https' : 'http' }://${ip}:${config.forwardPort};
            proxy_http_version 1.1;
    
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /.well-known/acme-challenge {
          proxy_pass http://127.0.0.1:3000/api/.well-known/acme-challenge;
          proxy_http_version 1.1;

          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /.proxy/identify {
            proxy_pass http://127.0.0.1:3000/api/identify;
            proxy_http_version 1.1;
    
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
      }`;
      
      const httpConfig = `
      server {
        server_name ${ config.domain };
        listen 80;

        location /.well-known/acme-challenge {
          proxy_pass http://127.0.0.1:3000/api/.well-known/acme-challenge;
          proxy_http_version 1.1;

          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /.proxy/identify {
            proxy_pass http://127.0.0.1:3000/api/identify;
            proxy_http_version 1.1;
    
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location / {
          proxy_pass ${ config.forwardHttps ? 'https' : 'http' }://${ip}:${config.forwardPort};
          proxy_http_version 1.1;
  
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
        }
      }
    `;

    const nginxConfig = config.supportsHttps ? httpsConfig + httpConfig : httpConfig;

    fs.writeFileSync(`${process.env.NGINX_PATH}sites-enabled/${config.id}.automatic.conf`, nginxConfig);
  }
}

export default new NginxConfigQueue();