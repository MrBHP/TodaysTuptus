FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=build /app/.output ./.output
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/package.json ./package.json

RUN mkdir -p /app/photos && chown -R node:node /app/photos
VOLUME /app/photos

USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
