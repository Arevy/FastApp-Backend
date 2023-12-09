import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AppointmentsSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'canceled'],
        default: 'pending'
    },
    // Additional fields as needed
});

// export const Appointment = mongoose.model('Appointment', AppointmentsSchema);

export { AppointmentsSchema };
