import React, { useEffect } from 'react';
import {Typography, Paper, IconButton} from '@mui/material';
import { Notification as NotificationModel } from '../utils/Interfaces'; // Assuming you have defined the types for your notification model
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// Define props interface for Notification component
interface NotificationProps {
  notification: NotificationModel;
}

// Notification component
const Notification: React.FC<NotificationProps> = ({ notification }) => {

  return (
    <Paper elevation={3}>
      <Typography variant="h6" gutterBottom>
        Notification
      </Typography>
      <Typography variant="body1">
        Type: {notification.type}
      </Typography>
      {notification.content && (
        <Typography variant="body2" color="textSecondary">
          Content: {notification.content}
        </Typography>
      )}
      <Typography variant="caption" color="textSecondary">
        {notification.read ? 'Read' : 'Unread'}
      </Typography>
    </Paper>
  );
};

interface MyComponentProps {
  userId: string; // User ID for fetching notifications
}

const NotificationMenu: React.FC<MyComponentProps> = ({userId}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [notifications, setNotifications] = React.useState<NotificationModel[]>([]); // State for user notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/notifications/${userId}`); // Example API call
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data); // Update state with fetched notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Handle errors appropriately, e.g., display an error message
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component mount
  }, [userId]);

  return <div>
          <IconButton aria-controls={anchorEl ? 'notification-menu' : undefined} aria-haspopup="true" onClick={handleClick}>
          <CircleNotificationsIcon/>
          </IconButton>
  <Menu

        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}>
          {notifications.map((notification) => (
          <MenuItem key={notification._id} onClick={handleClose}>
            {/* Display notification content */}
            <Notification notification={notification}></Notification>
          </MenuItem>
        ))}
        {notifications.length === 0 && (
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">No notifications</Typography>
          </MenuItem>
        )}
    </Menu>
  </div>
}
export default NotificationMenu;
