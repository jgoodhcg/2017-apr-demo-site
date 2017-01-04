# docker.nginx

FROM nginx

RUN mkdir /wwwroot
COPY nginx.conf /etc/nginx/nginx.conf
RUN service nginx start