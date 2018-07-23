FROM node:9.11-alpine
RUN mkdir /certproxy
WORKDIR /certproxy
COPY . /certproxy
RUN apk add --no-cache openssl
RUN apk add --update certbot
RUN npm install --quiet
CMD ["npm", "start"]
