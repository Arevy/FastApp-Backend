import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
  type Service {
    _id: ID!
    name: String
    category: String
    isActive: Boolean
  }

  type Mutation {
    createService(name: String!, category: String!, isActive: Boolean!): Service
    updateService(_id: ID!, name: String, category: String): Service
    toggleServiceActive(_id: ID!): Service
    deleteService(_id: ID!): DeleteResult
  }

  type Query {
    serviceAppointments(serviceId: ID!): [Appointment]
    allAppointments: [Appointment]
    getService(_id: ID!): Service
    listAllServices: [Service]
  }

  type DeleteResult {
    success: Boolean!
    message: String
  }

  type User {
    uuid: ID!
    email: String!
  }

  type Appointment {
    ID: ID!
    userId: ID!
    serviceId: ID!
    date: String!
    status: String!
  }
`;
