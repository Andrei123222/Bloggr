# Description
Welcome to Bloggr! A project built as an exercise in web development and providing a safe haven for users to write and share any of their thoughts

# Functional specifications
The app has 4 main pages, available to every user: home, about, posts and admin. The home page welcomes you to Bloggr and provides the 10 most recent posts(published or updated), the about page contains a short presentation for the app, the posts page allows the user to browse through all of the posts the site contains, whilst the admin page allows user registration/login. If a user logs into their account, they have acces to the last page, the admin dashboard. This page allows admins to see all the posts and edit/delete their own.

# Technical specifications
The app was built using NodeJS, Express, EJS, MongoDB and bcrypt. NodeJS and express are used for server-side programming, EJS is used as a templating engine(mirroring Angular's templates), MongoDB is used for storing users and posts and finally bcrypt is used to encrypt user passwords into the database. For testing the app uses Mocha, chai and sinon for unit-tests and Playwright for e2e and performance testing.

# Architectural diagram
![Bloggr-Diagram drawio](https://github.com/user-attachments/assets/cf38d2ca-c198-41ea-86d2-a0fb5e318feb)

# Backend setup
## Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher recommended, project was built with version 23.0.0)  
- **npm** for managing packages  
- **MongoDB** (local or cloud-based)

---

## Dependencies Overview

Here’s the lineup of the tools running the show:

### **Main Dependencies**
These are the core dependencies that make the backend tick:

- **bcryptjs**: For hashing passwords securely.  
- **connect-mongo**: MongoDB-backed session store for `express-session`.  
- **cookie-parser**: Parse cookies with ease.  
- **dotenv**: Load environment variables from `.env` file (for keeping the mongo connection string and jwt secret safe).  
- **ejs**: Embedded JavaScript templating for rendering dynamic views.  
- **express**: Fast and minimalist web framework.  
- **express-ejs-layouts**: Layouts for EJS views.  
- **express-session**: Session middleware.  
- **jsonwebtoken**: Token-based authentication.  
- **memorystore**: Memory-based session store for development.  
- **method-override**: Override HTTP methods for RESTful APIs.  
- **mongodb**: MongoDB driver to connect your app to the database.  
- **mongoose**: ODM for MongoDB with schema-based solutions.  
- **rxjs**: Reactive programming for using observables(maps, pipes and switchmaps).  
- **sinon**: For spies, stubs, and mocks in testing.

### **Dev Dependencies** (Testing Purposes)
For testing, debugging, and keeping the quality pristine:

- **@playwright/test**: End-to-end testing framework.  
- **chai**: Assertion library for writing tests.  
- **mocha**: Testing framework for Node.js.  
- **nodemon**: Auto-restart the server during development.  
- **supertest**: HTTP assertions for testing the app's routes with requests.
