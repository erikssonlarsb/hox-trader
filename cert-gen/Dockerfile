FROM node:9.11-alpine
RUN mkdir /cert-gen
WORKDIR /cert-gen
COPY . /cert-gen

RUN apk add --no-cache openssl

RUN npm install --quiet
CMD ["npm", "start"]
