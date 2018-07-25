FROM node:9.11-alpine
RUN mkdir /client
WORKDIR /client
COPY . /client
RUN npm install --quiet --no-optional
RUN $(npm bin)/ng build --prod
