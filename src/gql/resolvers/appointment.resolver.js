/**
 * All resolvers related to appointments
 * @typedef {Object}
 */
import mongoose from 'mongoose';

export default {
	Query: {
		userAppointments: async (_, { userId }, context) => {
			return context.di.model.Appointment.find({ userId })
				.populate('userId')
				.populate('serviceId')
				.lean()
				.then((appointments) =>
					appointments.map((appointment) => ({
						...appointment,
						user: appointment.userId,
						service: appointment.serviceId,
					}))
				);
		},
		fetchServiceAppointments: async (_, { serviceId }, context) => {
			try {
				const appointments = await context.di.model.Appointment.find({
					serviceId: new mongoose.Types.ObjectId(serviceId),
				}).lean();

				if (appointments.length === 0) {
					return [];
				}

				const populatedAppointments = await Promise.all(
					appointments.map(async (appointment) => {
						const user = await context.di.model.Users.findById(
							appointment.userId
						).lean();

						const service = await context.di.model.Service.findById(
							appointment.serviceId
						).lean();

						return {
							...appointment,
							user: user || null,
							service: service || null,
						};
					})
				);

				return populatedAppointments;
			} catch (error) {
				console.error('Error fetching service appointments:', error);
				throw new Error('Failed to fetch service appointments');
			}
		},
		// fetchServiceAppointments: async (_, { serviceId }, context) => {
		// 	try {

		// 		const populatedAppointments = await context.di.model.Appointment.aggregate([
		// 		  {
		// 			$match: { serviceId: new mongoose.Types.ObjectId(serviceId) }  // Convertim stringul în ObjectId
		// 		  },
		// 		  {
		// 			$lookup: {
		// 			  from: 'users',  // Numele colecției de utilizatori
		// 			  localField: 'userId',  // Câmpul din Appointment care se potriveste cu _id-ul din Users
		// 			  foreignField: '_id',
		// 			  as: 'userDetails'
		// 			}
		// 		  },
		// 		  {
		// 			$unwind: {
		// 			  path: '$userDetails',
		// 			  preserveNullAndEmptyArrays: true  // În cazul în care un userId nu se găsește în Users, păstrează documentul
		// 			}
		// 		  },
		// 		  {
		// 			$lookup: {
		// 			  from: 'services',  // Numele colecției de servicii
		// 			  localField: 'serviceId',  // Câmpul din Appointment care se potriveste cu _id-ul din Services
		// 			  foreignField: '_id',
		// 			  as: 'serviceDetails'
		// 			}
		// 		  },
		// 		  {
		// 			$unwind: {
		// 			  path: '$serviceDetails',
		// 			  preserveNullAndEmptyArrays: true  // În cazul în care un serviceId nu se găsește în Services, păstrează documentul
		// 			}
		// 		  },
		// 		  {
		// 			$project: {
		// 			  _id: 1,
		// 			  user: {
		// 				_id: '$userDetails._id',
		// 				email: '$userDetails.email',
		// 				userName: '$userDetails.userName'
		// 			  },
		// 			  service: {
		// 				_id: '$serviceDetails._id',
		// 				name: '$serviceDetails.name',
		// 				category: '$serviceDetails.category'
		// 			  },
		// 			  date: 1,
		// 			  status: 1
		// 			}
		// 		  }
		// 		]);

		// 		console.log('Populated Appointments:', populatedAppointments);
		// 		return populatedAppointments;

		// 	} catch (error) {
		// 		console.error('Error fetching service appointments:', error);
		// 		throw new Error('Failed to fetch service appointments');
		// 	}
		// },
		listAllAppointmentsShort: async (parent, args, context) => {
			const SORT_CRITERIA = { isAdmin: 'desc', registrationDate: 'asc' };
			const appointments = await context.di.model.Appointment.find()
				.sort(SORT_CRITERIA)
				.lean();

			const convertedAppointments = appointments.map(async (appointment) => {
				if (appointment.date) {
					appointment.date = new Date(appointment.date).toISOString();
				}
				return appointment;
			});

			return convertedAppointments;
		},

		listAllAppointmentsById: async (_, args, context) => {
			try {
				// You can use find() to get all appointments if no args provided
				// Or findById() if you're looking for a specific appointment by ID.
				const appointments = await context.di.model.Appointment.find({}).lean();
				return appointments;
			} catch (error) {
				console.error('Error fetching appointments:', error);
				throw new Error('Failed to fetch appointments');
			}
		},

		listAllAppointments: async (_, args, context) => {
			// First, find all appointments.
			const appointments = await context.di.model.Appointment.find().lean();

			// For each appointment, find the corresponding user and service.
			const populatedAppointments = await Promise.all(
				appointments.map(async (appointment) => {
					const user = await context.di.model.Users.findById(
						appointment.userId
					).lean();
					const service = await context.di.model.Service.findById(
						appointment.serviceId
					).lean();

					return {
						...appointment,
						user: user || null,
						service: service || null,
					};
				})
			);

			return populatedAppointments;
		},

		listAllAppointmentsFull: async (_, args, context) => {
			try {
				// Fetch all appointments with user details
				const appointmentsWithUsers = await context.di.model.Appointment.aggregate([
					{
						$lookup: {
							from: 'users',
							localField: 'userId',
							foreignField: '_id',
							as: 'userDetails',
						},
					},
					{
						$unwind: {
							path: '$userDetails',
							preserveNullAndEmptyArrays: true,
						},
					},
					{
						$project: {
							_id: 1,
							user: '$userDetails',
							serviceId: 1,
							date: 1,
							status: 1,
						},
					},
				]).exec();
		
				if (!Array.isArray(appointmentsWithUsers)) {
					throw new Error('Expected appointmentsWithUsers to be an array');
				}
		
				const serviceIds = appointmentsWithUsers
					.map((a) => a.serviceId)
					.filter((id) => id != null);

				const services = await context.di.model.Service.find({
					_id: { $in: serviceIds },
				}).lean();
		
				const serviceMap = services.reduce((acc, service) => {
					acc[service._id.toString()] = service;
					return acc;
				}, {});
		
				const fullAppointments = appointmentsWithUsers.map((appointment) => ({
					...appointment,
					service: serviceMap[appointment.serviceId?.toString()] || null,
				}));
		
				return fullAppointments;
			} catch (error) {
				throw new Error('Failed to fetch appointments details.');
			}
		},
		
	},

	Mutation: {
		createAppointment: async (
			_,
			{ userId, serviceId, date, status },
			context
		) => {
			try {
				const newAppointment = new context.di.model.Appointment({
					userId,
					serviceId,
					date: new Date(date),
					status: status || 'pending',
				});
				await newAppointment.save();
				console.log('Appointment created successfully:', newAppointment);
				return newAppointment;
			} catch (error) {
				console.error('Error creating appointment:', error);
				throw new Error('Failed to create appointment');
			}
		},
		updateAppointment: async (_, { _id, newDate, newStatus }, context) => {
			try {
				const updateFields = {};
				if (newDate) {
					updateFields.date = new Date(newDate);
				}
				if (newStatus) {
					updateFields.status = newStatus;
				}

				const updatedAppointment = await context.di.model.Appointment.findByIdAndUpdate(
					_id,
					{ $set: updateFields },
					{ new: true }
				);

				if (!updatedAppointment) {
					throw new Error('Appointment not found');
				}

				return updatedAppointment;
			} catch (error) {
				console.error('Error updating appointment:', error);
				throw new Error('Failed to update appointment');
			}
		},
		deleteAppointment: async (_, { _id }, context) => {
			try {
				const result = await context.di.model.Appointment.findByIdAndDelete(
					_id
				);
				return {
					success: true,
					message: result
						? 'Appointment deleted successfully'
						: 'Appointment not found',
				};
			} catch (error) {
				console.error('Error deleting appointment:', error);
				throw new Error(
					'An error occurred while trying to delete the appointment'
				);
			}
		},
	},
};
