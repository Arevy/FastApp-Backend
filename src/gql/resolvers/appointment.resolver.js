export default {
    Query: {
        userAppointments: async (_, { userId }, context) => {
            // Access Appointment model from context
            return await context.di.model.Appointment.find({ userId }).populate('serviceId');
        },
    },
    Mutation: {
        createAppointment: async (_, { userId, serviceId, date }, context) => {
            // Create a new appointment using the Appointment model from context
            const newAppointment = new context.di.model.Appointment({ userId, serviceId, date });
            return await newAppointment.save();
        },
        updateAppointment: async (_, { appointmentId, newDate }, context) => {
            // Update an appointment using the Appointment model from context
            return await context.di.model.Appointment.findByIdAndUpdate(
                appointmentId,
                { date: newDate },
                { new: true }
            );
        },
        deleteAppointment: async (_, { appointmentId }, context) => {
            // Delete an appointment using the Appointment model from context
            const result = await context.di.model.Appointment.deleteOne({ _id: appointmentId });
            return {
                success: result.deletedCount === 1,
                message: result.deletedCount === 1 ? 'Appointment deleted successfully' : 'Error deleting appointment'
            };
        },
    },
    // ... other resolvers ...
};

