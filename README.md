# Inventory Management System

## Installation

In order to install all dependencies run the following command:

```bash
$> npm i
```

## Running the application

The application can be run in two ways:

1. local development

```bash
$> npm run start:local
```

2. production

```bash
$> npm run start:prod
```

## Migrations

This application uses TypeORM as an ORM library. Here is a list of commands that help migrations management:

1. creating new migration manually

```bash
$> npm run typeorm:create -- src/unit-of-work/connectors/postgres-db/migrations/<MIGRATION-NAME>
```

2. generating new migration automatically

```bash
$> npm run typeorm:generate -- src/unit-of-work/connectors/postgres-db/migrations/<MIGRATION-NAME>
```

## Notes

For further details please navigate to [Notes](NOTES.md)
