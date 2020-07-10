FROM node:12-buster-slim

WORKDIR /app

ENV SSM_PORT=4583
ENV AWS_REGION=us-east-1
ENV SSM_PRELOAD_DIRECTORY=/parameters

COPY package.json /app
RUN npm install --production

COPY index.js /app

CMD [ "npm", "start" ]
