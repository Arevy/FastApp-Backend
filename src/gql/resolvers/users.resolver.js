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
		createUser: async (_, { email, userName, password, userType, isActive }, context) => {
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
			} catch (error){
				console.error('Error creating user:', error);
				throw new Error('Failed to create user');
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
				_id, // Use _id for identification
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
				console.error('Error updating user details:', error);
				return {
					success: false,
					message: 'User details update failed.',
				};
			}
		},
	},
};
