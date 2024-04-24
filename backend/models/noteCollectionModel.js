import mongoose from "mongoose";

const NoteCollectionModel = new mongoose.Schema(
    {
        user: {type : mongoose.Schema.ObjectId, require: true, ref: 'User'},
        title: {type: String, require: true},
        noteCollection: [{type: mongoose.Schema.ObjectId, ref: 'Note'}]
    },
    {collection: 'collections',
        timestamps: true},
)

export const NoteCollection = mongoose.model('NoteCollection', NoteCollectionModel);