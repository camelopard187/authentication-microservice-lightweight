# 🌻 Authentication Microservice

A simple yet powerful microservice which offers a secure and lightweight method of handling user authentication, making it an excellent choice for developing secure web applications

- Lightweight [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) microservice for authentication based on [JSON web tokens](https://jwt.io/)
- Simple setup using [Docker](https://www.docker.com/), which works in both production and development environments

## 🤸 Getting Started

### 💾 Installation

To get started, you'll need to clone this repository using [Git](https://git-scm.com/)

```bash
$ git clone https://github.com/camelopard187/authentication-microservice-lightweight.git
```

Moreover, you need to generate an [RSA](<https://en.wikipedia.org/wiki/RSA_(cryptosystem)>) private key for the [JWT](https://jwt.io/) signature and validation. You can do this using [OpenSSL](https://www.openssl.org/)

```bash
# Generate an RSA private key for the JWT signature and validation
$ echo "PRIVATE_KEY = \"$(openssl genrsa 2048)\"" >> .env
```

> **Note** - In many Unix-like operating systems [OpenSSL](https://www.openssl.org/) available by default

### 💻 Local

To run the microservice locally, you'll need to set the `DATABASE_URL` and `NODE_ENV` environment variables to the [URL](https://en.wikipedia.org/wiki/URL) of your local [PostgreSQL](https://www.postgresql.org/) database and [Node.js](https://nodejs.org/en) environment, respectively

```env
NODE_ENV = "development"
DATABASE_URL = "postgresql://username:password@localhost:5432/database_name"
```

> **Note** - Please replace the placeholders `"username"`, `"password"`, and `"database_name"` with your preferred values for a personalized experience

Then, install all dependencies with [Yarn](https://yarnpkg.com/) and start the [Express.js](https://expressjs.com/) server

```bash
# Install all dependencies
$ yarn install --frozen-lockfile

# Start the Express.js server
$ yarn start:development
```

> **Note** - Microservice comes with [Prisma](https://www.prisma.io/), which requires [Node.js](https://nodejs.org/) at least v14.17.0

### 🐳 Docker

To run the microservice using [Docker](https://www.docker.com/), you'll need to set up both the database and application containers. Follow these steps to configure the necessary environment variables:

1. Create a [PostgreSQL](https://www.postgresql.org/) database container by configuring the essential environment variables in the `docker/postgres.env` file:

```env
POSTGRES_USER = "username"
POSTGRES_PASSWORD = "password"
POSTGRES_DB = "database_name"
```

> **Note** - Make sure to replace `"username"`, `"password"`, and `"database_name"` with your desired values

2. Configure the application container by adding the following environment variables to the `docker/application.env` file:

```env
NODE_ENV = "production"
DATABASE_URL = "postgresql://username:password@localhost:5432/database_name"
```

> **Note** - Replace `"username"`, `"password"`, and `"database_name"` with the same values you used in the previous step

Once you've made these configurations, you can proceed with running the microservice using [Docker Compose](https://docs.docker.com/compose/)

```bash
$ docker compose -f docker/docker-compose.yaml up -d --build
```

## 🌿 API Reference

The Authentication Microservice [API](https://en.wikipedia.org/wiki/API) provides three endpoints: `register`, `login`, and `refresh`

### 🪪 Register a new user

To register a new user, send a POST request to `/v1/register` with a [JSON](https://www.json.org/) payload that contains the user's `email`, and `password`

```bash
$ curl -X POST http://localhost:3000/v1/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "sarahkim@gmail.com",
    "password": "F0r3v3rS@r@"
  }'
```

> **Warning** - Email can be unavailable because verification by activation link isn't implemented yet

### 🔓 Log in as an existing user

To log in as an existing user, send a POST request to `/v1/login` with a [JSON](https://www.json.org/) payload that contains the user's `email` and `password`

```bash
$ curl -X POST http://localhost:3000/v1/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "sarahkim@gmail.com",
    "password": "F0r3v3rS@r@"
  }'
```

> **Note** - Whenever a user's refresh token expires, the user must log in to generate a new one

### 🔄 Refresh the user's access token

To refresh a user's [access token](https://auth0.com/docs/secure/tokens/access-tokens), send a POST request to `/v1/refresh` with the user [refresh token](https://auth0.com/docs/secure/tokens/refresh-tokens) value provided in the [cookie](https://en.wikipedia.org/wiki/Cookie)

```bash
$ curl -X POST http://localhost:3000/v1/refresh \
  -H 'Content-Type: application/json' \
  --cookie "refresh-token=${REFRESH_TOKEN}"
```

> **Note** - You could receive a `refresh-token` from a login or registration endpoint

## ✅ Tests

This project uses [Vitest](https://vitest.dev/) as a test framework because it offers out-of-the-box [Typescript](https://www.typescriptlang.org/) support. All tests using [Given-When-Then](https://en.wikipedia.org/wiki/Given-When-Then) semi-structured way to write down test cases in a more human-readable way

### 🔍 Unit

To run the unit tests execute the following command

```bash
$ yarn test:unit
```

> **Note** - You can display all tests using `--reporter=verbose`, and view all [Vitest](https://vitest.dev/) [cli](https://en.wikipedia.org/wiki/Command-line_interface) options [here](https://vitest.dev/guide/cli.html)

### 🧩 Integration

To run the integration tests, you'll need to set the `DATABASE_URL` environment variable to the [URL](https://en.wikipedia.org/wiki/URL) of your test [PostgreSQL](https://www.postgresql.org/) database

```env
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/auth-integration-test"
```

You can either use your existing [PostgreSQL](https://www.postgresql.org/) instance or create a new one using a [Docker Compose](https://docs.docker.com/compose/) [file](test/docker/docker-compose.yaml)

```bash
$ yarn test-database:up
```

Once the test database is up and running, you can run the integration tests with the following command

```bash
$ yarn test:integration
```

> **Note** - You can generate code coverage via [c8](https://github.com/bcoe/c8) using the `--coverage` flag

## 📜 License

The MIT License (MIT) 2023 - [camelopard187](https://github.com/camelopard187). Please have a look at the [LICENSE.md](LICENSE.md) for more details
