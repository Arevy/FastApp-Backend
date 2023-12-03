import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
	enum UserType {
		NORMAL_USER
		SERVICE_USER
		ADMIN_USER
	}

	type User {
		email: String
		isAdmin: Boolean
		isActive: Boolean
		uuid: String
		registrationDate: String
		lastLogin: String
		userType: UserType!
	}

	type Query {
		""" Get list of all users registered on database """
		listAllUsers: [User]
	}
`;