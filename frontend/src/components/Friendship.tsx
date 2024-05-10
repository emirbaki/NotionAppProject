import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Alert, AppBar, Toolbar, Box, Avatar, Typography, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import { User, _Friendship } from '../utils/Interfaces';
import { capitalizeFirstLetter, stringAvatar, stringToColor, avatar, handleLogout, HomeIcon } from '../utils/Util.js';
import NotificationMenu from './Notification';


const Friendship: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [searchResults_2, setSearchResults_2] = useState<User[]>([]);

    const [friendshipExists, setFriendshipExists] = useState<boolean>(false);

    const _username = sessionStorage.getItem("username");

    useEffect(() => {
        handleSearch_2();
    }, []);

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


    const handleSearch_2 = () => {
        // Perform search logic here (fetch data from API)
        axios.get<_Friendship>(`http://localhost:3000/friendship/${_username}`)
            .then(response => {
                console.log(response.data);
                const friendships: _Friendship[] = response.data.friends;
                const usernames = friendships.map((friendship: _Friendship) => {
                    if (friendship.username_1 === _username) {
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
                        setSearchResults_2(profiles.filter(profile => profile !== null)); // Filter out null profiles
                    })
                    .catch(error => {
                        console.error('Error fetching user profiles:', error);
                        setSearchResults_2([]); // Clear search results if error occurs
                    });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setSearchResults_2([]); // Clear search results if error occurs
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

    const handleClick = async () => {
        try {
            await axios.post('http://localhost:3000/friendship/', { username_1: _username, username_2: searchTerm });
            setFriendshipExists(true);
            window.location.reload();
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleClickDelete = async () => {
        try {
            await axios.post('http://localhost:3000/friendship/delete', { username_1: _username, username_2: searchTerm });
            setFriendshipExists(false);
            window.location.reload();
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleClickDeleteFriend = async (username: string) => {
        try {
            await axios.post('http://localhost:3000/friendship/delete', { username_1: _username, username_2: username });
            setFriendshipExists(false);
            window.location.reload();
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        checkFriendship();
    }, [searchResults]); // Re-run check when search results change

    return (
        <div>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="h6" color="inherit">
                        My Notes
                    </Typography>
                    <NotificationMenu username={_username}></NotificationMenu>
                    <Link to="/">
                        <HomeIcon sx={{ marginLeft: '20px', marginTop: '3px' }} fontSize="medium" />
                    </Link>
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
                    Search a New Friend
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
                        {}
                        {friendshipExists ?
                            <Button variant="contained" disableElevation={true} onClick={handleClickDelete}>
                                Friendship Exists
                            </Button> :
                            <Button variant="contained" disableElevation={true} onClick={handleClick}>
                                Become Friends
                            </Button>
                        }
                    </div>
                ))}

                <Divider orientation="horizontal" flexItem sx={{ marginTop: '50px' }} />
                <Typography variant="h6" gutterBottom>
                    My Friends
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {searchResults_2.map(user => (
                        <div key={user.username} style={{ marginBottom: '10px', textAlign: 'center', marginRight: '15px', marginLeft: '15px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar {...stringAvatar(capitalizeFirstLetter(capitalizeFirstLetter(user.name) + ' ' + capitalizeFirstLetter(user.surname)))} sx={{ bgcolor: stringToColor(capitalizeFirstLetter(user.name) + ' ' + capitalizeFirstLetter(user.surname)) }} />
                            <Typography variant="body1">{user.username}</Typography>
                        </Box>
                        { }

                            <Button
                                variant="contained"
                                disableElevation={true}
                                onClick={() => handleClickDeleteFriend(user.username)}
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

export default Friendship;
