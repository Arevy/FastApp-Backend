import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { models } from '../../data/models/index.models.js';
import { authValidations } from './authValidations.js';
/**
 * Service validations repository
 * @typedef {Object}
 */

// Re-export existing authValidations functions to keep them accessible from this module
export const {
	ensureLimitOfUsersIsNotReached,
	ensureThatUserIsLogged,
	ensureThatUserIsAdministrator,
	getUser,
} = authValidations;

export const serviceValidations = {
	/**
   * Check if the user requesting the appointments is the service user or an admin.
   * If not, it throws an error.
   * @param {Object} context - The context object of Apollo Server
   * @param {String } serviceId - The ID of the service user whose appointments are being requested
   */
	ensureUserCanViewServiceAppointments: async (context, serviceId) => {
		// const requestingUser = await authValidations.getUser(context);
		const requestingUser = await context.di.authValidation.getUser(context);

		if (!requestingUser) {
			throw new AuthenticationError(
				'You must be logged in to view appointments'
			);
		}

		// Check if the user is the service user or an admin
		if (
			requestingUser._id.toString() !== serviceId &&
      !requestingUser.isAdmin
		) {
			throw new ForbiddenError(
				'You do not have permission to view these appointments'
			);
		}
	},

	/**
   * Retrieve appointments for a specific service user.
   * @param {String} serviceId - The ID of the service user whose appointments are being requested
   * @returns {Promise<Array>}
   */
	listAppointmentsForServiceUser: async (serviceId) => {
		return models.Appointment.find({ serviceId })
			.populate('userId')
			.populate('serviceId');
	},

	// ... other functions ...
};
