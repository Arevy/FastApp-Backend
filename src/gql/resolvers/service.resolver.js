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
			try {
				return await context.di.model.Service.find({}).select('+isActive').lean(); // Folosește `.select()` dacă `isActive` este setat să nu fie returnat implicit
			} catch (error) {
				console.error('Error retrieving services:', error);
				throw new Error('Failed to retrieve services');
			}
		},
	},
	Mutation: {
		createService: async (_, { name, category, isActive }, context) => {
			try {
				const serviceId = uuidv4();
				const newService = new context.di.model.Service({
					serviceId,
					name,
					category,
					isActive
				});
				await newService.save();  
	
				return newService;  
			} catch (error) {
				console.error('Error creating service:', error);
				throw new Error('Failed to create service');
			}
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
		toggleServiceActive: async (_, { serviceId }, context) => {
			try {
				const service = await context.di.model.Service.findOne({ serviceId: serviceId });
				if (!service) {
					throw new Error('Service not found');
				}
				service.isActive = !service.isActive;
				await service.save();
				return service;
			} catch (error) {
				console.error('Error toggling service active status', error);
				throw new Error('Failed to toggle service active status');
			}
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
