FROM node:9.11-alpine
RUN mkdir /client
WORKDIR /client
COPY . /client
RUN npm install --quiet
CMD ["npm", "start"]
