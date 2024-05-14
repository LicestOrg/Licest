####################################################
# DEVELOPMENT
####################################################

FROM node:22-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

####################################################
# BUILD FOR PRODUCTION
####################################################

FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY --from=development /app/node_modules ./node_modules
COPY . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production \
    && npm cache clean --force

####################################################
# PRODUCTION
####################################################

FROM node:22-alpine As production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

RUN npm install -g vite

CMD [ "npm", "run", "preview", "--", "--host" ]
