// import { logger, endLogger } from './helpers/logger.js';

/**
 * All resolvers related to services
 * @typedef {Object}
 */

const cache = {};
export default {
	Query: {
		serviceAppointments: async (_, { serviceId }, context) => {
			if (cache[serviceId]) {
				return cache[serviceId]; // Return cached data if available
			}
			const appointments = await context.di.model.Appointment.find({
				serviceId,
			}).lean();
			cache[serviceId] = appointments; // Cache the data for future requests
			return appointments;
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
			try {
				return await context.di.model.Service.find({})
					.select('+isActive')
					.lean(); // Use `.select()` if `isActive` is set to not return by default
			} catch (error) {
				console.error('Error retrieving services:', error);
				throw new Error('Failed to retrieve services');
			}
		},
	},

	Mutation: {
		createService: async (_, { input }, context) => {
			const newService = new context.di.model.Service({
				name: input.name,
				category: input.category,
				isActive: input.isActive,
				description: input.description,
				imageBase64: input.imageBase64,
				imageContentType: input.imageContentType,
			});

			return newService.save();
		},
		updateService: async (
			_,
			{
				_id,
				name,
				category,
				isActive,
				description,
				imageBase64,
				imageContentType,
			},
			context
		) => {
			const updateData = { name, category, isActive, description };
			if (imageBase64 && imageContentType) {
				updateData.imageData = Buffer.from(imageBase64, 'base64');
				updateData.imageContentType = imageContentType;
			}
			const updatedService = await context.di.model.Service.findByIdAndUpdate(
				_id,
				{ $set: updateData },
				{ new: true }
			);
			if (!updatedService) {
				throw new Error('Service not found or update failed');
			}
			return updatedService;
		},

		toggleServiceActive: async (_, { _id }, context) => {
			const service = await context.di.model.Service.findById(_id);
			if (!service) {
				throw new Error('Service not found');
			}
			service.isActive = !service.isActive;
			await service.save();
			return service;
		},

		deleteService: async (_, { _id }, context) => {
			const result = await context.di.model.Service.findByIdAndDelete(_id);
			if (!result) {
				throw new Error('Service not found or delete failed');
			}
			return {
				success: true,
				message: 'Service deleted successfully',
			};
		},
	},
};
