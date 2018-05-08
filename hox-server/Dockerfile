FROM node:9.11-alpine
RUN mkdir /server
WORKDIR /server
COPY . /server
RUN npm install --quiet
CMD ["npm", "start"]
