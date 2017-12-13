FROM node:argon
RUN mkdir /server
WORKDIR /server
COPY package.json /server
RUN npm install --quiet
COPY . /server
CMD ["npm", "start"]
