import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
    {
        name: {type: String, require: true, unique: true},
        password: {type: String, require: true},
    },
    {collection: 'user_data'}
)

export const User = mongoose.model('User', UserModel);