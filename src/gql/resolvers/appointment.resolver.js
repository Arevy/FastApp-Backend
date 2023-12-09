import { v4 as uuidv4 } from 'uuid';

export default {
    Query: {
        userAppointments: async (_, { userId }, context) => {
            // Access Appointment model from context
            return await context.di.model.Appointment.find({ uuid: userId }).populate('serviceId');
        },
    },
    Mutation: {
        createAppointment: async (_, { uuid, serviceId, date }, context) => {
            const appointmentId = uuidv4(); // Generate a unique serviceId

            // Create a new appointment using the Appointment model from context
            await new context.di.model.Appointment({ uuid, serviceId, date }).save();
            // const newAppointment = await context.di.model.Appointment.findOne({ uuid, serviceId, date }).lean();
            return {
                id: appointmentId, user: { uuid }, service: { serviceId }, date
            }
      
        
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

