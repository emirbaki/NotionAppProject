import React, { useState, FormEvent } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests

const RegistrationPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Send the form data to the backend server
            await axios.post('/api/registration', { username, password });

            // Clear the form fields after successful registration
            setUsername('');
            setPassword('');

            // Optionally, you can redirect the user to another page
            // history.push('/dashboard');
        } catch (error) {
            console.error('Error registering user:', error);
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
                    <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
                    <form onSubmit={handleRegister}>
                        <div style={{ marginBottom: '8px' }}>
                            <TextField
                                variant="outlined"
                                type="text"
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <TextField
                                variant="outlined"
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <Button variant="contained" type="submit">Sign Up</Button>
                        </div>
                        <div>
                            Are you registered yet?
                            <div style={{ marginTop: '8px' }}>
                                <Link to="/login">
                                    <Button variant="contained">Login</Button>
                                </Link></div>
                        </div>
                    </form>
                </div>
            </Grid>
        </Grid>
    );

};

export default RegistrationPage;
