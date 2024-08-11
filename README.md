# ⚡️ Fast App: Backend with Node + GraphQL + MongoDB

This project, part of a boilerplate series, offers a fast-track approach for starting new JavaScript projects. It's designed to work independently or in tandem with a corresponding frontend repository.

## Version

- Current version: 1.0.0

### 🎁 Technologies

The backend is powered by **Node.js, GraphQL, Apollo Server, Express, and Mongoose**.

**✨ Highlights:**

- Ready-to-use server setup.
- User registration and login functionalities.
- Administrative role assignment for users.
- Limitation on the number of registered users.
- Secure storage of user data in MongoDB.
- JWT-based authentication.
- Full appointment management with service and user details.

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


### Dev mode
- MongoDB 7.0+
- Node.js 16.15.1
- npm run dev
- eslint --ext .js . "--fix"

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

## API Endpoints

### User Management

- **Register User**:

  - Mutation: `registerUser`
  - Example:
    ```graphql
    mutation {
      registerUser(
        email: "example@domain.com"
        password: "password123"
        userType: NORMAL_USER
        userName: "userName1"
      ) {
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
      createAppointment(
        userId: "userID"
        serviceId: "serviceID"
        date: "2023-04-01T09:00:00.000Z"
        status: "pending"
      ) {
        _id
        userId
        serviceId
        date
        status
      }
    }
    ```

- **Update Appointment**:

  - Mutation: `updateAppointment`
  - Example:
    ```graphql
    mutation {
      updateAppointment(
        _id: "appointmentID"
        newDate: "2023-05-01T09:00:00.000Z"
        newStatus: "confirmed"
      ) {
        _id
        date
        status
      }
    }
    ```

- **Delete Appointment**:
  - Mutation: `deleteAppointment`
  - Example:
    ```graphql
    mutation {
      deleteAppointment(_id: "appointmentID") {
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
      createService(name: "Service Name", category: "Service Category", isActive: true) {
        _id
        name
        category
        isActive
      }
    }
    ```

- **Update Service**:

  - Mutation: `updateService`
  - Example:
    ```graphql
    mutation {
      updateService(
        _id: "serviceID"
        name: "New Service Name"
        category: "New Category"
        isActive: true
      ) {
        _id
        name
        category
        isActive
      }
    }
    ```

- **Delete Service**:
  - Mutation: `deleteService`
  - Example:
    ```graphql
    mutation {
      deleteService(_id: "serviceID") {
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

### Files Added:

**Resolvers, Types, and Schema Files**

- `src/gql/resolvers/*`: Contains GraphQL resolvers for user, service, and appointment management.
- `src/gql/types/*`: Defines GraphQL types for user, service, and appointment entities.
- `src/data/models/schemas/*`: Mongoose schemas for users, services, and appointments.

## Input Variables for GraphQL Operations

This section provides the input variables required to replicate the current database state using GraphQL operations. Ensure to execute these mutations in the given order to achieve the desired setup.

**Register Users**:

````graphql
mutation {
  registerUser(email: "user@example.com", password: "VerySecure123!", userType: NORMAL_USER, userName: "userName1") {
    token
  }
}
mutation {
  registerUser(email: "sdadd@dsds.dd", password: "SecurePass!", userType: SERVICE_USER, userName: "userName2") {
    token
  }
}
mutation {
  registerUser(email: "abcb@aa.aaa", password: "AnotherPass123!", userType: ADMIN_USER, userName: "userName3") {
    token
  }
}

###Register Services:
**Create Services**

mutation {
  createService(name: "Full Body Massage", category: "Health & Wellness", isActive: true) {
    _id
    name
    category
    isActive
  }
}
mutation {
  createService(name: "Deep Tissue Massage", category: "Therapeutic", isActive: true) {
    _id
    name
    category
    isActive
  }
}
mutation {
  createService(name: "Aromatherapy", category: "Relaxation", isActive: true) {
    _id
    name
    category
    isActive
  }
}
mutation {
  createService(name: "Hot Stone Massage", category: "Luxury Treatments", isActive: false) {
    _id
    name
    category
    isActive
  }
}
mutation {
  createService(name: "Reflexology", category: "Holistic Therapy", isActive: true) {
    _id
    name
    category
    isActive
  }
}
mutation {
  createService(name: "Sports Rehabilitation Massage", category: "Sports", isActive: true) {
    _id
    name
    category
    isActive
  }
}
mutation {
  createService(name: "Swedish Massage", category: "General Wellness", isActive: true) {
    _id
    name
    category
    isActive
  }
}
mutation {
  createService(name: "Facial Rejuvenation", category: "Beauty", isActive: false) {
    _id
    name
    category
    isActive
  }
}
mutation {
  createService(name: "Acupuncture", category: "Alternative Medicine", isActive: true) {
    _id
    name
    category
    isActive
  }
}
mutation {
  createService(name: "Prenatal Massage", category: "Health & Wellness", isActive: true) {
    _id
    name
    category
    isActive
  }
}
mutation {
  createService(name: "Lymphatic Drainage Massage", category: "Medical Treatment", isActive: true) {
    _id
    name
    category
    isActive
  }
}

### Additional Appointments

**Create Additional Appointments**:
```graphql
mutation {
  createAppointment(userId: "662bc297f2ad210410380b57", serviceId: "663529419602541ee2bcbc36", date: "2024-08-02T09:00:00Z") {
    _id
    userId
    serviceId
    date
    status
  }
}
mutation {
  createAppointment(userId: "662bc2b8f2ad210410380b5c", serviceId: "663529669602541ee2bcbc3a", date: "2024-08-02T11:00:00Z") {
    _id
    userId
    serviceId
    date
    status
  }
}
mutation {
  createAppointment(userId: "662bc297f2ad210410380b57", serviceId: "663529939602541ee2bcbc3e", date: "2024-08-03T09:00:00Z") {
    _id
    userId
    serviceId
    date
    status
  }
}
mutation {
  createAppointment(userId: "662bd1afe4695b13c71979ce", serviceId: "663529aa9602541ee2bcbc40", date: "2024-08-03T10:00:00Z") {
    _id
    userId
    serviceId
    date
    status
  }
}
mutation {
  createAppointment(userId: "662bc2b8f2ad210410380b5c", serviceId: "663529f59602541ee2bcbc42", date: "2024-08-03T11:00:00Z") {
    _id
    userId
    serviceId
    date
    status
  }
}
mutation {
  createAppointment(userId: "662bc297f2ad210410380b57", serviceId: "663529339602541ee2bcbc34", date: "2024-08-01T12:00:00Z") {
    _id
    userId
    serviceId
    date
    status
  }
}
mutation {
  createAppointment(userId: "662bd1afe4695b13c71979ce", serviceId: "663529559602541ee2bcbc38", date: "2024-08-02T10:00:00Z") {
    _id
    userId
    serviceId
    date
    status
  }
}

````
