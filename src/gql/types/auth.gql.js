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
	
	type Mutation {
		""" It allows users to register """
		registerUser(email: String!, password: String!, userType: UserType!): Token

		""" It allows users to authenticate """
		authUser(email: String!, password: String!): Token

		""" It allows to user to delete their account permanently """
		deleteMyUserAccount: DeleteResult
	}
`;