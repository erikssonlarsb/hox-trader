FROM node:9.11-alpine
RUN mkdir /client
WORKDIR /client
COPY . /client
RUN npm install --quiet
RUN npm install -g @angular/cli@1.6.5

CMD if [ "$LE_DOMAIN" == "selfsigned" ]; \
      then export PUBLIC_HOST=""; \
      else export PUBLIC_HOST="--public-host $LE_DOMAIN"; fi \
    && ng serve --prod --host 0.0.0.0 --live-reload false ${PUBLIC_HOST} --proxy-config proxy.conf.prod.json
