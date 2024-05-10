import React, { useState, FormEvent, useEffect } from 'react';
import { TextField, Button,AppBar, Toolbar, Box, Avatar, Divider, Popover } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import Typography from '@mui/material/Typography';
import { User } from '../utils/Interfaces';
import { capitalizeFirstLetter, stringAvatar, stringToColor, avatar, handleLogout, HomeIcon } from '../utils/Util.js';
import NotificationMenu from './Notification';


const ProfilePage: React.FC = () => {
    const [username, setUsername] = useState<String>();
    const [password, setPassword] = useState<String>();
    const [repeatPassword, setRepeatPassword] = useState<String>();
    const [error, setError] = useState<String>();
    const [_email, setEmail] = useState<String>();
    const [_name, setName] = useState<String>();
    const [_surname, setSurname] = useState<String>();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);



    const _username = sessionStorage.getItem("username");
    const _password = sessionStorage.getItem("password");

    if (_username == null || _password == null) {
        window.location.href = "http://localhost:3001/login";

    }

    useEffect(() => {
        readProfile();
        setUsername('');
        setPassword('');
        setRepeatPassword('');
        setError('');
     }, []);
    
    const handleProfileDeletion = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:3000/profile/delete', { username: _username});
        setError("");
        if (response.status === 201) {
            sessionStorage.clear();
            window.location.href = "http://localhost:3001/login";
        }
    };

    const readProfile = async () => {
        try {
            const response = axios.get<User>(`http://localhost:3000/profile/${_username}`);
            response.then((user) => {
                //setUsername(user.data.username);
                //setPassword(user.data.password);
                console.log(user.data.username);
                setEmail(user.data.email);
                setName(user.data.name);
                setSurname(user.data.surname);
            });
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password == repeatPassword || password === '') {
            const response = await axios.post('http://localhost:3000/profile/update', { username: _username, password: password });
            setError("");
            if (response.status === 201) {
                sessionStorage.clear();
                window.location.href = "http://localhost:3001/login";
            } else if (response.status === 500){
                setError("Error"); 
            }
        } else {
            setError("Passwords don't match");
        }
    };


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            >
                <Box sx={{ width: '50%', marginRight: '20px', textAlign: 'center' }}>
                    <h2 style={{ textAlign: 'center' }}>Profile Details</h2>
                    <form onSubmit={handleProfileDeletion}>
                        <div style={{ marginBottom: '8px' }}>
                            <Typography variant="h6" gutterBottom>
                                Username: {_username}
                            </Typography>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <Typography variant="h6" gutterBottom>
                                Name: {_name}
                            </Typography>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <Typography variant="h6" gutterBottom>
                                Surname: {_surname}
                            </Typography>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Typography variant="h6" gutterBottom>
                                Email: {_email}
                            </Typography>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Button aria-describedby={id} variant="contained" onClick={handleClick} color="error">
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
                                <Button variant="contained" type="submit" color="error" sx={{ marginRight: '5px', marginBottom: '5px' }}>
                                    Yes, Delete profile
                                </Button>

                                <Button variant="contained" onClick={handleClose} color="primary" sx={{ marginBottom: '5px' }}>
                                    No, Come back
                                </Button>
                            </Popover>
                        </div>
                    </form>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ width: '50%', marginLeft: '20px', textAlign: 'center' }}>
                    <h2 style={{ textAlign: 'center' }}>Change Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '8px' }}>
                            <TextField
                                variant="outlined"
                                type="text"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <TextField
                                variant="outlined"
                                type="text"
                                label="Repeat Password"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Button variant="contained" type="submit" color="warning">
                                Change
                            </Button>
                        </div>
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                    </form>
                </Box>
            </Box>
        </div>
    );
};

export default ProfilePage;
