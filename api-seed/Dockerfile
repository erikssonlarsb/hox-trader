FROM node:9.11-alpine
RUN mkdir /api-seed
WORKDIR /api-seed
COPY . /api-seed
RUN npm install --quiet
CMD ["npm", "start"]
