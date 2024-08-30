import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
  scalar Upload

  enum UserType {
    NORMAL_USER
    SERVICE_USER
    ADMIN_USER
  }
  
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
    userId: ID,
    userType: UserType! 
  }

  input UpdateServiceInput {
    name: String
    category: String
    isActive: Boolean
    description: String
    imageBase64: String
    imageContentType: String
  }

  type UpdateServiceOutput {
    service: Service
    message: String
  }

  type Mutation {
    createService(input: CreateServiceInput!): Service
    updateService(userId: ID!, input: UpdateServiceInput): UpdateServiceOutput
    toggleServiceActive(_id: ID!): Service
    deleteService(_id: ID!): DeleteResult
  }

  type Query {
    serviceByUserId(userId: ID!): Service
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
