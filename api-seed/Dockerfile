FROM node:9.11-alpine
RUN mkdir /api-seed
WORKDIR /api-seed
COPY . /api-seed
RUN npm install --quiet

# version info
ARG GIT_COMMIT
ENV GIT_COMMIT $GIT_COMMIT

CMD ["npm", "start"]
