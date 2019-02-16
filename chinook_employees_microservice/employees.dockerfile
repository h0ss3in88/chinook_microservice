FROM node:8.2.0-alpine
ENV PORT 4603
ENV NODE_ENV development
ENV POSTGRES_HOST chinookDb
ENV POSTGRES_DATABASE chinook
ENV POSTGRES_USER hussein
ENV POSTGRES_PASS 123456
RUN mkdir -p /employees_microservice
WORKDIR /employees_microservice
COPY ./package.json /employees_microservice
COPY ./package-lock.json /employees_microservice
COPY . /employees_microservice
RUN npm install --only=production
EXPOSE $PORT
CMD ["npm","start"]
