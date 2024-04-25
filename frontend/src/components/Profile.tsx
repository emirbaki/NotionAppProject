import React, { useState, FormEvent, useEffect } from 'react';
import { TextField, Button, Grid, Alert, AppBar, Toolbar, Box} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import Typography from '@mui/material/Typography';
import { User } from '../utils/Interfaces';

const ProfilePage: React.FC = () => {
    const [username, setUsername] = useState<String>();
    const [password, setPassword] = useState<String>();
    const [repeatPassword, setRepeatPassword] = useState<String>();
    const [error, setError] = useState<String>();


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
            const response = axios.get<User>('http://localhost:3000/profile');
            response.then((user) => {
                //setUsername(user.data.username);
                //setPassword(user.data.password);
                console.log(user.data.username);
                console.log(user);
            });
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    const handleProfile = async () => {
        console.log('Profile');

    };

    const handleLogout = async () => {
        sessionStorage.clear();

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
                    <Link to="/login">
                        <Button sx={{ marginLeft: '670px' }} onClick={handleLogout} variant="contained" disableElevation={true}>Logout</Button>
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
                            <Typography variant="h5" gutterBottom>
                                Username: {_username}
                            </Typography>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Typography variant="h5" gutterBottom>
                                Password: {_password}
                            </Typography>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Button variant="contained" type="submit" color="error">
                                Delete profile
                            </Button>
                        </div>
                    </form>
                </Box>

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
