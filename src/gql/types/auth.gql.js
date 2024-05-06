import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
  enum UserType {
    NORMAL_USER
    SERVICE_USER
    ADMIN_USER
  }

  type Token {
    token: String
  }

  type Query {
    usersByType(userType: UserType!): [User]
  }

  type DeleteResult {
    success: Boolean!
    message: String
  }

  type UpdateResult {
    success: Boolean!
    message: String
  }

  type Mutation {
    """
    It allows users to register
    """
    registerUser(email: String!, password: String!, userType: UserType!): Token

    """
    It allows users to authenticate
    """
    authUser(email: String!, password: String!): Token

    """
    It allows to user to delete their account permanently
    """
    deleteMyUserAccount: DeleteResult

    """
    It allows to user to change account password
    """
    updatePassword(_id: ID!, newPassword: String!): UpdateResult

    """
    It allows to user/admin to change account status
    """
    updateIsActive(_id: ID!, newIsActive: Boolean!): UpdateResult
  }
`;
