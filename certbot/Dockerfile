FROM alpine:3.7

# Dockerfile
ARG LE_EMAIL
ENV LE_EMAIL ${LE_EMAIL}
ARG LE_DOMAIN
ENV LE_DOMAIN ${LE_DOMAIN}

RUN apk upgrade && apk add --no-cache certbot
CMD /usr/bin/certbot certonly \
              --standalone \
              --agree-tos \
              --staging \
              --email ${LE_EMAIL} \
              -d ${LE_DOMAIN}
