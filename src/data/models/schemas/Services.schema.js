import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ServicesSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
		description: {
			type: String,
			required: false,
		},
		imageUrl: {
			type: String,
			required: false,
		},
	},
	{ timestamps: true }
);

export { ServicesSchema };
