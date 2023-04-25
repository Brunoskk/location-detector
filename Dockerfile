FROM node:18

WORKDIR /src

ADD ./ /src/

RUN npm i --verbose

RUN npm run build

CMD ["npm", "run", "start"]