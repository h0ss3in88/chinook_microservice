FROM node:8.2.0-alpine
ENV PORT 4601
ENV NODE_ENV development
ENV POSTGRES_HOST chinookDb
ENV POSTGRES_DATABASE chinook
ENV POSTGRES_USER hussein
ENV POSTGRES_PASS 123456
RUN mkdir -p /movies_microservice
WORKDIR /movies_microservice
COPY ./package.json /movies_microservice
COPY ./package-lock.json /movies_microservice
COPY . /movies_microservice
RUN npm install --only=production
EXPOSE $PORT
CMD ["npm","start"]
