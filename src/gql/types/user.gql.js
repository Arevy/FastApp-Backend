import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
  enum UserType {
    NORMAL_USER
    SERVICE_USER
    ADMIN_USER
  }

  type User {
    _id: ID!
    email: String!
    isAdmin: Boolean
    isActive: Boolean
    userName: String!
    registrationDate: String!
    lastLogin: String
    userType: UserType!
    password: String
  }

  type Query {
    listAllUsers: [User]
  }

  type Mutation {
    updateUserAdminStatus(
      _id: ID!
      isAdmin: Boolean
      isActive: Boolean
      userType: UserType
    ): UpdateResult
  }
`;
