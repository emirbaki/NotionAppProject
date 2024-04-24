interface Note {
    id: number;
    title: string;
    content: string;
}
interface NoteProps {
    id: number;
    title: string;
    content?: string; // Optional content
    onUpdate: (content: string) => void;
    onDeleteNote: (id: number) => void; // Function to handle note deletion (pass note ID)
    onShare: () => void; // Function to handle note sharing logic
}
interface NoteContentProps {
    content?: string; // Optional content
    onUpdate: (content: string) => void;
}
interface User {
    username: string;
    password: string;
}
export type {Note, NoteProps, NoteContentProps, User}