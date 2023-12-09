
import mongoose from 'mongoose';

import { randomUUID } from 'crypto';

const Schema = mongoose.Schema;

const ServicesSchema = new Schema({
    serviceId: {
        type: String,
        required: false,
        unique: true,
        // default: randomUUID
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
// ServicesSchema.pre("save", () => { console.log("+++++++++") });
// export const Service = mongoose.model('Service', ServicesSchema);
export { ServicesSchema };
