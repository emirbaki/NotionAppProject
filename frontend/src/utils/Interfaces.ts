
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
interface User {
    username: string;
    password: string;
    email: string;
    name: string;
    surname: string;
}
interface Notification {
    _id: string;
    user: string;
    type: string;
    content?: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
interface _Friendship{
    _id: string;
    username_1: string;
    username_2: string;
    friends: _Friendship[];
}

interface Note_ {
    _id: string; // Assuming _id is a string
    // Other properties of Note
}
  interface Collection {
    _id: string; // Assuming your collection has an _id property
    title: string;
    noteCollection: Note_[];
    // ... other collection properties
}
export type { Note, NoteProps, NoteContentProps, User, Notification, Note_, Collection, _Friendship }