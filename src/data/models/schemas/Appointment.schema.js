import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AppointmentsSchema = new Schema({
	uuid: {
		type: mongoose.Schema.Types.String,
		ref: 'Appoiment',
		required: false
	},
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

export { AppointmentsSchema };
