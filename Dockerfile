FROM node:22-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY . .

RUN npm run build

CMD [ "npm", "run", "preview", "--", "--host" ]
