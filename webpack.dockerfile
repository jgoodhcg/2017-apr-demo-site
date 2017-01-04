# docker.webpack

FROM ubuntu:latest

WORKDIR /app
COPY ./ /app

RUN apt-get update
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - && apt-get install nodejs -y
RUN npm install webpack -g

WORKDIR src
RUN npm install
CMD npm install
CMD cp /app/src/resources/favicon.ico /wwwroot/favicon.ico
CMD cp -r /app/src/resources/imgs /wwwroot
CMD webpack --watch --watch-polling

