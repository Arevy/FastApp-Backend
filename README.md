# ⚡️ Fast App: Backend with Node + GraphQL + MongoDB

This project, part of a boilerplate series, offers a fast-track approach for starting new JavaScript projects. It's designed to work independently or in tandem with a corresponding frontend repository.

### 🎁 Technologies
The backend is powered by **Node.js, GraphQL, Apollo Server, Express, and Mongoose**.

**✨ Highlights:**
- Ready-to-use server setup.
- User registration and login functionalities.
- Administrative role assignment for users.
- Limitation on the number of registered users.
- Secure storage of user data in MongoDB.
- JWT-based authentication.

### 📝 Requirements
- MongoDB 7.0+
- Node.js 18.15+

### 📚 Setup Instructions
1. Clone and navigate to the directory.
2. Install dependencies: `npm install` (or `npm install --production` for deployment).
3. Duplicate `_env` as `.env` and configure it.
4. Start the server: `npm start` (or `npm run dev` for development).

**.env Configuration Guide:**
- `PORT`: Backend server port.
- `ENVIRONMENT`: Node.js execution mode (`production` or `development`).
- MongoDB connection settings (`MONGO_FORMAT_CONNECTION`, `MONGO_HOST`, etc.).
- `SECRET`: JWT secret key (keep it secure).
- `DURATION`: JWT token duration.

**Admin User Configuration:**
Access the database to set a user's `isAdmin` field to `true`.

### 💻 Development Tools
- Dev mode: `npm run dev`
- Linter: `npm run lint`
- Testing: `npm run test` / `npm run test:watch`
- Clean logs: `npm run clean`

### API Reference

**User Management:**
- `registerUser`
- `authUser`
- `deleteMyUserAccount`
- `updatePassword`
- `updateIsActive`

**Service Management:**
- `createService`
- `updateService`
- `deleteService`
- `listAllServices`

**Appointment Management:**
- `createAppointment`
- `updateAppointment`
- `deleteAppointment`
- `userAppointments`
- `serviceAppointments`
- `listAllAppointmentsShort`
- `listAllAppointmentsFull`

**GraphQL Types:**
Detailed explanation of each type like `User`, `Service`, `Appointment`.

### Additional Information
- Log management with `log4js`.
- Environment configurations and global variables.
- Detailed GraphQL schemas and resolvers in `backend/src/gql`.
- Helper functions and utilities in `backend/src/helpers`.

---

For more detailed information on resolver logic, refer to the `backend/src/gql/resolvers`. Helpers and utilities can be found in `backend/src/helpers`.

# GraphQL API Backend Documentation

## Overview
This backend API, built with Node.js, GraphQL, Apollo Server, Express, and MongoDB, manages users, appointments, and services. It features user authentication, appointment scheduling, and service management.

## Installation and Setup
1. Clone the repository and navigate to the directory.
2. Install dependencies: `npm install`
3. Configure `.env` using `config/appConfig.js`.
4. Start the server: `npm start` (production) or `npm run dev` (development).


## Fix format eslint
-  `eslint --ext .js . "--fix"`
## API Endpoints

### User Management
- **Register User**: 
  - Mutation: `registerUser`
  - Example: 
    ```graphql
    mutation {
      registerUser(email: "example@domain.com", password: "password123", userType: NORMAL_USER) {
        token
      }
    }
    ```

- **Authenticate User**: 
  - Mutation: `authUser`
  - Example: 
    ```graphql
    mutation {
      authUser(email: "example@domain.com", password: "password123") {
        token
      }
    }
    ```

### Appointment Management
- **Create Appointment**: 
  - Mutation: `createAppointment`
  - Example: 
    ```graphql
    mutation {
      createAppointment(userId: "userID", serviceId: "serviceID", date: "2023-04-01T09:00:00.000Z") {
        uuid
      }
    }
    ```

- **Update Appointment**: 
  - Mutation: `updateAppointment`
  - Example: 
    ```graphql
    mutation {
      updateAppointment(uuid: "appointmentID", newDate: "2023-05-01T09:00:00.000Z", newStatus: "confirmed") {
        uuid
      }
    }
    ```

- **Delete Appointment**: 
  - Mutation: `deleteAppointment`
  - Example: 
    ```graphql
    mutation {
      deleteAppointment(uuid: "appointmentID") {
        success
        message
      }
    }
    ```

### Service Management
- **Create Service**: 
  - Mutation: `createService`
  - Example: 
    ```graphql
    mutation {
      createService(name: "Service Name", category: "Service Category") {
        serviceId
      }
    }
    ```

- **Update Service**: 
  - Mutation: `updateService`
  - Example: 
    ```graphql
    mutation {
      updateService(serviceId: "serviceID", name: "New Service Name", category: "New Category") {
        serviceId
      }
    }
    ```

- **Delete Service**: 
  - Mutation: `deleteService`
  - Example: 
    ```graphql
    mutation {
      deleteService(serviceId: "serviceID") {
        success
        message
      }
    }
    ```

## Additional Information
- Logging is managed using `log4js`, with logs stored in `/logs`.
- Environment configurations and GraphQL schemas are detailed in respective directories.
- For more details on resolvers, check `backend/src/gql/resolvers`.
- Helper functions can be found in `backend/src/helpers`.
