
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ServicesSchema = new Schema({
	serviceId: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	isActive: {
		type: Boolean,
		required: true,
		default: true
	}
});

export { ServicesSchema };
