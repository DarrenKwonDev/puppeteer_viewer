#
# ---- Dependencies ----
# Use the official lightweight Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:12-slim AS base
WORKDIR /usr/src/app
COPY . ./
RUN npm install

#---- build ----

FROM base as build
ARG TARGET_ENV
ENV ENVIRONMENT=$TARGET_ENV

RUN npm run build:$TARGET_ENV
RUN rm -rf ./node_modules
RUN npm install -–production

#---- Release ----
FROM node:12-slim AS release
WORKDIR /usr/src/app

# copy production node_modules
COPY --from=build /usr/src/app/node_modules ./node_modules
# copy app sources
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/index.js"]