FROM registry.ascora.eu:8443/base/base-alpine-php:latest
RUN rm -f /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
