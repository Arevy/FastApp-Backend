import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

/**
 * Users schema
 * @constructor Users model constructor
 * */
const UsersSchema = new Schema(
	{
		userType: {
			type: String,
			enum: ['NORMAL_USER', 'SERVICE_USER', 'ADMIN_USER'],
			default: 'NORMAL_USER',
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		userName: {
			type: String,
			required: true,
			unique: false,
			trim: true,
			lowercase: false,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		// serviceId: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: 'Service',
		// 	required: false,
		// },
		serviceId: {
			type: Schema.Types.ObjectId,
			ref: 'Service',
			required: function () {
				return this.userType === 'SERVICE_USER' && this.serviceId != null;
			},
			default: null,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		registrationDate: {
			type: Date,
			default: Date.now,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

/**
 * Hash the password of user before save on database
 */
UsersSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	bcrypt.genSalt((err, salt) => {
		if (err) {
			return next(err);
		}
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) {
				return next(err);
			}
			this.password = hash;
			next();
		});
	});
});

export { UsersSchema };
