import './App.css';
import { useState, useEffect } from 'react';
import { AppBar, Box, Grid, Toolbar, Typography, Button, Avatar } from '@mui/material';
import Sidebar from './components/Sidebar';
import axios from 'axios';
import { Notification as NotificationType } from './utils/Interfaces.js';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter, stringAvatar, stringToColor, avatar } from './utils/Util.js';
import { User, Collection } from './utils/Interfaces.js';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

import NotificationMenu from './components/Notification';
import CollectionObject from './components/CollectionView';

const MainPage: React.FC = () => {


    const _username = sessionStorage.getItem("username");
    const _password = sessionStorage.getItem("password");
    let userId = "";

    if (_username == null || _password == null) {
        window.location.href = "http://localhost:3001/login";

    }


    useEffect(() => {
        // readNotes();
        readProfile();
        readCollections(userId);
    }, [userId]);

    const readProfile = async () => {
        try {
            const response = axios.get<User>(`http://localhost:3000/profile/${_username}`);
            response.then((user) => {
                sessionStorage.setItem("email", user.data.email);
                sessionStorage.setItem("name", user.data.name);
                sessionStorage.setItem("surname", user.data.surname);
                userId = user.data._id;
            });
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    // const handleNoteClick = (id: string) => {
    //     console.log("clickten gelen id", id);
    //     const note = notes.find((note) => note._id === id);
    //     if (note !== null) console.log("yalvarırım: " + note!._id);
    //     setSelectedNote(note || null);
    // };



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

    const readCollections = async (userId: string) => {
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const response = await axios.get<Collection[]>(`http://localhost:3000/collections/?userId=${userId}`, );

            setCollections(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const deleteCollection = async(id: string) => {
        console.log("Deleting note with ID:", id);
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await axios.delete(`http://localhost:3000/collections/${id}`);
            setCollections(collections.filter(collection => collection._id !== id));
        } catch (error) {
            console.error('Error deleting note:', error);
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
                        <Sidebar />
                    </Grid>
                    {
                        collections.map((collection) => (
                            <CollectionObject 
                                id={collection._id}
                                title={collection.title}
                                onUpdateNote={function (index, title, content) {
                                    throw new Error('Function not implemented.');
                                } } onAddNote={function (): void {
                                    throw new Error('Function not implemented.');
                                } } onShare={handleShare}
                                    deleteCollection={() => deleteCollection(collection._id)}/>
                        ))

                    }


                </Grid>
            </Box>
        </div>
    );
};

export default MainPage;
