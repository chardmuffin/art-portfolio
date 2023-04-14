FROM node:lts-alpine
ARG NODE_ENV
ARG RDS_HOSTNAME
ARG RDS_PORT
ENV NODE_ENV=${NODE_ENV}
ENV RDS_HOSTNAME=${RDS_HOSTNAME}
ENV RDS_PORT=${RDS_PORT}

WORKDIR /usr/src/app/server

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm ci --production --silent

COPY . .
EXPOSE 3001
RUN chown -R node:node /usr/src/app/server
RUN chmod +x ./wait-for-it.sh

USER node
CMD ./wait-for-it.sh ${RDS_HOSTNAME}:${RDS_PORT} -- npm run start