# Inventory Management System

It is a simple inventory management system that allows to:

- create a new customer and log into the system,
- create new products and fetch them,
- make an order.

## Installation

System requirements:

- docker engine
- Node.js v24

In order to install all dependencies run the following command (all commands in this file are prepared to run them from the main directory of this repository):

```bash
$> npm i
```

## Running the application

### Prerequisites

#### Database
This application uses a Postgres database. It is required to run a DB instance before launching the application. It can be run by using the docker:

```bash
$> docker compose up
```

#### Environment variables

It is mandatory to specify environment variables. List of all required variables is available in the [example.env](./.env.example) file.

This file is added to the git repository only as a reference and its values shouldn't be considered as production ready.

However, to keep things simple the [example.env](./.env.example) file can be used for a local development. **All that needs to be done is to prepare `.env` file** for example by copying the example one:

```bash
$> cp .env.example .env
```

#### Application

The application can be run in two ways:

1. local development (it starts a development server that restarts the application on every TS file change)

```bash
$> npm run start:local
```

2. 'production' (it starts the built version of the application)

```bash
# it has to be built first
$> npm run build
$> npm run start:prod
```

By default the application will be available on the localhost on port 3000 (http://localhost:3000).

In this repository there is also a [postman collection](./postman-collection.json) with all endpoints.

## Migrations

This application uses TypeORM as an ORM library. Here is a list of commands that help in migrations management:

1. creating new migration manually

```bash
$> npm run typeorm:create -- src/unit-of-work/connectors/postgres-db/migrations/<MIGRATION-NAME>
```

It creates a new migration file with `up` and `down` methods where appropriate logic can be specified.

The `up` method is responsible for executing the migration logic.

The `down` method stores logic that needs to be executed in order to revert the migration.

2. generating new migration automatically

```bash
$> npm run typeorm:generate -- src/unit-of-work/connectors/postgres-db/migrations/<MIGRATION-NAME>
```

The above command generates a migration automatically. Please note that is should be treated as a scaffold and analyzed before pushing to the repository.

3. reverting a migration

```bash
$> npm run typeorm:revert
```

The above command reverts only the last migration. However, it can be run many times.

**Please note that all missing migrations will be applied automatically during the application startup if `DB_RUN_MIGRATIONS` environment variable is set to true**.

## Notes

For further details please navigate to [Notes](NOTES.md) file.

## Trade-offs & Alternatives describing:

The prepared application has a `/products` router which is globally available without any authentication.
I wouldn't use that approach in the production system (especially when it comes to product creation). If I had more time, I'd add eg. user roles to have at least:

- `customer` - ordinary user that can register an account, log into the system, list products and make orders,
- `admin` - user with extra privilages who can create new products.

Having that solution, it'd make more sense to model the domain slightly differently (and hence DB entities). I'd create an `Account` model instead of `Customer` and assign an appropriate role. It'd be more generic.

It'd require further modifications eg. to the registration endpoint because admin registration can't be globally available to everyone. It can be solved by limiting the registration endpoint to only the `customer` role and creating eg. a maintenance script to create an account with the `admin` role (or creating an account with the `system-admin` role during first application startup and then use that account to create admins in eg. an admin panel).

When it comes to customer authentication, I used two Passport strategies:

- local (username and password),
- JWT.

I chose it as quite straightforward and simple to implement. I also decided to disable sessions handling as in the production environment it'd require to connect a store (eg. Redis).

---

Provided RESTful API implements only endpoints which were specified in the requirements. In the production ready application, it'd be necessary to create additional endpoints eg. for deleting a product, getting a product by ID or listing all orders made by a customer.

---

All calulations during eg. determing total order value are done using simple JavaScript operations. The downside of this is that it might result in lost decimal precision. In production system it'd be necessary to use some package that supports financial calculations, eg. [Dinero.js](https://www.npmjs.com/package/dinero.js).
