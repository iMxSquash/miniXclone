import mongoose from 'mongoose';

import mongooseUniqueValidator from 'mongoose-unique-validator';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

UserSchema.plugin(mongooseUniqueValidator);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;