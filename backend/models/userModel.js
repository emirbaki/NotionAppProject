import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {type: String, require: true, unique: true},
        password: {type: String, require: true},
        email: {type: String, require: true},
        name: {type: String, require: true},
        surname: {type: String, require: true},
    },
    {collection: 'users'
,timestamps: true}
)

export const User = mongoose.model('User', UserSchema);