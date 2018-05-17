FROM alpine:3.7

# Dockerfile
ARG ADMIN_USER_PASSWORD
ENV ADMIN_USER_PASSWORD ${ADMIN_USER_PASSWORD}

RUN apk add --no-cache curl
CMD /usr/bin/curl -X PUT 'http://server:4000/api/users/000000000000000000000003' \
      --user admin1:admin1 \
      --retry 5 --retry-delay 5 --retry-connrefused \
      --header 'Content-Type: application/json' \
      -d '{"password":"'${ADMIN_USER_PASSWORD}'"}'
