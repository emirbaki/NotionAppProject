import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, Avatar } from '@mui/material';
import { _Friendship, User } from '../utils/Interfaces';
import { capitalizeFirstLetter, stringAvatar, stringToColor } from '../utils/Util';

interface ShareDialogProps {
    open: boolean;
    onClose: () => void;
    collectionName: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, collectionName }) => {
    const [friends, setFriends] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const _username = sessionStorage.getItem("username");
    useEffect(() => {
        if (open) {
            fetchFriendships();
        }
    }, [open]);
    const fetchFriendships = () => {
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
                        setFriends(profiles.filter(profile => profile !== null)); // Filter out null profiles
                    })
                    .catch(error => {
                        console.error('Error fetching user profiles:', error);
                        setFriends([]); // Clear search results if error occurs
                    });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setFriends([]); // Clear search results if error occurs
            });
    };
    const handleShare = async () => {
        try {
            const token = sessionStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Send notification to other user
                selectedUsers.forEach(async (selectedUserId) => {
                await axios.post('http://localhost:3000/notifications/', {
                    user: _username, // Sender ID
                    recipient: selectedUserId, // Recipient ID
                    type: 'sharing_request', // Notification type
                    content: `You have a new sharing request for collection ${collectionName}.`, // Notification content
                });
            });
    
            // Close the dialog
            onClose();
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    const handleCheckboxChange = (userId: string) => {
        // Find the index of the user in the selectedUsers array
        const selectedIndex = selectedUsers.indexOf(userId);

        // If the user is not already selected, add it to the selectedUsers array
        if (selectedIndex === -1) {
            setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, userId]);
        } else {
            // If the user is already selected, remove it from the selectedUsers array
            setSelectedUsers(prevSelectedUsers => prevSelectedUsers.filter((id) => id !== userId));
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Share Collection</DialogTitle>
            <DialogContent>
                {friends.map(user => (
                    <FormControlLabel
                        key={user._id}
                        control={
                            <div>
                                <Checkbox checked={selectedUsers.includes(user._id)} onChange={() => handleCheckboxChange(user._id)} />
                                <Avatar {...stringAvatar(capitalizeFirstLetter(capitalizeFirstLetter(user.name) + ' ' + capitalizeFirstLetter(user.surname)))} sx={{ bgcolor: stringToColor(capitalizeFirstLetter(user.name) + ' ' + capitalizeFirstLetter(user.surname)) }} />
                            </div>
                        }// Set checked state based on existing sharing status
                        label={
                            user.username}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleShare}>Share</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareDialog;