import mongoose from 'mongoose';

import mongooseUniqueValidator from 'mongoose-unique-validator';

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
        default: '/uploads/defaultAvatar.png',
    },
    banner: {
        type: String,
        required: false,
        default: '/uploads/defaultBanner.png',
    },
    followers: {
        type: Array,
        required: false,
        default: [],
    },
    following: {
        type: Array,
        required: false,
        default: [],
    },
    likes: {
        type: Array,
        required: false,
        default: [],
    },
    retweets: {
        type: Array,
        required: false,
        default: [],
    },
    tweets: {
        type: Array,
        required: false,
        default: [],
    },
    bio: {
        type: String,
        required: false,
        default: '',
    },
    location: {
        type: String,
        required: false,
        default: '',
    },
}, {
    timestamps: true,
});

UserSchema.plugin(mongooseUniqueValidator);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;