
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
});

export { ServicesSchema };
