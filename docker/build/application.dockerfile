FROM node:19.6-alpine3.17 as base

WORKDIR /usr/src/app/

COPY package.json yarn.lock ./
COPY prisma/schema.prisma prisma/



FROM base as build

WORKDIR /usr/src/app/

COPY tsconfig.json ./
COPY source source

RUN yarn install --frozen-lockfile \
  && yarn prisma generate \
  && yarn build --outDir dist



FROM base

WORKDIR /usr/src/app/

COPY --from=build usr/src/app/dist dist

RUN yarn install --production --frozen-lockfile \
  && yarn cache clean

CMD [ "node", "dist/main.js" ]
