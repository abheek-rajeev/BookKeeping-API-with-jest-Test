# Bookstore Management System API

This project is a RESTful API for managing a bookstore. It allows users to perform CRUD operations on book information.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Testing](#testing)
- [Contributing](#contributing)

  
## Introduction

The Bookstore Management System API is built using Node.js and Express, with MongoDB as the database. It provides a set of API endpoints for adding, retrieving, updating, and deleting book information. The project also includes basic authentication using JWT tokens.

## Features

- CRUD operations for managing book information
- Basic authentication using JWT tokens
- Clear documentation of API endpoints
- Unit tests for API endpoints using Jest

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js and npm
- MongoDB
- Postman (for testing)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/bookstore-api.git
   
2. Install dependencies:

   ```bash
   cd bookstore-api
   npm install
   
## Configuration

- Configure MongoDB connection in app.js or use environment variables.
- Change the secretKey in app.js for JWT token signing in a production environment.

## Usage
Start the server:

    ```bash
    npm start
    
Access the API at http://localhost:3000.

## API Endpoints

- Add a new book:

POST /books
Requires admin authentication

- Retrieve all books:

GET /books
Requires user authentication

- Retrieve a specific book by ISBN:

GET /books/:isbn
Requires user authentication

- Update book details:

PUT /books/:isbn
Requires admin authentication

- Delete a book:

DELETE /books/:isbn
Requires admin authentication

- Login to get JWT token:

POST auth/signin

- Signup to create user

POST auth/signup

- logout of user to remove JWT token:

GET auth/signout
requires a user

Authentication
The API uses JSON Web Tokens (JWT) for authentication. Obtain a token by logging in through the /signin endpoint and include it in the Authorization cookie for authenticated requests.

## Testing
Wrote unit tests for API endpoints using Jest under book.test.js. Execute tests with:

    ```bash
    npm test

## Contributing
Feel free to contribute to this project by opening issues or submitting pull requests.




