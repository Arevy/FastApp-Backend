/**
 * All resolvers related to users
 * @typedef {Object}
 */
export default {
	Query: {
		/**
     * It allows to administrators users to list all users registered
     */
		listAllUsers: async (parent, args, context) => {
			// context.di.authValidation.ensureThatUserIsLogged(context);

			// context.di.authValidation.ensureThatUserIsAdministrator(context);

			const sortCriteria = { isAdmin: 'desc', registrationDate: 'asc' };
			return context.di.model.Users.find().sort(sortCriteria).lean();
		},
	},
	Mutation: {
		createUser: async (
			_,
			{ email, userName, password, userType, isActive },
			context
		) => {
			try {
				const newUser = new context.di.model.Users({
					email,
					userName,
					password,
					userType,
					isActive,
					isAdmin: userType === 'ADMIN_USER',
				});
				await newUser.save();
				return newUser;
			} catch (error) {
				throw new Error('Failed to create user');
			}
		},

		deleteUserById: async (_, { _id }, context) => {
			try {
				const deleteResult = await context.di.model.Users.findByIdAndDelete(
					_id
				);
				if (!deleteResult) {
					return {
						success: false,
						message: 'User not found or deletion failed.',
					};
				}
				return {
					success: true,
					message: 'User successfully deleted.',
				};
			} catch (error) {
				throw new Error('Failed to delete user');
			}
		},

		updateUserAdminStatus: async (
			_,
			{ _id, isAdmin, isActive, userType },
			context
		) => {
			const updateData = {};
			if (isAdmin !== undefined) {
				updateData.isAdmin = isAdmin;
			}
			if (isActive !== undefined) {
				updateData.isActive = isActive;
			}
			if (userType) {
				updateData.userType = userType;
			}

			const updateResult = await context.di.model.Users.findByIdAndUpdate(
				_id, 
				updateData,
				{ new: true }
			);

			if (!updateResult) {
				return {
					success: false,
					message: 'User update failed or user not found.',
				};
			}
			return { success: true, message: 'User updated successfully.' };
		},

		updateUserDetails: async (_, { _id, email, userName }, context) => {
			try {
				const updateData = {};
				if (email) {
					updateData.email = email;
				}
				if (userName) {
					updateData.userName = userName;
				}

				const updateResult = await context.di.model.Users.findByIdAndUpdate(
					_id,
					{ $set: updateData },
					{ new: true }
				).lean();

				if (!updateResult) {
					throw new Error('User not found');
				}

				return {
					success: true,
					message: 'User details successfully updated.',
					user: updateResult,
				};
			} catch (error) {
				return {
					success: false,
					message: 'User details update failed.',
				};
			}
		},
	},
};
