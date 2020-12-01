FROM node:14.15.1-alpine

WORKDIR /usr/bin/app

COPY . .

LABEL app=stalker-bot

RUN yarn install
RUN yarn build

CMD [ "yarn", "start" ]