FROM node:latest
RUN mkdir /server
WORKDIR /server
COPY . /server
RUN npm install --quiet
CMD ["npm", "start"]
