FROM postgres:alpine

COPY prisma/migrations /docker-entrypoint-initdb.d

WORKDIR /docker-entrypoint-initdb.d

RUN find * -name \*.sql -exec sh -c \
  'new=$(echo "{}" | tr "/" "-"); mv "{}" "$new"' \;
