FROM node:14.11.0-alpine3.12

# RUN useradd -ms /bin/bash api-quien-me-debe
# USER api-quien-me-debe
# WORKDIR /home/api-quien-me-debe
WORKDIR /home/app

COPY "package.json" "./"
COPY "package-lock.json" "./"
RUN npm ci

COPY . .

RUN npm prune --production
RUN npm cache clean --force

EXPOSE 5000

CMD [ "node", "src/bin/www" ]
