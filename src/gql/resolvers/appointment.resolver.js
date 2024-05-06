/**
 * All resolvers related to appointments
 * @typedef {Object}
 */

export default {
	Query: {
		userAppointments: async (_, { userId }, context) => {
			return context.di.model.Appointment.find({ userId }).lean();
		},
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
					const user = await context.di.model.User.findById(
						appointment.userId
					).lean();
					const service = await context.di.model.Service.findById(
						appointment.serviceId
					).lean();

					// Return a new object that combines the appointment with user and service info.
					// If user or service is not found, set them as null or a default object.
					return {
						...appointment,
						user: user || null, // You could set default user info if needed
						service: service || null, // You could set default service info if needed
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

				console.log(
					'Appointments with user details:',
					JSON.stringify(appointmentsWithUsers, null, 2)
				);

				const serviceIds = appointmentsWithUsers
					.map((a) => a.serviceId)
					.filter((id) => id != null);
				console.log('Service IDs being queried:', serviceIds);

				const services = await context.di.model.Service.find({
					_id: { $in: serviceIds },
				}).lean();
				console.log('Services found:', JSON.stringify(services, null, 2));

				const serviceMap = services.reduce((acc, service) => {
					acc[service._id.toString()] = service;
					return acc;
				}, {});

				const fullAppointments = appointmentsWithUsers.map((appointment) => ({
					...appointment,
					service: serviceMap[appointment.serviceId?.toString()] || null,
				}));

				console.log(
					'Combined full appointments:',
					JSON.stringify(fullAppointments, null, 2)
				);
				return fullAppointments;
			} catch (error) {
				console.error('Error fetching appointments with details:', error);
				throw new Error('Failed to fetch appointments details.');
			}
		},

	},

	Mutation: {
		createAppointment: async (_, { userId, serviceId, date }, context) => {
			try {
				const newAppointment = new context.di.model.Appointment({
					userId,
					serviceId,
					date: new Date(date),
					status: 'pending'
				});
				await newAppointment.save();
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
