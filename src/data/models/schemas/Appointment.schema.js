import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AppointmentsSchema = new Schema({
	userId: {
		type: String,
		ref: 'users',
		required: true,
		index: true // Index this field for better query performance
	},
	serviceId: {
		type: String,
		ref: 'services',
		required: true,
		index: true // Index this field for better query performance
	},
	date: {
		type: Date,
		required: true,
	},
	status: {
		type: String,
		enum: ['pending', 'confirmed', 'completed', 'canceled'],
		default: 'pending',
	},
});


export { AppointmentsSchema };
