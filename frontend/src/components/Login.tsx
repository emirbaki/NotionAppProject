import React, { useState, FormEvent } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests

const LoginPage: React.FC = () => {
    const [_username, setUsername] = useState('');
    const [_password, setPassword] = useState('');

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Here you can add your authentication logic
        // For example, you can send a request to your backend server to verify the credentials

        // For demonstration, let's just log the username and password
        try {
            // Send the form data to the backend server
            const response = await axios.post('http://localhost:3000/api/login', { username: _username, password : _password });
            console.log(response);
            if(response.status === 200){

            }
            // Clear the form fields after successful registration
            setUsername('');
            setPassword('');
            
            window.location.href = "http://localhost:3001/";

            // Optionally, you can redirect the user to another page
            // history.push('/dashboard');
        } catch (error) {
            console.error('Error registering user:', error);
        }

        // After successful authentication, you can redirect the user to another page
        // For example, you can use React Router: history.push('/dashboard');
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
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '8px' }}>
                            <TextField
                                variant="outlined"
                                type="text"
                                label="Username"
                                value={_username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <TextField
                                variant="outlined"
                                type="password"
                                label="Password"
                                value={_password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <Button variant="contained" type="submit">Login</Button>
                        </div>
                        <div>
                            Are you not registered?
                            <div style={{ marginTop: '8px' }}>
                            <Link to="/registration">
                                <Button variant="contained">Sign Up</Button>
                            </Link></div> 
                        </div>
                        
                    </form>
                </div>
            </Grid>
        </Grid>
    );

};

export default LoginPage;
