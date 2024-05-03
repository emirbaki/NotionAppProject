import mongoose from "mongoose";

const NoteModel = new mongoose.Schema(
    {
        user: {type : mongoose.Schema.ObjectId, require: true, ref: 'User'},
        title: {type: String, require: true},
        content: {type: String, require: true},
    },
    {collection: 'notes',
        timestamps: true},
)

export const Note = mongoose.model('Note', NoteModel);