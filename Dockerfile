FROM nginx:latest

ENV BUILDZ_API=api

ADD dist/build-bro-ui /usr/share/nginx/build-bro-ui
ADD default.conf.template /etc/nginx/templates/default.conf.template

