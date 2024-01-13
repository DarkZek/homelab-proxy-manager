chown $USER:$USER -R ./homelab-proxy-manager-client/dist
chown $USER:$USER -R ./homelab-proxy-manager-server/node_modules

cd ../homelab-proxy-manager-client
npm ci
npm run build

openssl req -x509 -newkey rsa:4096 -keyout ./nginx/certificates/self-signed.key -out ./nginx/certificates/self-signed.crt -sha256 -days 3650 -nodes -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"
