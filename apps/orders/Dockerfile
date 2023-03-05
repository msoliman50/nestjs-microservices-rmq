FROM node:18-alpine AS base
RUN npm i -g pnpm

FROM base AS development

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000

FROM base AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod
COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/orders/main" ]