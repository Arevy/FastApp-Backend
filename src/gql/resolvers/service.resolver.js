import { v4 as uuidv4 } from 'uuid';
// import { logger, endLogger } from './helpers/logger.js';

/**
 * All resolvers related to services
 * @typedef {Object}
 */
export default {
	Query: {
		// ... existing resolvers ...

		serviceAppointments: async (_, { serviceId }, context) => {
			// Ensure the user has the right to view these appointments
			await context.di.authValidation.ensureUserCanViewServiceAppointments(
				context,
				serviceId
			);

			// If validation passes, list the appointments
			return context.di.model.Appointment.find({ serviceId });
		},

		allAppointments: async (_, args, context) => {
			// Optional: Add a check to ensure only admin users can fetch all appointments
			context.di.authValidation.ensureThatUserIsAdministrator(context);

			// Fetch all appointments
			return context.di.model.Appointment.find({})
				.populate('userId')
				.populate('serviceId');
		},

		getService: async (_, { serviceId }, context) => {
			return context.di.model.Service.findById(serviceId);
		},

		listAllServices: async (_, args, context) => {
			// return await context.di.model.Service.find({});
			return context.di.model.Service.find().sort().lean();
		},
	},
	Mutation: {
		createService: async (_, { name, category }, context) => {
			const serviceId = uuidv4(); // Generate a unique serviceId
			await new context.di.model.Service({ serviceId, name, category }).save();
			const savedService = await context.di.model.Service.findOne({
				name,
			}).lean();

			return savedService
				? {
					serviceId: savedService?._id.toString() || '1',
					name: savedService?.name || 'nope_name',
					category: savedService?.category || 'nope_category',
				}
				: null;
		},
		updateService: async (_, { serviceId, name, category }, context) => {
			const updateData = {};
			if (name) {
				updateData.name = name;
			}
			if (category) {
				updateData.category = category;
			}

			return context.di.model.Service.findByIdAndUpdate(
				serviceId,
				updateData,
				{ new: true }
			);
		},
		deleteService: async (_, { serviceId }, context) => {
			const result = await context.di.model.Service.deleteOne({ serviceId });
			return {
			  success: result.deletedCount === 1,
			  message: result.deletedCount === 1 ? 'Service deleted successfully' : 'Error deleting service',
			};
		  },
	},
};
