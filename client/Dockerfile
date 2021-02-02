FROM node:15.6.0-alpine
COPY . /app/
WORKDIR /app
RUN npm install -g npm@latest
RUN npm install
EXPOSE 3000
CMD ["npm","run", "serve"]