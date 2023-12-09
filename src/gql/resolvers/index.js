import merge from 'lodash.merge';

import users from './users.resolver.js';
import auth from './auth.resolver.js';
import appointments from './appointment.resolver.js';
import service from './service.resolver.js';

export const resolvers = merge(
	users,
	auth,
	appointments,
	service
);
