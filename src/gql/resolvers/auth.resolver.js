import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';

import { isValidEmail, isStrongPassword } from '../../helpers/validations.js';

export default {
	Query: {
		usersByType: async (_, { userType }, context) => {
			return context.di.model.Users.find({ userType });
		},
	},
	Mutation: {
		/**
     * It allows to users to register as long as the limit of allowed users has not been reached
     */
		registerUser: async (parent, { email, password, userType, userName }, context) => {
			if (!email || !password || !userType || !userName) {
				throw new UserInputError('Data provided is not valid');
			}

			if (!isValidEmail(email)) {
				throw new UserInputError('The email is not valid');
			}

			if (!isStrongPassword(password)) {
				throw new UserInputError('The password is not secure enough');
			}

			const registeredUsersCount = await context.di.model.Users.find().estimatedDocumentCount();

			context.di.authValidation.ensureLimitOfUsersIsNotReached(
				registeredUsersCount
			);

			const isAnEmailAlreadyRegistered = await context.di.model.Users.findOne({
				email,
			}).lean();

			if (isAnEmailAlreadyRegistered) {
				throw new UserInputError('Data provided is not valid');
			}

			await new context.di.model.Users({ email, password, userType, userName }).save();

			const user = await context.di.model.Users.findOne({ email }).lean();

			return {
				token: context.di.jwt.createAuthToken(
					user.email,
					user.isAdmin,
					user.isActive,
					user.userName
				),
				user: {
					_id: user._id,
					email: user.email,
					isAdmin: user.isAdmin,
					isActive: user.isActive,
					userName: user.userName
				}
			};
		},

		updatePassword: async (_, { _id, newPassword }, context) => {
			const hashedPassword = await bcrypt.hash(newPassword, 10);
			const updateResult = await context.di.model.Users.findByIdAndUpdate(
				_id,
				{ password: hashedPassword },
				{ new: true }
			).lean();

			if (updateResult && updateResult.password === hashedPassword) {
				return { success: true, message: 'Password successfully updated.' };
			} else {
				return { success: false, message: 'Password update failed.' };
			}
		},

		updateIsActive: async (_, { _id, newIsActive }, context) => {
			const updateResult = await context.di.model.Users.findByIdAndUpdate(
				_id,
				{ isActive: newIsActive },
				{ new: true }
			).lean();

			return {
				success: updateResult ? true : false,
				message: updateResult
					? 'isActive status successfully updated.'
					: 'isActive status update failed.',
			};
		},
		/**
     * It allows users to authenticate. Users with property isActive with value false are not allowed to authenticate. When an user authenticates the value of lastLogin will be updated
     */
		authUser: async (parent, { email, password }, context) => {
			if (!email || !password) {
				throw new UserInputError('Invalid credentials');
			}

			const user = await context.di.model.Users.findOne({
				email,
				isActive: true,
			}).lean();
			if (!user) {
				throw new UserInputError('User not found or login not allowed');
			}

			const isCorrectPassword = await bcrypt.compare(password, user.password);
			if (!isCorrectPassword) {
				throw new UserInputError('Invalid credentials');
			}

			await context.di.model.Users.findByIdAndUpdate(
				user._id, 
				{ lastLogin: new Date().toISOString() },
				{ new: false }
			).lean();

			return {
				token: context.di.jwt.createAuthToken(
					user.email,
					user.isAdmin,
					user.isActive,
					user.userName
				),
				user: user
			};
		},

		/**
     * It allows to user to delete their account permanently (this action does not delete the records associated with the user, it only deletes their user account)
     */
		deleteMyUserAccount: async (parent, args, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);
			if (!user) {
				return {
					success: false,
					message: 'User not found.',
				};
			}

			const deleteUserResult = await context.di.model.Users.findByIdAndDelete(
				user.email
			);
			if (deleteUserResult) {
				return {
					success: true,
					message: 'User successfully deleted.',
				};
			} else {
				return {
					success: false,
					message: 'User deletion failed.',
				};
			}
		},
	},
};
