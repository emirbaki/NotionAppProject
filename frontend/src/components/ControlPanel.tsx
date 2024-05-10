import React, { useState, useEffect, FormEvent } from 'react';
import { TextField, Button, Grid, Alert, AppBar, Toolbar, Box, Avatar, Typography, Divider, Popover } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import { User, _Friendship, Collection } from '../utils/Interfaces';
import { capitalizeFirstLetter, stringAvatar, stringToColor, avatar, handleLogout, HomeIcon } from '../utils/Util.js';
import NotificationMenu from './Notification';
import CollectionObject from './CollectionView';


const ControlPanel: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searchResults_2, setSearchResults_2] = useState<User>(); 
    const [searchResults_4, setSearchResults_4] = useState<User[]>([]);


    const [friendshipExists, setFriendshipExists] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [error, setError] = useState<String>();
    const [collections, setCollections] = useState<Collection[]>([]);




    const _username = sessionStorage.getItem("username");
    const _admin = sessionStorage.getItem("admin");
    const _password = sessionStorage.getItem("password");


    if (_username == null || _password == null || _admin === "false") {
        window.location.href = "http://localhost:3001/login";

    }
    

    const handleSearch = () => {
        // Perform search logic here (fetch data from API)
        axios.get(`/profile/${searchTerm}`)
            .then(response => {
                setSearchResults([response.data]); // Assuming response.data is the user object
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setSearchResults([]); // Clear search results if error occurs
            });
    };


    const handleSearch_2 = (username: string) => {
        // Perform search logic here (fetch data from API)
        axios.get<User>(`http://localhost:3000/profile/${username}`)
            .then(response => {
                const userData = response.data; // Access the response data
                setSearchResults_2(userData); // Set the search results
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };

    const handleSearch_3 = async(id: string) => {
        // Perform search logic here (fetch data from API)
        const response = await axios.get<Collection[]>(`http://localhost:3000/collections/?userId=${id}`,);

        setCollections(response.data);
    };

    const handleSearch_4 = (usern: string) => {
        // Perform search logic here (fetch data from API)
        axios.get<_Friendship>(`http://localhost:3000/friendship/${usern}`)
            .then(response => {
                console.log(response.data);
                const friendships: _Friendship[] = response.data.friends;
                const usernames = friendships.map((friendship: _Friendship) => {
                    if (friendship.username_1 === usern) {
                        console.log(friendship.username_2);
                        return friendship.username_2;
                    } else {
                        console.log(friendship.username_1);

                        return friendship.username_1;
                    }
                });
                const profileRequests = usernames.map(username =>
                    axios.get(`/profile/${username}`)
                        .then(response => response.data)
                        .catch(error => {
                            console.error('Error fetching user data:', error);
                            return null; // Return null if error occurs
                        })
                );

                // Wait for all profile requests to resolve
                Promise.all(profileRequests)
                    .then(profiles => {
                        setSearchResults_4(profiles.filter(profile => profile !== null)); // Filter out null profiles
                    })
                    .catch(error => {
                        console.error('Error fetching user profiles:', error);
                        setSearchResults_4([]); // Clear search results if error occurs
                    });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setSearchResults_4([]); // Clear search results if error occurs
            });
    };


    const checkFriendship = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/friendship/${_username}/${searchTerm}`);
            setFriendshipExists(response.data.exists);
        } catch (error) {
            console.error('Error checking friendship:', error);
        }
    };

    useEffect(() => {
        checkFriendship();
    }, [searchResults]); // Re-run check when search results change

    const handleClick_Pop = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleProfileDeletion = async (username: string) => {
        const response = await axios.post('http://localhost:3000/profile/delete', { username: username });
        setError("");
        if (response.status === 200) {
            setSearchResults_2(undefined);
            window.location.reload();

        }
    };

    const deleteCollection = async (id: string) => {
        console.log("Deleting note with ID:", id);
        try {
            await axios.delete(`http://localhost:3000/collections/${id}`);
            setCollections(collections.filter(collection => collection._id !== id));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleClickDeleteFriend = async (usern: string, username: string) => {
        try {
            await axios.post('http://localhost:3000/friendship/delete', { username_1: usern, username_2: username });
            setFriendshipExists(false);
            window.location.reload();
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
                    {_admin === "true" ? (
                        <Link to="/controlpanel">
                            <Button variant="contained" disableElevation={true}>Control Panel</Button>
                        </Link>
                    ) : (
                        <div>

                        </div>
                    )}
                    <Avatar {...stringAvatar(capitalizeFirstLetter(avatar))} sx={{ marginLeft: '1100px', bgcolor: stringToColor(avatar) }} />
                    <Link to="/profile">
                        <Button variant="contained" disableElevation={true}>Profile</Button>
                    </Link>
                    <Link to="/friend">
                        <Button variant="contained" disableElevation={true}>Friends</Button>
                    </Link>
                    <Link to="/login">
                        <Button onClick={handleLogout} variant="contained" disableElevation={true}>Logout</Button>
                    </Link>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '100vh',
                    padding: '20px',
                }}
            >

                <Typography variant="h6" gutterBottom>
                    Search an User
                </Typography>

                <TextField
                    label="Search Username"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    sx={{ marginBottom: '20px' }}
                />
                <Button onClick={handleSearch} variant="contained" disableElevation={true} sx={{ marginBottom: '20px' }}>Search</Button>
                {searchResults.map(user => (
                    <div key={user.username} style={{ marginBottom: '10px', textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar {...stringAvatar(capitalizeFirstLetter(capitalizeFirstLetter(user.name) + ' ' + capitalizeFirstLetter(user.surname)))} sx={{ bgcolor: stringToColor(capitalizeFirstLetter(user.name) + ' ' + capitalizeFirstLetter(user.surname)) }} />
                            <Typography variant="body1">{user.username}</Typography>
                        </Box>
                        { }
                        <Button
                            variant="contained"
                            disableElevation={true}
                            onClick={() => {
                                handleSearch_2(user.username);
                                handleSearch_3(user._id);
                                handleSearch_4(user.username);
                            }}
                        >
                            Check User
                        </Button>    
                    </div>
                ))}

                <Divider orientation="horizontal" flexItem sx={{ marginTop: '50px' }} />
                <Typography variant="h6" gutterBottom>
                    User Profile
                </Typography>
                <Box>
                    {searchResults_2 && (
                        <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar {...stringAvatar(capitalizeFirstLetter(capitalizeFirstLetter(searchResults_2.name) + ' ' + capitalizeFirstLetter(searchResults_2.surname)))} sx={{ bgcolor: stringToColor(capitalizeFirstLetter(searchResults_2.name) + ' ' + capitalizeFirstLetter(searchResults_2.surname)) }} />
                                <Typography variant="body1">{searchResults_2.username}</Typography>

                                    <div style={{ marginBottom: '8px' }}>
                                        <Typography variant="h6" gutterBottom>
                                            Name: {searchResults_2.name}
                                        </Typography>
                                    </div>
                                    <div style={{ marginBottom: '8px' }}>
                                        <Typography variant="h6" gutterBottom>
                                            Surname: {searchResults_2.surname}
                                        </Typography>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Typography variant="h6" gutterBottom>
                                            Email: {searchResults_2.email}
                                        </Typography>
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <Button aria-describedby={id} variant="contained" onClick={handleClick_Pop} color="error">
                                            Delete profile
                                        </Button>
                                        <Popover
                                            id={id}
                                            open={open}
                                            anchorEl={anchorEl}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            sx={{ textAlign: 'center' }}
                                        >
                                            <Typography sx={{ p: 2 }}>Are you sure that you want to delete your account?</Typography>
                                            <Button 
                                                variant="contained"
                                                onClick={() => handleProfileDeletion(searchResults_2.username)} 
                                                color="error" 
                                                sx={{ marginRight: '5px', marginBottom: '5px' }}
                                            >
                                                Yes, Delete profile
                                            </Button>

                                            <Button variant="contained" onClick={handleClose} color="primary" sx={{ marginBottom: '5px' }}>
                                                No, Come back
                                            </Button>
                                        </Popover>
                                    </div>
                            </Box>
                        </div>
                    )}
                    <Divider orientation="horizontal" flexItem sx={{ marginTop: '50px' }} />


                    <Typography variant="h6" gutterBottom sx={{ marginBottom: '10px', textAlign: 'center'}} >
                        User Collections an Notes
                    </Typography>

                    {
                        collections.map((collection) => (
                            <CollectionObject
                                id={collection._id}
                                title={collection.title}
                                onUpdateNote={function (index, title, content) {
                                    //add
                                }} onAddNote={function (): void {
                                    //add
                                }} onShare={function (): void {
                                
                                }}
                                deleteCollection={() => deleteCollection(collection._id)} />
                        ))

                    }

                    <Divider orientation="horizontal" flexItem sx={{ marginTop: '50px' }} />

                    <Typography variant="h6" gutterBottom sx={{ marginBottom: '10px', textAlign: 'center'}} >
                        User Friends
                    </Typography>

                    {searchResults_4.map(user => (
                        <div key={user.username} style={{ marginBottom: '10px', textAlign: 'center', marginRight: '15px', marginLeft: '15px' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Avatar {...stringAvatar(capitalizeFirstLetter(capitalizeFirstLetter(user.name) + ' ' + capitalizeFirstLetter(user.surname)))} sx={{ bgcolor: stringToColor(capitalizeFirstLetter(user.name) + ' ' + capitalizeFirstLetter(user.surname)) }} />
                                <Typography variant="body1">{user.username}</Typography>
                            </Box>
                            { }

                            <Button
                                variant="contained"
                                disableElevation={true}
                                onClick={() => handleClickDeleteFriend(searchTerm, user.username)}
                                color="error"
                            >
                                Delete
                            </Button>


                        </div>
                    ))}

                </Box>

            </Box>

        </div>
    );
};

export default ControlPanel;
