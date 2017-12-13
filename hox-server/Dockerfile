FROM node:argon
RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install --quiet
COPY . /app
CMD ["npm", "start"]
