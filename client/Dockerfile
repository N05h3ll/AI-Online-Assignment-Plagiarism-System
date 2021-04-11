FROM node:15.14.0-alpine3.13
COPY . /app/
WORKDIR /app
RUN npm install -g npm@latest
RUN npm install
EXPOSE 3000
CMD ["npm","run", "serve"]