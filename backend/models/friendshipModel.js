import mongoose from "mongoose";

const friendshipModel = new mongoose.Schema(
    {
        username_1: { type: String, require: true },
        username_2: { type: String, require: true },

    },
    {
        collection: 'friendship',
        timestamps: true
    },
)

export const Friendship = mongoose.model('Friendship', friendshipModel);