import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
  scalar Upload

  type Service {
    _id: ID!
    name: String
    category: String
    isActive: Boolean
    description: String
    imageBase64: String
    imageContentType: String
    userId: ID! 
  }

  input CreateServiceInput {
    name: String!
    category: String!
    isActive: Boolean!
    description: String
    imageBase64: String
    imageContentType: String
  }

  input UpdateServiceInput {
    name: String
    category: String
    isActive: Boolean
    description: String
    imageBase64: String
    imageContentType: String
  }

  type Mutation {
    createService(input: CreateServiceInput!): Service
    updateService(userId: ID!, input: UpdateServiceInput): Service
    toggleServiceActive(_id: ID!): Service
    deleteService(_id: ID!): DeleteResult
  }

  type Query {
    serviceAppointments(serviceId: ID!): [Appointment]
    allAppointments: [Appointment]
    getService(_id: ID!): Service
    listAllServices: [Service]
    listServicesByCategory(category: String!): [Service]
  }

  type DeleteResult {
    success: Boolean!
    message: String
  }

  type User {
    # uuid: ID!
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
