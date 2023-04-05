FROM node:lts-alpine
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app/client

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent

COPY . .
RUN chown -R node:node /usr/src/app/client

USER node
RUN npm run build
      
CMD ["npm", "run", "serve"]