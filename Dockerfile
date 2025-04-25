FROM node:slim AS build
LABEL authors="taras-hamkalo"

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build

FROM nginx:latest AS runtime
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/plagdet/browser /usr/share/nginx/html
COPY ./nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80
