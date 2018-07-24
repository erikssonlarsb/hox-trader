FROM nginx:1.13-alpine
COPY nginx.conf.template /etc/nginx/nginx.conf.template

CMD if [ "$LE_DOMAIN" == "selfsigned" ]; \
      then export CERT_PATH="$LE_DOMAIN"; \
      else export CERT_PATH="letsencrypt/live/$LE_DOMAIN"; fi \
    &&  envsubst '${CERT_PATH}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf \
    &&  nginx -g 'daemon off;'
