FROM alpine:3.7

# Dockerfile
ARG COMMON_NAME
ENV COMMON_NAME ${COMMON_NAME}
ARG KEY_NAME
ENV KEY_NAME ${KEY_NAME}

RUN apk add --no-cache openssl
CMD /usr/bin/openssl req \
          -new -sha256 -nodes -out /certs/${KEY_NAME}.csr \
          -newkey rsa:4096 -subj "/C=/ST=/L=/O=/CN=${COMMON_NAME}" \
          -keyout /certs/${KEY_NAME}.key \
    && \
    /usr/bin/openssl x509 \
          -req -days 365 \
          -in /certs/${KEY_NAME}.csr -signkey /certs/${KEY_NAME}.key \
          -out /certs/${KEY_NAME}.crt
