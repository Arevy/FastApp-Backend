// import { logger, endLogger } from './helpers/logger.js';
import redis from '../../config/redis.js';
/**
 * All resolvers related to services
 * @typedef {Object}
 */

const cache = {};
export default {
	Query: {
		serviceAppointments: async (_, { serviceId }, context) => {
			const cacheKey = `serviceAppointments:${serviceId}`;

			const cachedAppointments = await redis.get(cacheKey);
			if (cachedAppointments) {
				return JSON.parse(cachedAppointments); // Dacă există, returnează-le din cache
			}

			// Dacă nu există în cache, execută query-ul pe baza de date
			const appointments = await context.di.model.Appointment.find({
				serviceId,
			}).lean();

			// Stochează rezultatul în cache pentru viitoare interogări
			await redis.set(cacheKey, JSON.stringify(appointments), 'EX', 3600); // Expiră după 1 oră

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

		serviceByUserId: async (_, { userId }, context) => {
			const user = await context.di.model.Users.findById(userId);
			if (!user) {
				throw new Error('User not found');
			}

			const service = await context.di.model.Service.findById(user.serviceId);
			console.log({ user });
			if (!service) {
				throw new Error('Service not found');
			}

			return service;
		},

		getService: async (_, { serviceId }, context) => {
			return context.di.model.Service.findById(serviceId);
		},

		listServicesByCategory: async (_, { category }, context) => {
			return context.di.model.Service.find({ category }).lean();
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
			try {
				// Pas 1: Creăm un nou service cu datele primite
				const newService = new context.di.model.Service({
					userId: input.userId,
					name: input.name,
					category: input.category,
					isActive: input.isActive,
					description: input.description,
					imageBase64: input.imageBase64,
					imageContentType: input.imageContentType,
				});

				// Salvăm noul service în baza de date și așteptăm finalizarea
				const savedService = await newService.save();

				console.log('Service created:', savedService);

				// Pas 2: Dacă utilizatorul este de tip SERVICE_USER, actualizăm serviceId în profilul acestuia
				if (input.userType === 'SERVICE_USER') {
					const userUpdateResult =
					await context.di.model.Users.findByIdAndUpdate(
						input.userId,
						{ serviceId: savedService._id },
						{ new: true }
					);

					if (!userUpdateResult) {
						console.error(
							'Failed to update user with serviceId:',
							savedService._id
						);
						throw new Error('User update failed');
					}

					console.log('User updated with serviceId:', savedService._id);
				}

				// Pas 3: Eliminăm cheia din Redis asociată cu lista de programări ale serviciului pentru a invalida cache-ul
				const cacheKey = `serviceAppointments:${savedService._id}`;
				await redis.del(cacheKey);

				console.log('Cache invalidated for:', cacheKey);

				// Returnăm serviciul salvat
				return savedService;
			} catch (error) {
				console.error('Error in createService:', error);
				throw new Error('Service creation failed');
			}
		},

		updateService: async (_, { userId, input }, context) => {
			const user = await context.di.model.Users.findById(userId);
			if (!user || user.userType !== 'SERVICE_USER') {
				throw new Error('User not found or not a service user');
			}

			const serviceId = user.serviceId;
			if (!serviceId) {
				throw new Error('Service not associated with this user');
			}

			const updatedService = await context.di.model.Service.findByIdAndUpdate(
				serviceId,
				{ $set: input },
				{ new: true }
			).lean();

			if (!updatedService) {
				throw new Error('Service not found or update failed');
			}

			await redis.del(`serviceAppointments:${serviceId}`);

			return {
				service: updatedService,
				message: 'Service updated successfully',
			};
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

			await redis.del(`serviceAppointments:${_id}`);

			return {
				success: true,
				message: 'Service deleted successfully',
			};
		},
	},
};
