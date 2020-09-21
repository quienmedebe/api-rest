FROM node:14.11.0-alpine3.12

RUN adduser -D quienmedebe-api-rest
USER quienmedebe-api-rest
WORKDIR /home/quienmedebe-api-rest
EXPOSE 5000

COPY "package.json" "./"
COPY "package-lock.json" "./"
RUN npm ci

COPY . .

RUN npm prune --production


CMD [ "node", "src/bin/www" ]
