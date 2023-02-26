FROM postgres:15.2-alpine3.17

COPY prisma/migrations /docker-entrypoint-initdb.d

WORKDIR /docker-entrypoint-initdb.d

RUN find * -name \*.sql -exec sh -c \
  'new=$(echo "{}" | tr "/" "-"); mv "{}" "$new"' \;
