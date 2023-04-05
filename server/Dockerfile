FROM node:lts-alpine
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app/server

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm ci --production --silent

COPY . .
EXPOSE 3001
RUN chown -R node:node /usr/src/app/server

USER node
CMD ["./wait-for-it.sh", "db:3306", "--", "npm", "run", "start"]