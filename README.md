# NestJS started template

This starter template aims to streamline the development process by providing a pre-configured project structure, essential modules, guards, interceptors, controllers, services and utilities that most applications require. Build on top of RestAPI architecture, this template sets the foundation, letting you jump straight into implementing your business logic.

## Installation
To start working with this repository you must execute only 3 commands:
```bash
git clone https://github.com/CervarlCG/nestjs-starter-template.git
cd nestjs-starter-template
npm i
```

## Configuration

### Enviroment Variables
Before running your project you must setup the enviroment, we can start by creating the .env file from template.env

```bash
mv template.env .env
```
Even NestJS uses typeorm to connect to different datasources (MySQL, Postgresql, MongoDB, etc...) all the migration were made thinking on MySQL so at this point you must have a MySQL Server instance running.

So far .env have 2 kind of variables
    - Database: All variables related to database connection
    - JWT: All variables related to JWT authentication
    
`DB_XXX` must be set with MySQL connection data
`JWT_SECRET_KEY` must be set with a secure and secret key

### Migrations

All migrations can be found at `src/database/migrations` as TS files, before running the migrations to create the database schema we need to build the application to generate js files.

```bash
npm run build
```

Once we have built the project we can run migrations with next commands:
```bash
// Run all pendings migrations
npm run migrations:run

// Revert last migrations
npm run migrations:revert
```

Once we ran migrations then the schema should have been created on the database, now we can run our project
```bash
npm run start:dev
```

By default app run on port 8080, you can change it on `src/config/app.ts` files or passing the port as a env variable.

To verify all is working correctly run end to end test:
```bash
npm run test:e2e
```

If the project was setup correctly it should pass all tests

## Features

### Logging
All services and other files that contains business logic that is not the http layer must throw System Exceptions, the existing exceptions can be found at `src/common/exceptions/system.ts`, there are some predefinied exceptions but you can create your custom exceptions at the same file.

Every exception has 2 properties:
- exposeMessage: if true the exception message is exposed to client
- allowLog: if true the exception will be logged

By default only `Error` instances and `ServerException` will prevent expose message and will log the exception in the database (Any error that extends `Error` but not `SystemException` will follow same logic), other exception will expose the message and won't be logged in the database.

At `src/models/http/http.interceptor.ts` you will find the logic of how those exceptions are converted to http exceptions, the reason why we don't use native NestJS exceptions is because we added a custom field to exceptions called `requestId`, if the exception can be logged in the database that field is sent in the http response body.

### Request
A request service for generate a request id every time a endpoint is executed.

### Auth
User authentication allow users to log in and authorize request by generating JWT token, at `/auth/login` the user can send its credentials (email, password) to get the access token and refresh token (See next section to know how to create user).

Access tokens must be send as bearer token on all protected routes by `JwtAuthGuard` guard, refresh token must be sent to `/auth/refresh-token` to refresh the token once access token expires, to customize the expiration time modify it in `src/models/auth/auth.module.ts`, every time users request the access token a new refresh token is generated and can be used only once.

### Users
Users module allow to create users and manage them, to start creating one use the endpoint `/users/register`
```bash
curl -X POST http://localhost:8080/auth/register -d '{"firstName": "John", "lastName": "Doe", "email": "john@gmail.com", "password": "secure-password"}' -H "Content-Type: application/json"
```
and for log in use `/auth/login`
```bash
curl -X POST http://localhost:8080/auth/login -d '{"email": "john@gmail.com", "password": "secure-password"}' -H "Content-Type: application/json"
```


