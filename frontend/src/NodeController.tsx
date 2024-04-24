import './App.css';
import NoteObject from './components/Note';
import { useState, useEffect } from 'react';
import { AppBar, Box, Grid, Toolbar, Typography, Button } from '@mui/material';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import {Note} from './utils/Interfaces';
import { Link } from 'react-router-dom';
import { User } from './utils/Interfaces';


const MainPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    useEffect(() => {
        readNotes();
    }, []);

    const readNotes = async () => {
        try {
            const response = await axios.get<Note[]>('http://localhost:3000/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const updateNote = async (content : string) => {
        const id = selectedNote?.id
        try {
            await axios.put(`http://localhost:3000/notes/${id}`, {content_thing: content});
        } catch (error) {
            console.error('Error updating notes:', error);
        }

    };

    const handleNoteClick = (id: number) => {
        const note = notes.find((note) => note.id === id);
        setSelectedNote(note || null);
    };

    const deleteNote = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3000/notes/${id}`);
            setNotes(notes.filter((note) => note.id !== id));
            setSelectedNote(null);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleShare = () => {
        // Implement sharing logic here
        console.log('Share note');
    };


    const handleProfile = async () => {
        console.log('Profile');

    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">
                        My Notes
                    </Typography>
                    <Link to="/profile">
                        <Button sx={{ marginLeft: '250px' }} onClick={handleProfile} variant="contained" disableElevation={true}>Profile</Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <Grid container p={2}>
                    <Grid item>
                        <Sidebar notes={notes} onNoteClick={handleNoteClick} />
                    </Grid>
                    {selectedNote && (
                            <NoteObject
                                id={selectedNote.id}
                                title={selectedNote.title}
                                content={selectedNote.content}
                                onUpdate={updateNote}
                                onDeleteNote={() => deleteNote(selectedNote.id)}
                                onShare={handleShare}
                            />
                        )}

                </Grid>
            </Box>
        </div>
    );
};

export default MainPage;
