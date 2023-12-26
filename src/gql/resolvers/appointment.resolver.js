import { v4 as uuidv4 } from 'uuid';

export default {
    Query: {
        userAppointments: async (_, { userId }, context) => {
            // Access Appointment model from context
            return await context.di.model.Appointment.find({ uuid: userId }).populate('serviceId');
        },
        listAllAppointments: async (parent, args, context) => {

            const sortCriteria = { isAdmin: 'desc', registrationDate: 'asc' };
            return await context.di.model.Appointment.find().sort(sortCriteria).lean();

            //    ====> complex version for aggregate data
            //     return await context.di.model.Appointment.aggregate([
            //         {
            //             $lookup: {
            //                 from: "users",
            //                 localField: "uuid",
            //                 foreignField: "uuid",
            //                 as: "user"
            //             }
            //         },
            //         {
            //             $lookup: {
            //                 from: "services",
            //                 localField: "serviceId",
            //                 foreignField: "serviceId",
            //                 as: "service"
            //             }
            //         },
            //         {
            //             $unwind: {
            //                 path: "$user",
            //                 preserveNullAndEmptyArrays: true
            //             }
            //         },
            //         {
            //             $unwind: {
            //                 path: "$service",
            //                 preserveNullAndEmptyArrays: true
            //             }
            //         },
            //         {
            //             $sort: { date: 1 } // Sort by date or any other desired criteria
            //         }
            //     ]);
        }
    },
    Mutation: {
        createAppointment: async (_, { userId, serviceId, date }, context) => {
            const uuid = uuidv4(); // Generate a unique serviceId

            // Create a new appointment using the Appointment model from context
            const data = { uuid, userId, serviceId, date: new Date(date) };
            await new context.di.model.Appointment(data).save();
            return data;
        },
        updateAppointment: async (_, { uuid, newDate, newStatus }, context) => {

            // Update an appointment using the Appointment model from context
            const updateAppointmentData = {};
            if (newDate) updateAppointmentData.date = newDate;
            if (newStatus) updateAppointmentData.status = newStatus;
            return await context.di.model.Appointment.findByIdAndUpdate(
                uuid,
                updateAppointmentData,
                { new: true }
            );


        },
        deleteAppointment: async (_, { uuid }, context) => {
            // Delete an appointment using the Appointment model from context
            const result = await context.di.model.Appointment.deleteOne({ _id: uuid });
            return {
                success: result.deletedCount === 1,
                message: result.deletedCount === 1 ? 'Appointment deleted successfully' : 'Error deleting appointment'
            };
        },
    },
    // ... other resolvers ...
};

