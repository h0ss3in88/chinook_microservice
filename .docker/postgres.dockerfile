FROM postgres:9.6.1-alpine
ENV POSTGRES_USER=hussein
ENV POSTGRES_PASSWORD=123456
ENV POSTGRES_DB=chinook
ENV ALLOW_IP_RANGE=0.0.0.0/0
ENV IP_LIST=<*>
EXPOSE 5435
COPY ./chinook.sql /docker-entrypoint-initdb.d
