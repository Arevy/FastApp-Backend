import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
  enum UserType {
    NORMAL_USER
    SERVICE_USER
    ADMIN_USER
  }

  type Token {
    token: String
    user: User
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
    registerUser(
      email: String!,
      password: String!,
      userType: UserType!,
      userName: String!,
      serviceId: ID 
    ): Token

    """
    It allows users to authenticate
    """
    authUser(email: String!, password: String!): Token

    """
    It allows the user to delete their account permanently
    """
    deleteMyUserAccount: DeleteResult

    """
    It allows the user to change their account password
    """
    updatePassword(_id: ID!, newPassword: String!): UpdateResult

    """
    It allows the user/admin to change account status
    """
    updateIsActive(_id: ID!, newIsActive: Boolean!): UpdateResult
  }
`;
