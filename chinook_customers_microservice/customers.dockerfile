FROM node:7.2.0-alpine
ENV PORT 4605
ENV NODE_ENV development
ENV POSTGRES_HOST chinookDb
ENV POSTGRES_DATABASE chinook
ENV POSTGRES_USER hussein
ENV POSTGRES_PASS 123456
RUN mkdir -p /customers_microservice
WORKDIR /customers_microservice
COPY ./package.json /customers_microservice
COPY ./package-lock.json /customers_microservice
COPY . /customers_microservice
RUN npm install -g nodemon
RUN npm install
EXPOSE $PORT
CMD ["npm","start"]
