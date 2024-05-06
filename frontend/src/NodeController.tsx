import './App.css';
import NoteObject from './components/Note';
import { useState, useEffect } from 'react';
import { AppBar, Box, Grid, Toolbar, Typography, Button, Avatar } from '@mui/material';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import { Note, Notification as NotificationType } from './utils/Interfaces';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter, stringAvatar, stringToColor, avatar } from './utils/Util.js';
import { User, Collection } from './utils/Interfaces';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

import NotificationMenu from './components/Notification';
import CollectionObject from './components/CollectionView';
import EditableNote from './components/EditableNote';





const MainPage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    const _username = sessionStorage.getItem("username");
    const _password = sessionStorage.getItem("password");


    if (_username == null || _password == null) {
        window.location.href = "http://localhost:3001/login";

    }


    useEffect(() => {
        readNotes();
        readProfile();
        readCollections();
    }, []);


    const readNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const response = await axios.get<Note[]>('http://localhost:3000/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const updateNote = async (content: string) => {
        const id = selectedNote?.id
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await axios.put(`http://localhost:3000/notes/${id}`, { content_thing: content });
        } catch (error) {
            console.error('Error updating notes:', error);
        }

    };


    const readProfile = async () => {
        try {
            const response = axios.get<User>(`http://localhost:3000/profile/${_username}`);
            response.then((user) => {
                sessionStorage.setItem("email", user.data.email);
                sessionStorage.setItem("name", user.data.name);
                sessionStorage.setItem("surname", user.data.surname);
            });
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleNoteClick = (id: string) => {
        console.log("clickten gelen id", id);
        const note = notes.find((note) => note.id === id);
        if (note !== null) console.log("yalvarırım: " + note!.id);
        setSelectedNote(note || null);
    };

    const deleteNote = async (id: string) => {
        console.log("Deleting note with ID:", id);
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await axios.delete(`http://localhost:3000/notes/${id}`);
            setNotes(notes.filter((note) => note.id !== id));
            // setSelectedNote(null);
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

    const handleLogout = async () => {
        sessionStorage.clear();

    };


    function HomeIcon(props: SvgIconProps) {
        return (
            <SvgIcon {...props}>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </SvgIcon>
        );
    }
    const notification: NotificationType = {
        _id: '1',
        user: 'user123',
        type: 'friend_request',
        content: 'You have a new friend request',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const [collections, setCollections] = useState<Collection[]>([]);

    const readCollections = async () => {
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const response = await axios.get<Collection[]>(`http://localhost:3000/collections/`);

            setCollections(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };
    return (
        <div>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">
                        My Notes
                    </Typography>
                    <NotificationMenu userId={''}></NotificationMenu>
                    <Link to="/">
                        <HomeIcon sx={{ marginLeft: '20px', marginTop: '3px' }} fontSize="medium" />
                    </Link>
                    <Avatar {...stringAvatar(capitalizeFirstLetter(avatar))} sx={{ marginLeft: '1200px', bgcolor: stringToColor(avatar) }} />
                    <Link to="/profile">
                        <Button onClick={handleProfile} variant="contained" disableElevation={true}>Profile</Button>
                    </Link>
                    <Link to="/login">
                        <Button onClick={handleLogout} variant="contained" disableElevation={true}>Logout</Button>
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
                    {
                        collections.map((collection) => (
                            <CollectionObject 
                            id={collection._id} 
                            title={collection.title} 
                            onUpdateNote={function (index, title, content) {
                                throw new Error('Function not implemented.');
                            }}/>
                        ))

                    }


                </Grid>
            </Box>
        </div>
    );
};

export default MainPage;
