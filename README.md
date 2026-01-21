# nest-micro-core

A scalable **NestJS microservice-based application** built with a gateway architecture, event-driven communication, and role-based security.

This project demonstrates how to design and manage multiple microservices using **NestJS**, **RabbitMQ**, and **MongoDB**, with a centralized gateway handling authentication and access control.

---

## 🧱 Architecture Overview

The system is composed of **4 services**:

### 1. Gateway Service

* Acts as the **entry point** for all client requests
* Communicates with other microservices
* Handles:

  * Authentication (Clerk)
  * Role-based access control (RBAC)
  * Public & admin-only routes

### 2. Catalog Service

* Manages **product-related operations**
* Creates and updates product data
* Emits events when a product is created

### 3. Media Service

* Handles **image uploads**
* Uploads media to **Cloudinary**
* Returns uploaded image URLs

### 4. Search Service

* Indexes products for **search functionality**
* Listens to product creation events
* Stores searchable product data

---

## 🔁 Communication Pattern

This application uses **RabbitMQ** for asynchronous communication between services.

### Patterns Used

* **Message Pattern** → For request/response communication
* **Event Pattern** → For emitting domain events

### Product Creation Flow

1. User creates a product via **Gateway**
2. Gateway sends a message to **Catalog Service**
3. Catalog Service:

   * Creates the product
   * Emits a `product_created` event
4. Media Service:

   * Listens to the event
   * Uploads image to Cloudinary
   * Returns image URL
5. Search Service:

   * Listens to the same event
   * Creates a searchable record

---

## 🔐 Authentication & Authorization

### Authentication

* Uses **Clerk** for authentication
* All routes are **protected by default**
* Only authenticated users can access APIs

### Public Routes

* Custom `@Public()` decorator
* Allows unauthenticated access when explicitly applied

### Admin Routes

* Custom `@Admin()` decorator
* Only users with **admin role** can access
* Enforced via guards

---

## 🗄️ Database

* **MongoDB** as the primary database
* **Mongoose** as the ODM
* Separate databases for each service:

  * Catalog DB
  * Media DB
  * Search DB

This ensures loose coupling and service independence.

---

## 📦 Tech Stack

* **NestJS** – Backend framework
* **MongoDB** – Database
* **Mongoose** – ODM
* **RabbitMQ** – Message broker
* **Cloudinary** – Media storage
* **Clerk** – Authentication

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the project and configure the following:

```env
# Gateway\ nGATEWAY_PORT=

# Microservices (TCP)
CATALOG_TCP_PORT=
MEDIA_TCP_PORT=
SEARCH_TCP_PORT=

# RabbitMQ
RABBITMQ_URL=

CATALOG_QUEUE=
SEARCH_QUEUE=
MEDIA_QUEUE=

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# MongoDB
MONGO_URI=
MONGO_URI_CATALOG=
MONGO_URI_MEDIA=
MONGO_URI_SEARCH=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🚀 Running the Project

1. Install dependencies:

```bash
npm install
```

2. Start RabbitMQ

3. Run services individually:

```bash
npm run start gateway --watch
npm run start catalog --watch
npm run start media --watch
npm run start search --watch
```

Or use a process manager (PM2 / Docker) for production.

---

## 📌 Key Features

* Microservice architecture
* Event-driven communication
* Secure gateway
* Role-based access control
* Media upload & search indexing
* Scalable and maintainable design

---

## 📄 License

MIT License

---

**Project Name:** `nest-micro-core`

---

## 👤 Author

**Mohammad Nazim Hossain**
Full Stack Developer

---

Built with ❤️ using NestJS microservices

