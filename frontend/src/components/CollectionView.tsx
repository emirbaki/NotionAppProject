import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, CardHeader, IconButton } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import EditableNote from './EditableNote';
import { Collection, Note} from '../utils/Interfaces';
import axios from 'axios';



async function fetchNotes(id: string): Promise<Note[]> {
    try {
        const response = await axios.get<Collection>(`http://localhost:3000/collections/${id}`);
        console.log(response.data);
        if (!response.data || !response.data.noteCollection) {
            console.error('Invalid response data or missing notes property');
            return [];
        }

        const noteIDs = response.data.noteCollection;

        // Ensure notes is an array (might be undefined or null)
        if (!Array.isArray(noteIDs)) {
            console.error('Unexpected notes data format (not an array)');
            return [];
        }
        const notes : Note[] = [];

        for(const noteID of noteIDs){
            const response = await axios.get<Note>(`http://localhost:3000/notes/${noteID}`)
            console.log(response.data);
            notes.push(response.data);
            console.log("sayı:", notes.length);
        }
        // Handle empty notes array using optional chaining and default value
        console.log("notes ", notes)
        return notes;
    } catch (error) {
        console.error('Error fetching notes:', error);
        return []; // Return empty array on error
    }
}
const CollectionObject = ({id, title, onUpdateNote }: {id:string; title: string; onUpdateNote: (index: number, title: string, content: string) => void }) => {
    const Root = styled(Card)({
        marginBottom: '16px',

    });
    const [notes, setNotes] = useState<Note[]>([]);
    useEffect(() => {
        readNotes();
    }, []);
    const readNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setNotes(await fetchNotes(id));
            console.log(notes.length);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };
    return (
        <Root>
            <CardHeader
                title={title}
                action={
                    <IconButton aria-label="add note">
                        <AddCircleOutline />
                    </IconButton>
                }
            />
            <CardContent>
                {notes.map((note, index) => (
                    <EditableNote
                        key={index}
                        title={note.title}
                        content={note.content!}
                        onUpdate={(newTitle: string, newContent: string) => onUpdateNote(index, newTitle, newContent)}
                    />
                ))}
            </CardContent>
        </Root>
    );
};

export default CollectionObject;
