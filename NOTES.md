# Notes

## Assumptions & Simplifications

- Account in this application was modelled in a simple way. Some simplifications were already described in the "Trade-offs & Alternatives describing" section in the [README.md](./README.md) file. Only a role of `customer` was added to be able to make an order. It'd be beneficial to extend it further to add eg. `admin` role and based on that limit access to eg. product creation endpoint. `CustomerModel` model holds information about a region which is assigned to a customer. Based on that region proper product price is calculated. The application uses username&password and jwt authentication to automatically determine customer ID and their region while using the `/orders/` endpoint. Thanks to that we can't make an order in someone else's name. We can't also specify different region than the one that was chosen during registration.

- Products can be accessed and created by anyone using the API. The endpoints are not secured by any authentication method.

- All discounts are hardcoded in the business logic [OrderModel](./src/domain/order.model.ts). It's not the best approach for production system because it's not generic and require code changes everytime we'd like to change eg. discount value, holiday sales dates or add a new discount. Better approach would be to create a separate class to model a discount logic (eg. value and dates). It can then be saved in the database and manage using eg. admin panel.

## Technical Decisions

PostgreSQL was selected as the relational database for this project due to its robust ACID compliance, ensuring transactional integrity for critical operations like product orders and stock updates. As detailed in the "Business Logic" section of this file, commands such as [OrderProductsCommand](./src/services/commands/order-products/order-products.command.ts) rely on transactions to maintain consistent state (saving orders and reducing stock levels) to prevent issues like overselling. Additionally, Postgres's relational model can handle complex entity relationships, such as many-to-many relation between order and product entities, supporting efficient joins and queries.

The database's advanced features, including partitioning, parallel queries, and JSONB support, provide scalability for potential growing data volumes and complex business logic. Compared to NoSQL alternatives, PostgreSQL balances flexibility with the relational guarantees essential for an IMS, ensuring reliable performance and maintainability as the system evolves.

---

This application has a very simple implementation of the CQRS pattern. It provides clean separation of operations (commands or queries) which can then be easily tested, replaced or improved. 

It provides a generic bus implementation where we can register commands or queries. It can run a single operation on a single invocation and can be awaited to return appropriate result.

Queries are organized in a way that they return a state saved in a connected store (i.e. Postgres database).

---

The application has a few main directories:

- [api](./src/api/) - it contains all code related to the RESTful api. No other directory depends on it so it can be easily replaced by another implementation (eg. set of command-line scripts)
- [domain](./src/domain/) - in this directory there is a list of domain models with business logic. It is self-contained directory that can be easily tested.
- [schemas](./src/schemas/) - it stores all schemas that are used to validate input (eg. commands' input)
- [services](./src/services/) - there are command and queries which are described below
- [unit-of-work](./src/unit-of-work/) - in here we have a list of interfaces that specify how a unit of work in this application should look like. Thanks to that it is easy to prepare an implemetation for a different store engine. There are two implementations prepared:
  - [in-memory-db](./src/unit-of-work/connectors/in-memory-db/) - simple in-memory "store" that is used during integration tests
  - [postgres-db](./src/unit-of-work/connectors/postgres-db/) - Postgres implementatino of the unit-of-work. It uses TypeORM package with repository pattern.
- [utils](./src/utils/) - an utility directory with various functionalities, eg. config parsing from the environment variables and implementation of logger.

---

All commands and queries are stores in [services](./src/services/) directory in a appropriate folder.

There is also one query: [GetAllProductsQuery](src/services/queries/get-all-products/get-all-products.query.ts) which is used to fetch a page of products. It supports pagination by providing options property. By default a page of 10 products will be returned. It is set to return no more than 20 products per page.

Commands are in the [commands](./src/services/commands/) directory. Each command solves a specific task. List of available commands:

- [CreateProductCommand](./src/services/commands/create-product/create-product.command.ts) - it creates a single product. This (and all other commands) validates provided input. If there is no error the product is persisted in the database.
- [LoginCustomerCommand](./src/services/commands/login-customer/login-customer.command.ts) - it uses username and password to log in a customer. It checks if a given username exists in the database and if the provided password (after hashing) is correct.
- [OrderProductsCommand](./src/services/commands/order-products/order-products.command.ts) - it is responsible for making an order. It validates product stock levels and then tries to save an order in the database followed by product stock level reduciton. All database operations are executed in a transation to enforce consistent state in case of any errors.
- [RegisterCustomerCommand](./src/services/commands/register-customer/register-customer.command.ts) - it allows to create a new customer account with basic information (eg. region which is then used to calculate base product price).
- [RestockProductCommand](./src/services/commands/restock-product/restock-product.command.ts) - it is a simple command to increase a stock level for a given product.
- [SellProductCommand](./src/services/commands/sell-product/sell-product.command.ts) - it is a simple command to descrese a stock level for a given product.

## Business Logic

Business logic is enclosed in domain models which are stored in [this](./src/domain) directory.

In the [OrderModel](./src/domain/order.model.ts) file there is `calculateOrderValue` method that is responsible for calculating the order value and saving it in the instance property `price`.

First of all, it checks if we are currently in the Holiday Sales season. There is a separate method that calculates total order value and discount for holiday sales. During that calculation we take care of determining a base price (based on a region which is assigned to the customer model) and applying a discount if a product belongs to one of the promotional categories.

If we are outside of the holiday sales season, then the method checks if it is a Black Friday. `isBlackFridaySale()` method checks what is the last Friday of november and (after determing that date) it checks if current date (month and day) equals to it. Black Friday sale calculates total order value (it uses base product prices increased or decreased by the region requirements). Having that calculation, we then apply hardcoded 25% discount.

If an order is made on an ordinary date (non-holiday and non-black-friday) then the total order value is calculated (respecting region-based requirements).

Additionally, the volume-based discount is calculated following business rquirements.

Having all required parts calculated (total order and discount) we can determine final discount value. It is the maximum value of discount chosen from: holiday/promotional vs volume-based. Total order value is set as the amount determined in the previous steps and subtracted by final discount.

---

An order can be made using the [OrderProductCommand](src/services/commands/order-products/order-products.command-handler.ts) command. It uses a simple approach where we are passing a list of product IDs (they don't have to be unique so we can order a single product multiple times by specifying that product ID required number of times).

After validating an input (customer ID and products IDs) the command fetches list of products that need to be ordered. We use `ProductModel` logic to update the stock level (it also check if stock would be >= 0 after making an order). If stock level (after making an order) was negative, then the domain error would be thrown (which then will be handled and returned an appropriate response).

If product stock level is enough, then the order can be made. All database operations (saving the order and reducing product stock level) are done in a transaction so in case of any errors we won't end up in an inconsisten state.

## Testing

The provided project provides unit and integration tests available in the `tests` directory.

Unit tests (`tests/unit`) cover business logic available in the domain models (`src/domain`). They focus on public methods/getters present in mentioned classes.

Integration tests (`tests/integration`) cover commands and a query which are the most important from the perspective of the provided file with the task's requirements. Hence, commands regarding customer registration and login are not tested. They focus on products and orders management.

In the production system I'd add more tests (both, unit and integration). In that scenario it'd include integration tests for all commands and queries. Additionally, I'd add end-to-end tests. They might include final database engine, check everything starting from sending a request, checking if necessary data is stored in the DB etc.
