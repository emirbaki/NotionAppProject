import React, { useState, FormEvent, useEffect } from 'react';
import { TextField, Button, Grid, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import Typography from '@mui/material/Typography';
import { User } from '../utils/Interfaces';


const ProfilePage: React.FC = () => {
    const [username, setUsername] = useState<String>();
    const [password, setPassword] = useState<String>();


    useEffect(() => {
        readProfile();
     }, []);
    
    const handleProfileDeletion = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const readProfile = async () => {
        try {
            const response = axios.get<User>('http://localhost:3000/profile');
            response.then((user) => {
                setUsername(user.data.username);
                setPassword(user.data.password);
                console.log(user.data.username);
                console.log(user);
            });
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };


    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}
        >
            <Grid item xs={3}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ textAlign: 'center' }}>Login</h2>
                    <form onSubmit={handleProfileDeletion}>
                        <div style={{ marginBottom: '8px' }}>
                            <Typography variant="h5" gutterBottom>
                                {username}
                            </Typography>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Typography variant="h5" gutterBottom>
                                {password}
                            </Typography>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Button variant="contained" type="submit">Login</Button>
                        </div>
                        <div>
                            Are you not registered?
                            <div style={{ marginTop: '8px' }}>
                                <Link to="/registration">
                                    <Button variant="contained">Sign Up</Button>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};

export default ProfilePage;
