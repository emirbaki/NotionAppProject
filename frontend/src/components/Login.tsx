import React, { useState, FormEvent } from 'react';
import { TextField, Button, Grid, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import { User } from '../utils/Interfaces';



const LoginPage: React.FC = () => {
    
    const [_username, setUsername] = useState('');
    const [_password, setPassword] = useState('');
    const [alert, setAlert] = useState<{ open: boolean, message: string, severity: 'error' | 'success' }>({ open: false, message: '', severity: 'error' });

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const response = await axios.post('http://localhost:3000/users/login', { username: _username, password: _password });
            console.log(response);

            if (response.status === 200) {
                sessionStorage.setItem("username", _username);
                sessionStorage.setItem("password", _password);
                try {
                    const response_2 = axios.get<User>(`http://localhost:3000/profile/${_username}`);
                    response_2.then((user) => {
                        sessionStorage.setItem("email", user.data.email);
                        sessionStorage.setItem("name", user.data.name);
                        sessionStorage.setItem("surname", user.data.surname);
                        localStorage.setItem("token", response.data.token);
    
                window.location.href = "http://localhost:3001/";
                    });
                } catch (error) {
                    console.error('Error fetching notes:', error);
                }
                
            } else {
                setAlert({ open: true, message: 'Login failed. Please check your credentials.', severity: 'error' });
            }

            // Clear the form fields after handling the response
            setUsername('');
            setPassword('');

        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
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
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </Grid>
            {alert.open && (
                <Alert severity={alert.severity} onClose={handleCloseAlert}>
                    {alert.message}
                </Alert>
            )}
        </Grid>
    );
};

export default LoginPage;
