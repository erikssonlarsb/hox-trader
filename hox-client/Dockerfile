FROM node:latest
RUN mkdir /client
WORKDIR /client
COPY . /client
RUN npm install --quiet
CMD ["npm", "start"]
