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
		updateUserAdminStatus: async (
			_,
			{ _id, isAdmin, isActive, userType },
			context
		) => {
			const updateData = {};
			if (isAdmin !== undefined) {updateData.isAdmin = isAdmin;}
			if (isActive !== undefined) {updateData.isActive = isActive;}
			if (userType) {updateData.userType = userType;}

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
	},
};
