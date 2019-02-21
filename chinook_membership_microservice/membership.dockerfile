FROM node:8.2.0-alpine
ENV PORT 4602
ENV NODE_ENV development
ENV POSTGRES_HOST chinookDb
ENV POSTGRES_DATABASE chinook
ENV POSTGRES_USER hussein
ENV POSTGRES_PASS 123456
ENV REDIS_HOST membershipDb
ENV REDIS_PORT 6379
RUN mkdir -p /membership_microservice
WORKDIR /membership_microservice
COPY ./package.json /membership_microservice
COPY ./package-lock.json /membership_microservice
COPY . /membership_microservice
RUN npm install --only=production
EXPOSE $PORT
CMD ["npm","start"]
