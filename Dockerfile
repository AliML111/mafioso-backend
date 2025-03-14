FROM node:alpine as builder

WORKDIR /app

COPY ./src/package*.json ./

RUN npm install

FROM node:alpine

ARG APP_PORT=3000

WORKDIR /app

COPY  --from=builder --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node ./src/ ./

EXPOSE ${APP_PORT}

CMD ["npm", "run", "dev"]