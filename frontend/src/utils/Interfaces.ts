import moongose, { ObjectId } from "mongoose";
interface Note {
    id: string;
    title: string;
    content: string;
}
interface NoteProps {
    id: string;
    title: string;
    content?: string; // Optional content
    onUpdate: (content: string) => void;
    onDeleteNote: (id: string) => void; // Function to handle note deletion (pass note ID)
    onShare: () => void; // Function to handle note sharing logic
}
interface NoteContentProps {
    content?: string; // Optional content
    onUpdate: (content: string) => void;
}

export type {Note, NoteProps, NoteContentProps}