# Common build stage
FROM node:21-alpine3.18 as common-build-stage

WORKDIR /app/homelab-proxy-manager-server

EXPOSE 3000

# Dvelopment build stage
FROM common-build-stage as development-build-stage

ENV NODE_ENV development

CMD ["npm", "run", "dev"]

# Production build stage
FROM common-build-stage as production-build-stage

ENV NODE_ENV production

CMD ["npm", "run", "start"]