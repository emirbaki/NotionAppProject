const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000; // Or any port you prefer

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@dessistweb.j0eksb7.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema for the user data
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Route to handle form submission
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    // Save the user data to MongoDB
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(200).send('User registered successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
