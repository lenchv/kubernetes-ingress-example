FROM node:12.7-alpine

RUN mkdir /app

WORKDIR /app

COPY ./src/* ./
RUN npm install

ENTRYPOINT [ "node", "index.js" ]
