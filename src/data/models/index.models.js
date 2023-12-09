import mongoose from 'mongoose';

import { UsersSchema, AppointmentsSchema, ServicesSchema } from './schemas/index.schema.js';

export const models = {
	Users: mongoose.model('users', UsersSchema),
	Appointment: mongoose.model('appointment', AppointmentsSchema),
	Service: mongoose.model('services', ServicesSchema)
};
