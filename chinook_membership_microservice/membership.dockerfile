FROM node:7.2.0-alpine
ENV PORT 4603
ENV NODE_ENV development
ENV POSTGRES_HOST chinookDb
ENV POSTGRES_DATABASE chinook
ENV POSTGRES_USER hussein
ENV POSTGRES_PASS 123456
RUN mkdir -p /membership_microservice
WORKDIR /membership_microservice
COPY ./package.json /membership_microservice
COPY ./package-lock.json /membership_microservice
COPY . /membership_microservice
RUN npm install -g nodemon
RUN npm install
EXPOSE $PORT
CMD ["npm","start"]
